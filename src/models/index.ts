import mongoose, { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

// Models are typed loosely on purpose: Mongoose inferred generics make the TypeScript checker run out of memory
// with this many schemas. All inputs are validated with Zod before they reach the database.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyModel = Model<any>;
function getModel<_T = unknown>(name: string, schema: Schema): AnyModel {
  return (models[name] as AnyModel) || model(name, schema);
}

/* ---------------- Auth ---------------- */
const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "Administrator" },
    passwordHash: { type: String, required: true },
    lastLoginAt: Date,
  },
  { timestamps: true },
);
export type AdminUserDoc = InferSchemaType<typeof AdminUserSchema>;
export const AdminUser = getModel<AdminUserDoc>("AdminUser", AdminUserSchema);

const AdminSessionSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true, index: true },
    expiresAt: { type: Date, required: true },
    userAgent: String,
  },
  { timestamps: true },
);
AdminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const AdminSession = getModel<InferSchemaType<typeof AdminSessionSchema>>("AdminSession", AdminSessionSchema);

const RateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const RateLimit = getModel<InferSchemaType<typeof RateLimitSchema>>("RateLimit", RateLimitSchema);

/* ---------------- Leads ---------------- */
export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
const BookingSchema = new Schema(
  {
    reference: { type: String, required: true, unique: true },
    name: { type: String, required: true, maxlength: 120 },
    email: { type: String, required: true, maxlength: 200 },
    phone: { type: String, required: true, maxlength: 40 },
    service: { type: String, required: true, maxlength: 120 },
    address: { type: String, required: true, maxlength: 300 },
    date: { type: String, required: true }, // YYYY-MM-DD in booking time zone
    time: { type: String, default: "" }, // HH:mm (scheduled mode) — empty in request mode
    timeWindow: { type: String, default: "" }, // request mode preferred window
    timeZone: { type: String, required: true },
    mode: { type: String, enum: ["scheduled", "request"], required: true },
    description: { type: String, default: "", maxlength: 3000 },
    notes: { type: String, default: "", maxlength: 3000 },
    status: { type: String, enum: BOOKING_STATUSES, default: "pending", index: true },
    adminNotes: { type: String, default: "", maxlength: 3000 },
    holdsSlot: { type: Boolean, default: false },
  },
  { timestamps: true },
);
BookingSchema.index({ date: 1, time: 1 });
BookingSchema.index({ createdAt: -1 });
export type BookingDoc = InferSchemaType<typeof BookingSchema>;
export const Booking = getModel<BookingDoc>("Booking", BookingSchema);

/** Atomic per-slot counter used to prevent double bookings under concurrency. */
const BookingSlotSchema = new Schema({
  key: { type: String, required: true, unique: true }, // `${date}|${time}`
  date: { type: String, required: true, index: true },
  count: { type: Number, default: 0 },
});
export const BookingSlot = getModel<InferSchemaType<typeof BookingSlotSchema>>("BookingSlot", BookingSlotSchema);

const BookingAvailabilitySchema = new Schema(
  { key: { type: String, default: "default", unique: true }, data: { type: Schema.Types.Mixed, default: {} } },
  { timestamps: true, minimize: false },
);
export const BookingAvailability = getModel<InferSchemaType<typeof BookingAvailabilitySchema>>(
  "BookingAvailability",
  BookingAvailabilitySchema,
);

export const INQUIRY_STATUSES = ["new", "read", "archived"] as const;
const ContactInquirySchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    email: { type: String, required: true, maxlength: 200 },
    phone: { type: String, default: "", maxlength: 40 },
    service: { type: String, default: "", maxlength: 120 },
    subject: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 5000 },
    status: { type: String, enum: INQUIRY_STATUSES, default: "new", index: true },
  },
  { timestamps: true },
);
ContactInquirySchema.index({ createdAt: -1 });
export const ContactInquiry = getModel<InferSchemaType<typeof ContactInquirySchema>>("ContactInquiry", ContactInquirySchema);

export const QUOTE_STATUSES = ["new", "contacted", "quoted", "won", "lost", "archived"] as const;
const QuoteRequestSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    email: { type: String, required: true, maxlength: 200 },
    phone: { type: String, required: true, maxlength: 40 },
    service: { type: String, required: true, maxlength: 120 },
    location: { type: String, required: true, maxlength: 300 },
    description: { type: String, required: true, maxlength: 5000 },
    contactMethod: { type: String, enum: ["email", "phone", "text"], default: "email" },
    status: { type: String, enum: QUOTE_STATUSES, default: "new", index: true },
    adminNotes: { type: String, default: "", maxlength: 3000 },
  },
  { timestamps: true },
);
QuoteRequestSchema.index({ createdAt: -1 });
export const QuoteRequest = getModel<InferSchemaType<typeof QuoteRequestSchema>>("QuoteRequest", QuoteRequestSchema);

/* ---------------- Content ---------------- */
const ServiceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    shortTitle: { type: String, default: "" },
    summary: { type: String, default: "" },
    description: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    details: { type: String, default: "" },
    cardImage: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export const Service = getModel<InferSchemaType<typeof ServiceSchema>>("Service", ServiceSchema);

const GalleryImageSchema = new Schema(
  {
    image: { type: String, required: true },
    alt: { type: String, required: true, maxlength: 200 },
    caption: { type: String, default: "", maxlength: 120 },
    category: { type: String, default: "" },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const GalleryImage = getModel<InferSchemaType<typeof GalleryImageSchema>>("GalleryImage", GalleryImageSchema);

const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    location: { type: String, default: "", maxlength: 120 },
    quote: { type: String, required: true, maxlength: 2000 },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    email: { type: String, default: "", maxlength: 200 }, // private: never shown publicly
    source: { type: String, enum: ["admin", "website"], default: "admin" },
    image: { type: String, default: "" },
    approved: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export const Testimonial = getModel<InferSchemaType<typeof TestimonialSchema>>("Testimonial", TestimonialSchema);

const FAQSchema = new Schema(
  {
    question: { type: String, required: true, maxlength: 300 },
    answer: { type: String, required: true, maxlength: 5000 },
    category: { type: String, default: "General" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export const FAQ = getModel<InferSchemaType<typeof FAQSchema>>("FAQ", FAQSchema);

const SupplierLinkSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 120 },
    url: { type: String, required: true, maxlength: 500 },
    description: { type: String, default: "", maxlength: 300 },
    logo: { type: String, default: "" },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export const SupplierLink = getModel<InferSchemaType<typeof SupplierLinkSchema>>("SupplierLink", SupplierLinkSchema);

const PageContentSchema = new Schema(
  { key: { type: String, required: true, unique: true }, data: { type: Schema.Types.Mixed, default: {} } },
  { timestamps: true, minimize: false },
);
export const PageContent = getModel<InferSchemaType<typeof PageContentSchema>>("PageContent", PageContentSchema);

/** Singleton documents keyed by `key`: "site" (settings), "financing", "meta" (internal flags). */
const SiteSettingsSchema = new Schema(
  { key: { type: String, required: true, unique: true }, data: { type: Schema.Types.Mixed, default: {} } },
  { timestamps: true, minimize: false },
);
export const SiteSettings = getModel<InferSchemaType<typeof SiteSettingsSchema>>("SiteSettings", SiteSettingsSchema);

/* ---------------- Uploads ---------------- */
export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
const StoredUploadSchema = new Schema(
  {
    folder: { type: String, enum: UPLOAD_FOLDERS, required: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);
StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });
export const StoredUpload = getModel<InferSchemaType<typeof StoredUploadSchema>>("StoredUpload", StoredUploadSchema);

export { mongoose };
