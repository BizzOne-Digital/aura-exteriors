import { IMG } from "./images";

export const SERVICE_SLUGS = ["roofline-lighting", "landscape-lighting", "exterior-improvements"] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const COMPANY_DESCRIPTION =
  "With nearly 40 years of industry experience, Aura Exteriors has established itself as a trusted leader in outdoor and landscape lighting solutions. We are dedicated to enhancing the beauty, safety, functionality, and curb appeal of every home through thoughtful design, premium products, and expert installation. Our commitment to quality craftsmanship and meticulous attention to detail sets us apart in the industry.";

export const defaultSettings = {
  siteName: "Aura Exteriors",
  tagline: "Outdoor Lighting & Exterior Enhancements",
  logoUrl: "",
  phone: "(762) 763-7647",
  email: "kgraham@aura-exteriors.com",
  contactPerson: "Kevin Graham",
  address: "",
  mapEmbedUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  footerDescription:
    "Luxury outdoor lighting and exterior enhancements designed to elevate the beauty, safety, and functionality of your home.",
  seoTitle: "Aura Exteriors | Luxury Outdoor Lighting & Exterior Enhancements",
  seoDescription:
    "Permanent roofline lighting, integrated landscape lighting, gutter guards, high window cleaning, and exterior washing. Nearly 40 years of experience. Request a free consultation.",
  ogImage: IMG.heroDusk,
  notifyEmail: "",
  sendCustomerConfirmations: true,
};
export type SiteSettingsData = typeof defaultSettings;

export const defaultFinancing = {
  enabled: true,
  providerName: "Hearth",
  logoUrl: "",
  heading: "Financing Available Through Hearth",
  text: "Explore flexible financing options for your exterior improvement project.",
  buttonLabel: "Learn More About Financing",
  url: "",
  calloutHeading: "Bring Your Vision to Life.",
  calloutText: "Explore financing options for your next exterior improvement.",
  calloutImage: IMG.villaPoolDusk,
  disclaimer:
    "Financing is offered through a third-party provider and is subject to the provider's terms, credit review, and approval. Aura Exteriors does not guarantee financing approval or specific terms.",
};
export type FinancingData = typeof defaultFinancing;

export const defaultAvailability = {
  enabled: false,
  timeZone: "America/New_York",
  days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
  startTime: "09:00",
  endTime: "17:00",
  slotMinutes: 60,
  capacityPerSlot: 1,
  minNoticeHours: 24,
  maxAdvanceDays: 60,
  blockedDates: [] as string[],
};
export type AvailabilityData = typeof defaultAvailability;

export const defaultHome = {
  hero: {
    highlight: "Illuminate",
    headline: "the beauty of your home and enhance its curb appeal.",
    description:
      "Luxury outdoor lighting and exterior improvements designed to elevate the beauty, safety, and functionality of your home.",
    image: IMG.heroDusk,
    primaryCta: "Get a Free Consultation",
    secondaryCta: "Book Online",
  },
  trust: [
    { title: "Nearly 40 Years", subtitle: "of Experience" },
    { title: "Premium", subtitle: "Products" },
    { title: "Expert", subtitle: "Installation" },
    { title: "Trusted &", subtitle: "Reliable" },
  ],
  services: {
    heading: "Our Services",
    description: "Premium lighting and exterior solutions that bring lasting beauty and value to your home.",
  },
  ladder: {
    label: "Safer. Easier. Done For You.",
    heading: "Never Climb a Ladder Again.",
    text: "Our services take the riskiest, most tiring exterior chores off your list for good. No more hanging Christmas lights, cleaning out gutters, or balancing on a ladder to wash high windows.",
    items: [
      { title: "Christmas Lights, Without the Ladder", text: "Permanent lights stay up all year and switch to holiday colors with a tap. Nothing to hang, nothing to take down.", image: IMG.cardRoofline, link: "/services/roofline-lighting" },
      { title: "Protected Gutters", text: "Gutter guard installation keeps leaves and debris out, so you can stop climbing up to clean them.", image: IMG.cardExterior, link: "/services/exterior-improvements" },
      { title: "Clean, High Windows", text: "Professional high window cleaning for sparkling glass on every floor, without the risk.", image: IMG.altModernNight, link: "/services/exterior-improvements" },
    ],
  },
  occasions: {
    label: "Every Color. Every Occasion.",
    heading: "Lights for Every Holiday, Game Day, and Celebration.",
    text: "Your permanent lights aren't just for Christmas. With millions of color combinations and patterns controlled from an app on your phone, your home can celebrate every season, cheer on your team, and mark life's special moments, then return to elegant warm white every evening.",
    smartHeading: "Smart, Simple Control",
    smartPoints: [
      "Millions of color combinations and patterns",
      "Control everything from an app on your phone",
      "Schedules and timers that run automatically",
      "Works with smart home controls like Amazon Alexa and Google Assistant",
    ],
    items: [
      { title: "Christmas", text: "Classic red, green, and white, or twinkling patterns that bring the season to life.", colors: "#e0313a,#2fa84f,#ffffff", image: "/occasions/christmas-night.webp" },
      { title: "Halloween", text: "Spooky orange and purple glow for trick-or-treat night.", colors: "#ff7a1a,#8e3df0", image: "/occasions/halloween-night.webp" },
      { title: "Fourth of July", text: "Red, white, and blue to celebrate Independence Day.", colors: "#e0313a,#ffffff,#2f5bea", image: "/occasions/fourth-of-july-night.webp" },
      { title: "Game Day", text: "Show your team spirit with your favorite team's colors for every big game.", colors: "#1d4ed8,#f5b301", image: "/occasions/game-day-night.webp" },
      { title: "Valentine's Day", text: "Soft pinks and reds for a romantic evening.", colors: "#ff5fa2,#e0313a,#ffd1e3", image: "/occasions/valentines-day-night.webp" },
      { title: "St. Patrick's Day", text: "Every shade of green for a festive celebration.", colors: "#2fa84f,#7be08f,#0f7a33", image: "/occasions/st-patricks-day-night.webp" },
      { title: "Birthdays & Celebrations", text: "Custom colors for birthdays, anniversaries, graduations, and gender reveals.", colors: "#ff4d4d,#ffb020,#3ddc84,#3d8bff,#b04dff", image: "/occasions/birthdays-night.webp" },
      { title: "Everyday Elegance", text: "Warm white architectural lighting that makes your home glow every night.", colors: "#ffd9a0,#fff1d6", image: "/occasions/everyday-elegance-night.webp" },
    ],
  },
  about: {
    label: "The Aura Difference",
    heading: "Crafting Extraordinary Exteriors for Nearly Four Decades.",
    body: COMPANY_DESCRIPTION,
    image: IMG.mansionDusk,
    button: "Discover Our Story",
  },
  why: {
    label: "Why Aura",
    heading: "Thoughtfully Designed. Expertly Installed.",
    items: [
      { title: "Decades of Industry Experience", text: "Nearly 40 years of hands-on expertise in outdoor and landscape lighting." },
      { title: "Thoughtful Lighting Design", text: "Every plan is shaped around your home's architecture, landscape, and the way you live outdoors." },
      { title: "Premium Product Selection", text: "Quality low voltage fixtures and materials chosen for lasting beauty and performance." },
      { title: "Meticulous Craftsmanship", text: "Careful, detail-focused installation that respects your home and property." },
    ],
  },
  transform: {
    heading: "Your Home Deserves to Shine.",
    text: "Discover how expertly designed outdoor lighting can transform the character of your property.",
    image: IMG.altModernDusk,
    button: "Explore Our Services",
  },
  process: {
    label: "Our Process",
    heading: "From Vision to Illumination.",
    steps: [
      { title: "Initial Consultation", text: "We listen to your goals, walk your property, and discuss how you want your home to feel after dark." },
      { title: "Custom Design Planning", text: "We develop a lighting and exterior plan tailored to your architecture, landscape, and priorities." },
      { title: "Professional Installation", text: "Our team installs your system with care, precision, and respect for your home." },
      { title: "Final Walkthrough", text: "We review the finished result with you and make sure everything looks and works as intended." },
    ],
  },
  gallery: {
    label: "Lighting Inspiration",
    heading: "See the Transformation.",
    note: "Illustrative imagery shown for design inspiration.",
  },
  faq: { heading: "Frequently Asked Questions" },
  finalCta: {
    heading: "Let's Illuminate Something Extraordinary.",
    text: "Transform your home's exterior with thoughtful design and expert installation.",
    image: IMG.modernNight,
    button: "Schedule a Consultation",
  },
};
export type HomeContent = typeof defaultHome;

export const defaultAbout = {
  hero: {
    label: "About Aura Exteriors",
    heading: "Nearly 40 Years of Experience. One Commitment to Excellence.",
    image: IMG.mansionDusk,
  },
  story: {
    label: "Our Story",
    heading: "A trusted name in outdoor and landscape lighting.",
    body: COMPANY_DESCRIPTION,
    image: IMG.heroDusk,
  },
  philosophy: {
    label: "Our Philosophy",
    heading: "Light should feel like it has always belonged to the home.",
    body: "We believe great exterior lighting is felt before it is noticed. Rather than flooding a property with brightness, we use light to reveal texture, guide movement, and frame the architecture you love, creating a home that feels warm, welcoming, and secure every evening.",
    image: IMG.altPatio,
  },
  commitments: {
    heading: "Our Commitment",
    items: [
      { title: "Thoughtful Design", text: "Each plan starts with your home's architecture, landscape, and how you use your outdoor spaces." },
      { title: "Premium Products", text: "We select quality fixtures and materials designed for long-term outdoor performance." },
      { title: "Expert Installation", text: "Careful workmanship, clean wiring, and close attention to every detail." },
      { title: "Lasting Value", text: "Improvements that enhance beauty, safety, function, and curb appeal for years to come." },
    ],
  },
  reasons: {
    heading: "Why Homeowners Choose Aura Exteriors",
    items: [
      "Nearly 40 years of outdoor and landscape lighting experience",
      "Lighting designed around your property, not a one-size-fits-all package",
      "Premium products and meticulous installation",
      "Clear communication from consultation through final walkthrough",
      "Financing options available through Hearth",
    ],
    image: IMG.altCourtyard,
  },
};
export type AboutContent = typeof defaultAbout;

export const defaultServicesPage = {
  hero: {
    label: "Our Services",
    heading: "Exceptional Outdoor Lighting. Extraordinary First Impressions.",
    intro:
      "From permanent roofline lighting to integrated landscape lighting and exterior home improvements, every Aura Exteriors service is designed to elevate how your home looks, feels, and functions after dark.",
    image: IMG.modernDusk,
  },
};
export type ServicesPageContent = typeof defaultServicesPage;

export const defaultPricing = {
  hero: {
    label: "Pricing",
    heading: "Your Home Is Unique. Your Investment Should Be Too.",
    intro:
      "Every property is different, so we don't offer one-size-fits-all pricing. Your personalized quote reflects your property's requirements, your design preferences, the project scope, selected materials, and installation details.",
    image: IMG.altCourtyard,
  },
  factors: ["Property requirements", "Design preferences", "Project scope", "Materials and fixtures", "Installation details"],
  steps: [
    { title: "Share Your Vision", text: "Tell us about your property and what you'd like to achieve using the form below or by phone." },
    { title: "Consultation", text: "We discuss your goals and review your property's requirements." },
    { title: "Personalized Proposal", text: "You receive a quote tailored to your design, scope, and materials." },
    { title: "Schedule Installation", text: "Once approved, we plan your installation at a convenient time." },
  ],
};
export type PricingContent = typeof defaultPricing;

export const PAGE_DEFAULTS = {
  home: defaultHome,
  about: defaultAbout,
  services: defaultServicesPage,
  pricing: defaultPricing,
} as const;
export type PageKey = keyof typeof PAGE_DEFAULTS;


export const defaultServices = [
  {
    slug: "roofline-lighting",
    title: "Low Voltage Permanent Roofline Lighting",
    shortTitle: "Roofline Lighting",
    summary: "Permanent, app-controlled multicolor lights for every holiday, game day, and special occasion, so you never have to climb a ladder to hang Christmas lights again.",
    description:
      "Permanent roofline lighting outlines the eaves, peaks, and gables of your home with discreet low voltage fixtures that stay up all year. Choose from millions of color combinations and patterns right from an app on your phone: warm white for everyday elegance, red and green for Christmas, orange and purple for Halloween, red, white, and blue for the Fourth of July, or your favorite team's colors on game day. The system can also be integrated with smart home controls like Amazon Alexa and Google Assistant.",
    benefits: [
      "Never get on a ladder to hang Christmas lights again",
      "Millions of color combinations and patterns",
      "App controlled from your phone, anytime, anywhere",
      "Works with smart home controls like Alexa and Google Assistant",
      "Ready for every holiday, sporting event, and special occasion",
      "Discreet fixtures that blend into your roofline by day",
    ],
    details:
      "Use your lights all year round: classic warm white every evening, festive patterns for Christmas, Halloween, Valentine's Day, St. Patrick's Day, and the Fourth of July, team colors for game day, and custom colors for birthdays, anniversaries, graduations, and celebrations. Each system is planned around the lines and proportions of your home so it looks clean and intentional, day and night.",
    cardImage: IMG.cardRoofline,
    heroImage: IMG.heroDusk,
    order: 0,
  },
  {
    slug: "landscape-lighting",
    title: "Integrated Landscape Lighting",
    shortTitle: "Landscape Lighting",
    summary: "Pathway, tree, garden, and architectural uplighting that brings your outdoor spaces to life after dark.",
    description:
      "Integrated landscape lighting combines pathway lights, tree illumination, garden accents, and architectural uplighting into one cohesive design. The result is an outdoor environment that is beautiful, easier to navigate, and more inviting for evenings at home.",
    benefits: [
      "Pathway lighting for safer, more welcoming walkways",
      "Tree and garden illumination for depth and drama",
      "Architectural uplighting that showcases stone, columns, and facades",
      "Extends the hours you can enjoy your outdoor spaces",
      "A cohesive design across your entire property",
    ],
    details:
      "We plan landscape lighting in layers: guiding light along paths, sculptural light on trees and plantings, and accent light on the home itself, so every area feels connected and balanced.",
    cardImage: IMG.cardLandscape,
    heroImage: IMG.villaPoolDusk,
    order: 1,
  },
  {
    slug: "exterior-improvements",
    title: "Exterior Home Improvements",
    shortTitle: "Exterior Improvements",
    summary: "High window cleaning, gutter guard installation, and house, driveway, and walkway washing, so you never have to get on a ladder again.",
    description:
      "Keep your home looking its best without the risk and hassle of doing it yourself. Aura Exteriors handles the high, hard-to-reach, and time-consuming exterior work: sparkling clean windows, protected gutters, and freshly washed siding, driveways, and walkways. Every job is completed with the same care and attention to detail that defines our lighting work.",
    benefits: [
      "High window cleaning",
      "Gutter guard installation",
      "House washing",
      "Driveway washing",
      "Walkway washing",
      "No more climbing ladders for clean windows or clogged gutters",
    ],
    details:
      "Protected gutters, clean windows, and a freshly washed exterior instantly improve curb appeal and help protect your home. Combine exterior services with permanent lighting for a home that looks its best day and night. Contact us for a personalized quote.",
    cardImage: IMG.cardExterior,
    heroImage: IMG.stonePatioDusk,
    order: 2,
  },
];
export type ServiceData = (typeof defaultServices)[number] & { _id?: string };

export const FAQ_CATEGORIES = ["General", "Roofline Lighting", "Landscape Lighting", "Exterior Improvements", "Financing", "Booking"];

export const defaultFaqs = [
  { question: "What is permanent roofline lighting?", answer: "Permanent roofline lighting is a low voltage lighting system installed along the eaves, peaks, and edges of your roof. It stays up year-round, so you never have to hang or take down holiday lights again, and it can display millions of colors and patterns controlled from an app.", category: "Roofline Lighting", featured: true },
  { question: "What are the benefits of landscape lighting?", answer: "Landscape lighting enhances the beauty of your property after dark, highlights trees, gardens, and architectural features, improves visibility along walkways and entrances, and lets you enjoy your outdoor spaces longer into the evening.", category: "Landscape Lighting", featured: true },
  { question: "Do you offer customized lighting solutions?", answer: "Yes. Every property is different, so each lighting plan is designed around your home's architecture, landscape, and goals. We discuss your preferences during your consultation and plan accordingly.", category: "General", featured: true },
  { question: "How can I request an estimate?", answer: "You can request a personalized quote through our Pricing page, submit the contact form, request a consultation online, or call us directly. Because every project is unique, pricing is based on your property's requirements, design preferences, scope, materials, and installation details.", category: "General", featured: true },
  { question: "Is financing available?", answer: "Yes. Financing options are available through Hearth, a third-party financing provider. Financing is subject to the provider's terms and approval. Contact us to learn more.", category: "Financing", featured: true },
  { question: "How do I schedule a consultation?", answer: "Use our online booking page to request a consultation, call us, or send a message through the contact form. We'll follow up to confirm the details.", category: "Booking", featured: true },
  { question: "Will roofline lights be visible during the day?", answer: "Permanent roofline systems are designed to be discreet. Fixture placement and mounting are planned to blend with your home's trim and roofline as much as possible. We can discuss how this applies to your home during your consultation.", category: "Roofline Lighting", featured: false },
  { question: "Can landscape lighting be designed around my existing garden?", answer: "Yes. Integrated landscape lighting is planned around your existing trees, plantings, pathways, and hardscape to highlight what you already love about your property.", category: "Landscape Lighting", featured: false },
  { question: "What kinds of exterior improvements do you offer?", answer: "We offer high window cleaning, gutter guard installation, and house, driveway, and walkway washing. Contact us for a personalized quote for your home.", category: "Exterior Improvements", featured: false },
  { question: "Can I change the colors of my permanent lights?", answer: "Yes. Your permanent lights are app controlled, with millions of color combinations and patterns. Switch to warm white for everyday, festive colors for holidays, your team's colors on game day, or custom colors for birthdays and special occasions, all from your phone.", category: "Roofline Lighting", featured: true },
  { question: "Do the lights work with Alexa or Google Assistant?", answer: "Yes. The lighting system can be integrated with smart home controls like Amazon Alexa and Google Assistant, so you can turn lights on, off, or change scenes with your voice.", category: "Roofline Lighting", featured: false },
  { question: "Can I use my lights all year, not just at Christmas?", answer: "Absolutely. Permanent lights stay up year-round and can be used for every holiday, sporting events, and special occasions like birthdays, anniversaries, and graduations, plus elegant warm white lighting every evening.", category: "Roofline Lighting", featured: false },
  { question: "Will I ever need to climb a ladder again?", answer: "That's the goal. With permanent holiday lights, gutter guards, and professional high window cleaning, the ladder work is handled for you.", category: "General", featured: false },
  { question: "Do I need to create an account to request a quote?", answer: "No. You can request a quote or consultation without creating an account. Simply fill out the form with your contact details and project information.", category: "General", featured: false },
];

export const defaultGallery = [
  { image: IMG.heroDusk, alt: "Stone home with warm permanent roofline lighting at dusk", caption: "Roofline Lighting", category: "roofline-lighting" },
  { image: IMG.villaPoolDusk, alt: "Landscaped front yard with pathway and garden lighting at twilight", caption: "Landscape Lighting", category: "landscape-lighting" },
  { image: IMG.mansionDusk, alt: "Illuminated stone facade and entrance at night", caption: "Architectural Lighting", category: "exterior-improvements" },
  { image: IMG.altModernNight, alt: "Modern home exterior with warm accent lighting at night", caption: "Modern Exterior", category: "exterior-improvements" },
  { image: IMG.stonePatioDusk, alt: "Curved stone walkway with path lights leading to the entrance", caption: "Illuminated Entrance", category: "exterior-improvements" },
  { image: IMG.altCourtyard, alt: "Pool and garden glowing with landscape lighting at dusk", caption: "Poolside Lighting", category: "landscape-lighting" },
  { image: IMG.modernDusk, alt: "Luxury residence with roofline and landscape lighting at dusk", caption: "Residential Exterior", category: "roofline-lighting" },
  { image: IMG.altTree, alt: "Garden pathway lined with path lights and uplit trees", caption: "Garden Pathway", category: "landscape-lighting" },
  { image: IMG.rooflineGable, alt: "Stone gables outlined with permanent roofline lights", caption: "Permanent Roofline Lights", category: "roofline-lighting" },
  { image: IMG.estateFountain, alt: "Estate home with fountain, uplit trees and driveway lighting", caption: "Estate Lighting", category: "landscape-lighting" },
  { image: IMG.altGarden, alt: "Stone entry with lantern sconces and lit steps", caption: "Entry Lighting", category: "exterior-improvements" },
  { image: IMG.altModernDusk, alt: "Contemporary home with soffit, step and landscape lighting", caption: "Contemporary Home", category: "roofline-lighting" },
  { image: IMG.altPatio, alt: "Outdoor living area with fire pit and lit steps at sunset", caption: "Outdoor Living", category: "exterior-improvements" },
];
