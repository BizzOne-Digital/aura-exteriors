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
    "Permanent roofline lighting, integrated landscape lighting, and premium exterior home improvements. Nearly 40 years of experience. Request a free consultation.",
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
    image: IMG.modernDusk,
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
    image: IMG.stonePatioDusk,
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
    image: IMG.villaPoolDusk,
  },
};
export type AboutContent = typeof defaultAbout;

export const defaultServicesPage = {
  hero: {
    label: "Our Services",
    heading: "Exceptional Outdoor Lighting. Extraordinary First Impressions.",
    intro:
      "From permanent roofline lighting to integrated landscape lighting and premium exterior improvements, every Aura Exteriors service is designed to elevate how your home looks, feels, and functions after dark.",
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
    image: IMG.villaPoolDusk,
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
    summary: "Permanent, low voltage lighting that traces your roofline and highlights your home's architecture every night of the year.",
    description:
      "Permanent roofline lighting outlines the eaves, peaks, and gables of your home with discreet low voltage fixtures. Designed to blend into your architecture during the day and showcase it at night, a permanent system enhances curb appeal and creates a warm, welcoming presence, without the hassle of putting up and taking down seasonal lights.",
    benefits: [
      "Highlights rooflines, peaks, and architectural details",
      "Discreet low voltage fixtures that blend in by day",
      "Elegant nighttime presence and enhanced curb appeal",
      "Suitable for everyday accent lighting and decorative applications",
      "Eliminates repeated ladder work for seasonal decorating",
    ],
    details:
      "Each roofline system is planned around the lines and proportions of your home. We consider fixture placement, spacing, and light color so the result looks intentional, balanced, and refined.",
    cardImage: IMG.cardRoofline,
    heroImage: IMG.heroDusk,
    order: 0,
  },
  {
    slug: "landscape-lighting",
    title: "Low Voltage Integrated Landscape Lighting",
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
    title: "Premium Exterior Home Improvements",
    shortTitle: "Exterior Improvements",
    summary: "Thoughtful exterior enhancements that elevate the beauty, function, and value of your home.",
    description:
      "Beyond lighting, Aura Exteriors offers premium exterior home improvements designed to complement your property and elevate its overall appearance. Every project is approached with the same attention to design, quality, and craftsmanship that defines our lighting work. Contact us to discuss the improvements you have in mind.",
    benefits: [
      "Enhances curb appeal and first impressions",
      "Designed to complement your home's architecture",
      "Premium materials and careful workmanship",
      "Coordinated with your outdoor lighting plan",
    ],
    details:
      "Because every home and every goal is different, we begin each exterior improvement project with a consultation to understand what you'd like to achieve and recommend the right approach.",
    cardImage: IMG.cardExterior,
    heroImage: IMG.stonePatioDusk,
    order: 2,
  },
];
export type ServiceData = (typeof defaultServices)[number] & { _id?: string };

export const FAQ_CATEGORIES = ["General", "Roofline Lighting", "Landscape Lighting", "Exterior Improvements", "Financing", "Booking"];

export const defaultFaqs = [
  { question: "What is low voltage roofline lighting?", answer: "Low voltage roofline lighting is a permanent lighting system installed along the eaves, peaks, and edges of your roof. It uses low voltage fixtures to outline and highlight your home's architecture at night, and is designed to remain in place year-round rather than being installed and removed seasonally.", category: "Roofline Lighting", featured: true },
  { question: "What are the benefits of landscape lighting?", answer: "Landscape lighting enhances the beauty of your property after dark, highlights trees, gardens, and architectural features, improves visibility along walkways and entrances, and lets you enjoy your outdoor spaces longer into the evening.", category: "Landscape Lighting", featured: true },
  { question: "Do you offer customized lighting solutions?", answer: "Yes. Every property is different, so each lighting plan is designed around your home's architecture, landscape, and goals. We discuss your preferences during your consultation and plan accordingly.", category: "General", featured: true },
  { question: "How can I request an estimate?", answer: "You can request a personalized quote through our Pricing page, submit the contact form, request a consultation online, or call us directly. Because every project is unique, pricing is based on your property's requirements, design preferences, scope, materials, and installation details.", category: "General", featured: true },
  { question: "Is financing available?", answer: "Yes. Financing options are available through Hearth, a third-party financing provider. Financing is subject to the provider's terms and approval. Contact us to learn more.", category: "Financing", featured: true },
  { question: "How do I schedule a consultation?", answer: "Use our online booking page to request a consultation, call us, or send a message through the contact form. We'll follow up to confirm the details.", category: "Booking", featured: true },
  { question: "Will roofline lights be visible during the day?", answer: "Permanent roofline systems are designed to be discreet. Fixture placement and mounting are planned to blend with your home's trim and roofline as much as possible. We can discuss how this applies to your home during your consultation.", category: "Roofline Lighting", featured: false },
  { question: "Can landscape lighting be designed around my existing garden?", answer: "Yes. Integrated landscape lighting is planned around your existing trees, plantings, pathways, and hardscape to highlight what you already love about your property.", category: "Landscape Lighting", featured: false },
  { question: "What kinds of exterior improvements do you offer?", answer: "We offer premium exterior home improvements tailored to each property. Because every project is different, the best next step is a consultation where we can discuss the specific improvements you have in mind.", category: "Exterior Improvements", featured: false },
  { question: "Do I need to create an account to request a quote?", answer: "No. You can request a quote or consultation without creating an account. Simply fill out the form with your contact details and project information.", category: "General", featured: false },
];

export const defaultGallery = [
  { image: IMG.heroDusk, alt: "Stone home with warm permanent roofline lighting at dusk", caption: "Roofline Lighting", category: "roofline-lighting" },
  { image: IMG.villaPoolDusk, alt: "Landscaped front yard with pathway and garden lighting at twilight", caption: "Landscape Lighting", category: "landscape-lighting" },
  { image: IMG.mansionDusk, alt: "Illuminated stone facade and entrance at night", caption: "Architectural Lighting", category: "exterior-improvements" },
  { image: IMG.cardRoofline, alt: "Gabled roofline outlined with warm lights", caption: "Roofline Detail", category: "roofline-lighting" },
  { image: IMG.stonePatioDusk, alt: "Curved stone walkway with path lights leading to the entrance", caption: "Illuminated Entrance", category: "exterior-improvements" },
  { image: IMG.cardLandscape, alt: "Garden beds and walkway glowing with low voltage lighting", caption: "Garden Pathways", category: "landscape-lighting" },
  { image: IMG.modernDusk, alt: "Luxury residence with roofline and landscape lighting at dusk", caption: "Residential Exterior", category: "roofline-lighting" },
  { image: IMG.cardExterior, alt: "Stone exterior with warm accent lighting and landscaping", caption: "Exterior Enhancements", category: "exterior-improvements" },
  { image: IMG.modernNight, alt: "Home with trees and gardens illuminated at night", caption: "Tree Illumination", category: "landscape-lighting" },
];
