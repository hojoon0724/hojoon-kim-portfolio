"use server";
import { headers } from "next/headers";
import nodemailer from "nodemailer";

interface EmailFormData {
  name: string;
  email: string;
  message: string;
  website?: string;
}

const IP_LIMIT_MAX_SUBMISSIONS = 5;
const IP_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const EMAIL_LIMIT_MAX_SUBMISSIONS = 3;
const EMAIL_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const ipSubmissionTimestamps = new Map<string, number[]>();
const emailSubmissionTimestamps = new Map<string, number[]>();

function isRateLimited(
  bucket: Map<string, number[]>,
  key: string,
  maxSubmissions: number,
  windowMs: number,
  now: number,
) {
  const existingTimestamps = bucket.get(key) ?? [];
  const recentTimestamps = existingTimestamps.filter(
    (timestamp) => now - timestamp < windowMs,
  );

  if (recentTimestamps.length >= maxSubmissions) {
    bucket.set(key, recentTimestamps);
    return true;
  }

  recentTimestamps.push(now);
  bucket.set(key, recentTimestamps);

  return false;
}

async function getClientIpAddress() {
  const requestHeaders = await headers();

  const forwardedFor = requestHeaders.get("x-forwarded-for");
  if (forwardedFor) {
    const firstForwardedIp = forwardedFor.split(",")[0]?.trim();
    if (firstForwardedIp) {
      return firstForwardedIp;
    }
  }

  const realIp = requestHeaders.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  const cloudflareIp = requestHeaders.get("cf-connecting-ip")?.trim();
  if (cloudflareIp) {
    return cloudflareIp;
  }

  return null;
}

export async function emailForm({
  name,
  email,
  message,
  website,
}: EmailFormData) {
  // Honeypot — legitimate users should never fill this
  if (website) {
    return {
      success: false,
      message: "Invalid submission.",
    };
  }

  // Basic validation
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return {
      success: false,
      message: "Invalid submission.",
    };
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();

  if (!cleanName || !cleanEmail || !cleanMessage) {
    return {
      success: false,
      message: "All fields are required.",
    };
  }

  // Prevent excessively large submissions
  if (
    cleanName.length > 100 ||
    cleanEmail.length > 254 ||
    cleanMessage.length > 5000
  ) {
    return {
      success: false,
      message: "Submission is too long.",
    };
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  const now = Date.now();
  const clientIpAddress = await getClientIpAddress();

  if (
    clientIpAddress &&
    isRateLimited(
      ipSubmissionTimestamps,
      clientIpAddress,
      IP_LIMIT_MAX_SUBMISSIONS,
      IP_LIMIT_WINDOW_MS,
      now,
    )
  ) {
    return {
      success: false,
      message: "Too many submissions. Please try again later.",
    };
  }

  const normalizedEmail = cleanEmail.toLowerCase();
  if (
    isRateLimited(
      emailSubmissionTimestamps,
      normalizedEmail,
      EMAIL_LIMIT_MAX_SUBMISSIONS,
      EMAIL_LIMIT_WINDOW_MS,
      now,
    )
  ) {
    return {
      success: false,
      message: "Too many submissions. Please try again later.",
    };
  }

  // Send the email using the SMTP server
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `hojoonkim.com <contact@hojoonkim.com>`,
    to: "contact@hojoonkim.com",
    subject: "New Contact Form Submission",
    text: cleanMessage,
    replyTo: `${cleanName} <${cleanEmail}>`,
  };

  try {
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Email sent successfully.",
    };
  } catch (error) {
    console.error("Contact form email error:", error);

    return {
      success: false,
      message: "Failed to send email.",
    };
  }
}
