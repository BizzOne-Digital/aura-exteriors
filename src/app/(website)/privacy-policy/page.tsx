import type { Metadata } from "next";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Aura Exteriors collects and uses information submitted through this website.", alternates: { canonical: "/privacy-policy" } };

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <section className="bg-night pb-24 pt-40">
      <div className="container-lux max-w-3xl">
        <p className="eyebrow mb-4">Legal</p>
        <h1 className="h-display text-5xl text-ivory sm:text-6xl">Privacy Policy</h1>
        <div className="prose-lux mt-10">
          <p>This Privacy Policy explains how {s.siteName} (&quot;we&quot;, &quot;us&quot;) handles information you provide through this website.</p>
          <h2>Information We Collect</h2>
          <p>When you submit a contact form, quote request, or consultation booking, we collect the details you enter, such as your name, email address, phone number, property address or location, and project information.</p>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To respond to your inquiries and provide quotes</li>
            <li>To schedule and manage consultations</li>
            <li>To communicate with you about your project</li>
          </ul>
          <p>We do not sell your personal information.</p>
          <h2>Data Storage &amp; Security</h2>
          <p>Submissions are stored securely and are accessible only to authorized staff. We use reasonable safeguards to protect your information.</p>
          <h2>Third-Party Services</h2>
          <p>Links to third parties, such as financing providers or suppliers, are governed by those parties&apos; own privacy policies.</p>
          <h2>Your Choices</h2>
          <p>You may ask us to access, correct, or delete your information by contacting us at <a className="text-gold underline" href={`mailto:${s.email}`}>{s.email}</a>.</p>
          <h2>Contact</h2>
          <p>Questions about this policy can be sent to {s.email} or by calling {s.phone}.</p>
        </div>
      </div>
    </section>
  );
}
