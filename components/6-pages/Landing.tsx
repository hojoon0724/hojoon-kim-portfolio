"use client";

// import { Button } from "@/components/1-atoms";
import Image from "next/image";

export function Landing() {
  return (
    <div className="landing-container flex flex-col gap-2xl items-center justify-center h-dvh w-full no-main-spacing">
      <h1>Hojoon Kim</h1>
      <div className="flex gap-6">
        <div className="hotel flex gap-2">
          <div className="w-3 h-3 drop-shadow-lg rounded-full bg-[#f9f6f0]"></div>
          <div className="w-3 h-3 drop-shadow-lg rounded-full bg-[#f9f6f0]"></div>
          <div className="w-3 h-3 drop-shadow-lg rounded-full bg-[#a84430]"></div>
          <div className="w-3 h-3 drop-shadow-lg rounded-full bg-[#a84430]"></div>
        </div>
        <div className="kilo flex gap-2">
          <div className="w-10 h-3 drop-shadow-lg rounded-full bg-[#f4b71e]"></div>
          <div className="w-3 h-3 drop-shadow-lg rounded-full bg-[#1b2e4b]"></div>
          <div className="w-10 h-3 drop-shadow-lg rounded-full bg-[#1b2e4b]"></div>
        </div>
      </div>
      <p className="max-w-[400px] text-center">
        Designer and software developer creating products, brands, and media across tech, film, and music.
      </p>
      {/* <div className="nautical-container flex">
        <div className="hotel">
          <Image src="/svg/hk-hotel.svg" alt="nautical flag hotel" width={60} height={60} />
        </div>
        <div className="kilo">
          <Image src="/svg/hk-kilo.svg" alt="nautical flag kilo" width={60} height={60} />
        </div>
      </div> */}
      {/* <Button
        text="contact"
        variant="filled"
        color="accent"
        size="sm"
        onClick={() => {
          window.location.href = "mailto:contact@hojoonkim.com";
        }}
      /> */}
    </div>
  );
}
