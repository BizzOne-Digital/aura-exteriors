import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/shared/motion";
import { JsonLd } from "@/components/shared/sections";
import { getServices, getSettings, getSuppliers } from "@/lib/data";
import { IMG } from "@/lib/images";
import { siteUrl } from "@/lib/utils";

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services, suppliers] = await Promise.all([getSettings(), getServices(), getSuppliers()]);
  const nav = services.map((s) => ({ slug: s.slug, title: s.title }));
  const url = siteUrl();
  const business: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${url}/#business`,
    name: settings.siteName,
    url,
    logo: `${url}${settings.logoUrl || IMG.logo}`.replace(`${url}http`, "http"),
    image: `${url}${IMG.heroDusk}`,
    telephone: settings.phone,
    email: settings.email,
    description: settings.seoDescription,
    ...(settings.serviceAreaZip && Number(settings.serviceAreaMiles) > 0
      ? {
          areaServed: {
            "@type": "GeoCircle",
            geoMidpoint: { "@type": "GeoCoordinates", postalCode: settings.serviceAreaZip, addressCountry: "US" },
            geoRadius: Math.round(Number(settings.serviceAreaMiles) * 1609.344),
          },
        }
      : {}),
    ...(settings.address ? { address: settings.address } : {}),
    makesOffer: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, url: `${url}/services/${s.slug}` } })),
  };
  return (
    <MotionProvider>
      <JsonLd data={business} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-midnight">
        Skip to content
      </a>
      <Header phone={settings.phone} logoUrl={settings.logoUrl} tagline={settings.tagline} services={nav} />
      <main id="main" className="overflow-x-clip">{children}</main>
      <Footer settings={settings} services={nav} suppliers={suppliers} />
    </MotionProvider>
  );
}
