import type { Metadata } from "next";
import { Star, MessageSquareQuote } from "lucide-react";
import { PageHero, ConsultationBand } from "@/components/shared/sections";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/motion";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { getSettings, getTestimonials } from "@/lib/data";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Read what homeowners say about Aura Exteriors, and share your own experience.",
  alternates: { canonical: "/reviews" },
};

function Stars({ value, size = "h-4 w-4" }: { value: number; size?: string }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= Math.round(value) ? "fill-gold text-gold" : "text-muted/30"}`} strokeWidth={1.4} />
      ))}
    </span>
  );
}

export default async function ReviewsPage() {
  const [reviews, settings] = await Promise.all([getTestimonials(), getSettings()]);
  const avg = reviews.length ? reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length : 0;

  return (
    <>
      <PageHero eyebrow="Customer Reviews" title="What Our Customers Say." intro="Honest feedback from the homeowners we serve. Worked with us? We'd love to hear about your experience." image={IMG.mansionDusk} imageAlt="Illuminated home at night" short>
        <a href="#write-review" className="btn btn-gold">
          Write a Review
        </a>
      </PageHero>

      <section className="bg-night py-20 md:py-28">
        <div className="container-lux">
          {reviews.length > 0 ? (
            <>
              <Reveal className="mb-12 flex flex-col items-start gap-4 border-b border-line pb-10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="eyebrow mb-2">Overall Rating</p>
                  <div className="flex items-center gap-4">
                    <span className="font-serif text-6xl text-ivory">{avg.toFixed(1)}</span>
                    <div>
                      <Stars value={avg} size="h-5 w-5" />
                      <p className="mt-1 text-sm text-muted">
                        Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Stagger className="columns-1 gap-6 md:columns-2 lg:columns-3">
                {reviews.map((r) => (
                  <StaggerItem key={r._id} className="mb-6 break-inside-avoid">
                    <figure className="card-lux p-7">
                      <Stars value={r.rating} />
                      <blockquote className="mt-4 font-serif text-[1.3rem] leading-relaxed text-ivory">&ldquo;{r.quote}&rdquo;</blockquote>
                      <figcaption className="mt-5 text-sm">
                        <span className="font-semibold text-gold">{r.name}</span>
                        {r.location && <span className="text-muted"> · {r.location}</span>}
                      </figcaption>
                    </figure>
                  </StaggerItem>
                ))}
              </Stagger>
            </>
          ) : (
            <Reveal className="mx-auto max-w-xl text-center">
              <MessageSquareQuote className="mx-auto h-12 w-12 text-gold" strokeWidth={1.2} />
              <h2 className="h-display mt-6 text-4xl text-ivory">Be the first to share your experience.</h2>
              <p className="mt-4 text-muted">Customer reviews will appear here once they have been submitted and approved.</p>
            </Reveal>
          )}
        </div>
      </section>

      <section id="write-review" className="scroll-mt-24 bg-midnight py-20 md:py-28">
        <div className="container-lux grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal direction="left">
            <p className="eyebrow mb-4">Share Your Feedback</p>
            <h2 className="h-display text-4xl text-ivory sm:text-5xl">How did we do?</h2>
            <span className="gold-rule mt-6" />
            <p className="mt-6 leading-relaxed text-muted">
              Your feedback helps us improve and helps other homeowners make confident decisions. Reviews are checked by our team before they are published. Your email address is never shown.
            </p>
          </Reveal>
          <Reveal direction="right">
            <div className="card-lux p-6 sm:p-10">
              <ReviewForm />
            </div>
          </Reveal>
        </div>
      </section>

      <ConsultationBand phone={settings.phone} />
    </>
  );
}
