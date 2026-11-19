import { z } from "zod";

const name = z.string().trim().min(2, "Please enter your full name").max(120);
const email = z.string().trim().toLowerCase().email("Please enter a valid email address").max(200);
const phone = z
  .string()
  .trim()
  .max(40)
  .refine((v) => v.replace(/\D/g, "").length >= 10, "Please enter a valid phone number");
const optionalPhone = z
  .string()
  .trim()
  .max(40)
  .refine((v) => v === "" || v.replace(/\D/g, "").length >= 10, "Please enter a valid phone number");
/** Honeypot: real visitors never see or fill this field. */
const hp = z.string().max(0).optional().or(z.literal(""));

export const SERVICE_OPTIONS = [
  "Low Voltage Permanent Roofline Lighting",
  "Low Voltage Integrated Landscape Lighting",
  "Premium Exterior Home Improvements",
  "Multiple Services / Not Sure Yet",
];

export const contactSchema = z.object({
  name,
  email,
  phone: optionalPhone,
  service: z.string().trim().max(120).optional().default(""),
  subject: z.string().trim().min(2, "Please enter a subject").max(200),
  message: z.string().trim().min(10, "Please tell us a little more (10+ characters)").max(5000),
  website: hp,
});
export type ContactInput = z.input<typeof contactSchema>;

export const quoteSchema = z.object({
  name,
  email,
  phone,
  service: z.string().trim().min(1, "Please choose a service").max(120),
  location: z.string().trim().min(2, "Please enter the property location").max(300),
  description: z.string().trim().min(10, "Please describe your project (10+ characters)").max(5000),
  contactMethod: z.enum(["email", "phone", "text"]),
  website: hp,
});
export type QuoteInput = z.input<typeof quoteSchema>;

export const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date");

export const bookingSchema = z.object({
  name,
  email,
  phone,
  service: z.string().trim().min(1, "Please choose a service").max(120),
  address: z.string().trim().min(5, "Please enter the property address").max(300),
  date: dateString,
  time: z.string().regex(/^(\d{2}:\d{2})?$/).optional().default(""),
  timeWindow: z.string().max(40).optional().default(""),
  description: z.string().trim().max(3000).optional().default(""),
  notes: z.string().trim().max(3000).optional().default(""),
  website: hp,
});
export type BookingInput = z.input<typeof bookingSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password").max(200),
});

export const TIME_WINDOWS = ["Morning", "Midday", "Afternoon", "Flexible"];
