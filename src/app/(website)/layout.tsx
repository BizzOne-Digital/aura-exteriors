import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/shared/motion";
import { getServices, getSettings, getSuppliers } from "@/lib/data";

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services, suppliers] = await Promise.all([getSettings(), getServices(), getSuppliers()]);
  const nav = services.map((s) => ({ slug: s.slug, title: s.title }));
  return (
    <MotionProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-gold focus:px-4 focus:py-2 focus:text-midnight">
        Skip to content
      </a>
      <Header phone={settings.phone} logoUrl={settings.logoUrl} tagline={settings.tagline} services={nav} />
      <main id="main">{children}</main>
      <Footer settings={settings} services={nav} suppliers={suppliers} />
    </MotionProvider>
  );
}
