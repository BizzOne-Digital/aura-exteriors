/** Site photography. Primary images are served from /public; a few varied placeholders add diversity until more client photos arrive. All are replaceable from the Admin Portal. */
const u = (id: string, w = 2400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMG = {
  heroDusk: "/hero-roofline.webp", // 2400x1350 — homepage hero, booking, about story
  mansionDusk: "/about-mansion.webp", // 2400x1350 — homepage about, about hero
  modernDusk: "/home-shine.webp", // 2400x1350 — services hero
  modernNight: "/final-cta.webp", // 2400x1350 — final CTA
  villaPoolDusk: "/landscape-courtyard.webp", // 2400x1350 — landscape service, financing
  stonePatioDusk: "/exterior-patio.webp", // 2400x1350 — exterior improvements
  cardRoofline: "/service-roofline.webp", // 1600x1280
  cardLandscape: "/service-landscape.webp", // 1600x1280
  cardExterior: "/service-exterior.webp", // 1600x1280
  logo: "/aura-exteriors-logo.png", // 1760x700

  // Variety placeholders (different homes and settings)
  altModernDusk: u("1600585154526-990dced4db0d"), // contemporary home at dusk
  altModernNight: u("1600566753376-12c8ab7fb75b"), // modern facade at night
  altCourtyard: u("1416331108676-a22ccb276e35"), // courtyard and pool at dusk
  altPatio: u("1599809275671-b5942cabc7a2"), // stone patio at sunset
  altTree: u("1470246973918-29a93221c455"), // illuminated tree at night
  altGarden: u("1585320806297-9794b3e4eeae", 1600), // garden pathway
};
