"use client";

import { Button, Input, ScrollRevealText, Section } from "@/components/1-atoms";
import { emailForm } from "@/lib/actions";
import { useEffect, useRef, useState } from "react";

export function ContactPage({ id }: { id: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const errorContentRef = useRef<HTMLDivElement>(null);
  const [errorMaxHeight, setErrorMaxHeight] = useState(0);
  const animationMs = 500;

  useEffect(() => {
    if (errorContentRef.current) {
      setErrorMaxHeight(errorContentRef.current.scrollHeight);
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    emailForm(formData)
      .then((res) => {
        if (res.success) {
          setFormStatus("success");
          setTimeout(
            () => setFormData({ name: "", email: "", message: "" }),
            animationMs,
          );
        } else {
          setFormStatus("error");
        }
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        setFormStatus("error");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <Section
        className="about-section relative flex h-dvh max-h-none w-full shrink-0 snap-start flex-col items-center justify-center bg-gray-700"
        data-snap-target
        id={id}
        fullWidth
      >
        <div className="banner-content gap-xl p-md flex w-full max-w-5xl flex-col items-start justify-between md:flex-row md:items-start">
          <div className="title-text-container">
            <h1 className="text md:pr-lg">Contact</h1>
            <p className="roboto-mono max-w-prose py-4 text-balance">
              Have an early product, a complex creative project, or an idea that
              needs to become real?
            </p>
          </div>

          <div
            className={`form-container relative flex h-full w-full justify-start md:justify-end`}
          >
            <div
              className={`message-container roboto-mono pointer-events-none absolute flex h-full w-full items-start justify-start py-4 text-lg md:justify-end md:text-right`}
            >
              {formStatus === "success" && (
                <ScrollRevealText
                  className="max-w-prose text-balance"
                  revealBy="word"
                  delayMs={250}
                  staggerMs={80}
                  text="Message was sent. I'll get back to you soon."
                  wrap={true}
                />
              )}
            </div>
            <form
              className={`contact-form gap-xl animation-1000 grid h-fit w-full overflow-hidden transition-all duration-500 ease-in-out ${formStatus === "success" ? "animation-fade-out-up-16 pointer-events-none" : ""}`}
              onSubmit={handleSubmit}
            >
              <Input
                id="name"
                type="text"
                label="Name"
                value={formData.name}
                onChange={(value) => handleChange("name", value)}
              />
              <Input
                id="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={(value) => handleChange("email", value)}
              />
              <Input
                id="message"
                type="textarea"
                label="Message"
                value={formData.message}
                onChange={(value) => handleChange("message", value)}
              />
              <Button
                type="submit"
                text={
                  submitting
                    ? "Sending..."
                    : formStatus === "success"
                      ? "Sent!"
                      : "Send"
                }
                disabled={submitting}
              />
              <div
                className={`message-container relative w-full overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out ${formStatus === "error" ? "opacity-100" : "opacity-0"}`}
                aria-live="polite"
                aria-hidden={formStatus !== "error"}
                style={{
                  maxHeight:
                    formStatus === "error" && submitting === false
                      ? `${errorMaxHeight}px`
                      : "0px",
                }}
              >
                <div
                  ref={errorContentRef}
                  className="error bg-red-700 px-4 py-2 text-center"
                >
                  <ScrollRevealText
                    className="max-w-prose text-balance"
                    revealBy="word"
                    delayMs={0}
                    staggerMs={40}
                    text="Well, this is awkward. This is broken... send me a DM on Instagram?"
                    wrap={true}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}
