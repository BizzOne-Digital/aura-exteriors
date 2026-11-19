# Aura Exteriors Website

A luxury marketing website with online booking, lead capture, and a secure Admin Portal.
Built with Next.js 15 (App Router), TypeScript, Tailwind CSS 4, MongoDB/Mongoose, Motion, React Hook Form, and Zod.

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD
npm run dev                  # http://localhost:3000
```

The first admin account is created automatically the first time someone signs in at `/admin/login`, using `ADMIN_EMAIL` and `ADMIN_PASSWORD`. This only happens while no admin exists yet. The password must be at least 10 characters.

Starter content (services, FAQs, illustrative gallery) is written to the database on first use, and from then on everything is managed in the Admin Portal.

## Deploying to Vercel

1. Create a MongoDB Atlas cluster and allow Vercel to connect (Network Access → `0.0.0.0/0`, or use the Vercel Atlas integration).
2. Import the repository into Vercel.
3. Add the environment variables from `.env.example` (Production + Preview).
4. Deploy, then sign in at `/admin/login`.

## What Lives Where

| Area | Path |
| --- | --- |
| Public pages | `src/app/(website)/` (Home, About, Services + 3 detail pages, Pricing, Contact, FAQ, Booking, Privacy, Terms) |
| Admin Portal | `src/app/admin/` (login, dashboard, bookings, availability, inquiries, quotes, content, services, gallery, FAQ, testimonials, financing, suppliers, settings) |
| API | `src/app/api/` (public forms, booking, auth, upload, image serving, admin CRUD) |
| Default content | `src/lib/defaults.ts` |
| Models | `src/models/index.ts` |

## Key Behaviors

- **Booking.** With scheduling **off** (the default, since business hours haven't been provided), visitors submit a *consultation request* with a preferred date and time of day, and nothing is presented as a confirmed appointment. Turn on scheduling in **Admin → Availability** (days, hours, time zone, slot length, capacity, notice, blocked dates). Double bookings are prevented with an atomic per-slot counter, and cancelling a booking frees its slot.
- **Email.** Optional. When SMTP variables are set, admins get notified and customers get confirmations. Without SMTP, every submission is still saved, and the site never claims an email was sent.
- **Images.** Uploads are stored in MongoDB (`StoredUpload`) and served from `/api/uploads/{folder}/{file}` with immutable caching, so they survive redeploys. Files are checked by content signature. Replaced or removed images are deleted only when nothing else references them. Images over ~4 MB are resized in the browser first, because Vercel caps request bodies at 4.5 MB.
- **Caching.** Public pages are statically rendered. Every admin save revalidates them immediately. Admin and booking data are never cached publicly. If you edit the database directly (outside the Admin Portal), changes appear within one hour.
- **Security.** Passwords are bcrypt-hashed. Sessions are random tokens stored hashed in MongoDB, using HTTP-only cookies. Every admin API checks the session and the same-origin header. Login and forms are rate-limited through MongoDB, and forms include a honeypot field.

## Client Content Still Needed

- Official logo (Admin → Settings). A temporary SVG wordmark is shown until then.
- Hearth financing URL and approved Hearth logo (Admin → Financing). Until the URL is set, the button routes to the contact form.
- Authentic project photos (Admin → Gallery and Services). Current images are illustrative Unsplash placeholders, labeled "Lighting Inspiration."
- Business hours and time zone (Admin → Availability).
- Facebook URL, business address (optional), and supplier links.
- Genuine, approved testimonials. The section stays hidden until at least one is approved.
- Legal review of the Privacy Policy and Terms pages.
