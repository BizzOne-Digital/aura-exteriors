import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { escapeHtml } from "./utils";

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

let transporter: Transporter | null = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

/** Returns true only if the message was accepted by the SMTP server. Never throws. */
export async function sendMail(to: string, subject: string, rows: [string, string][], intro?: string) {
  if (!isEmailConfigured() || !to) return false;
  const html = `<div style="font-family:Arial,sans-serif;color:#0d1929;max-width:600px">
    <h2 style="font-family:Georgia,serif;color:#07111D;border-bottom:2px solid #D9AD57;padding-bottom:8px">${escapeHtml(subject)}</h2>
    ${intro ? `<p>${escapeHtml(intro)}</p>` : ""}
    <table cellpadding="6" style="border-collapse:collapse;width:100%">${rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td style="font-weight:bold;vertical-align:top;width:170px">${escapeHtml(k)}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`)
      .join("")}</table>
    <p style="color:#6b7280;font-size:12px;margin-top:24px">Aura Exteriors</p></div>`;
  const text = [intro, ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].filter(Boolean).join("\n");
  try {
    await getTransporter().sendMail({ from: process.env.SMTP_FROM, to, subject, html, text });
    return true;
  } catch (err) {
    console.error("[email] send failed:", (err as Error).message);
    return false;
  }
}

export function adminRecipient(settingsNotify?: string, settingsEmail?: string) {
  return process.env.ADMIN_NOTIFY_EMAIL || settingsNotify || settingsEmail || "";
}
