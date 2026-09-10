"use client";

import { useScrollContext } from "@/app/ScrollProvider";
import {
  Button,
  Input,
  Section,
  StaggeredReveal,
  StaggeredTextReveal,
} from "@/components/1-atoms";
import { contactBlacklist } from "@/data/contact-blacklist";
import { emailForm } from "@/actions/actions";
import { useEffect, useRef, useState } from "react";

const isBlacklistedEmail = (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  return contactBlacklist.some((entry) => {
    const normalizedEntry = entry.trim().toLowerCase();

    if (!normalizedEntry.includes("*")) {
      return normalizedEntry === normalizedEmail;
    }

    const escapedPattern = normalizedEntry.replace(
      /[.+?^${}()|[\]\\]/g,
      "\\$&",
    );
    const regexPattern = `^${escapedPattern.replace(/\*/g, ".*")}$`;
    return new RegExp(regexPattern).test(normalizedEmail);
  });
};

export function ContactPage({ id }: { id: string }) {
  const { activeTargetKey } = useScrollContext();
  const animationKey = `${id}-contact`;
  const startAnimation = activeTargetKey === animationKey;

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
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

    // Soft reject: present success UI but skip sending for blacklisted emails.
    if (isBlacklistedEmail(formData.email)) {
      setFormStatus("success");
      setTimeout(
        () => setFormData({ name: "", email: "", message: "", website: "" }),
        animationMs,
      );
      setSubmitting(false);
      return;
    }

    emailForm(formData)
      .then((res) => {
        if (res.success) {
          setFormStatus("success");
          setTimeout(
            () =>
              setFormData({ name: "", email: "", message: "", website: "" }),
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
            <h1 className="text md:pr-lg">
              <StaggeredTextReveal
                text="Contact"
                revealBy="letter"
                className="max-w-prose text-left text-balance"
                delayMs={0}
                staggerMs={80}
                wrap={false}
              />
            </h1>
            <StaggeredTextReveal
              text="Have an early product, a complex creative project, or an idea that needs to become real?"
              className="roboto-mono max-w-prose py-4 text-balance"
              revealBy="word"
              wrap={true}
            />
          </div>

          <div
            className={`form-container relative flex h-full w-full justify-start md:justify-end`}
          >
            <div
              className={`message-container roboto-mono pointer-events-none absolute flex h-full w-full items-start justify-start py-4 text-lg md:justify-end md:text-right`}
            >
              {formStatus === "success" && (
                <StaggeredTextReveal
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
              className={`contact-form gap-xl grid h-fit w-full transition-all duration-500 ease-in-out ${formStatus === "success" ? "animation-fade-out-up-16 pointer-events-none" : ""}`}
              onSubmit={handleSubmit}
            >
              <StaggeredReveal className="contact-form-staggered-reveal gap-xl grid h-fit w-full">
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
              </StaggeredReveal>
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
                  <StaggeredTextReveal
                    className="max-w-prose text-balance"
                    revealBy="word"
                    delayMs={0}
                    staggerMs={40}
                    text="Well, this is awkward. This is broken... send me a DM on Instagram?"
                    wrap={true}
                  />
                </div>
              </div>
              <input
                type="text"
                name="website"
                value={formData.website ?? ""}
                onChange={(e) => handleChange("website", e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}
