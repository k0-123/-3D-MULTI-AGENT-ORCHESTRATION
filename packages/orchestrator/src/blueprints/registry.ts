
export interface Blueprint {
  id: string;
  name: string;
  category: "cinematic" | "saas" | "studio" | "interactive";
  description: string;
  filePath: string;
}

export const BLUEPRINT_REGISTRY: Blueprint[] = [
  {
    id: "cinematic-space",
    name: "Cinematic Space-Travel",
    category: "cinematic",
    description: "Looping background videos, liquid-glass UI, and Framer Motion entrance animations.",
    filePath: "./01-cinematic-space.md"
  },
  {
    id: "minimalist-hero",
    name: "Velorah Minimalist Hero",
    category: "studio",
    description: "Fullscreen looping background video, glassmorphic navigation, and cinematic typography.",
    filePath: "./02-minimalist-hero.md"
  },
  {
    id: "prisma-studio",
    name: "Prisma Creative Studio",
    category: "studio",
    description: "Dark, moody, and cinematic with a warm cream color palette and WordsPullUp animations.",
    filePath: "./03-prisma-studio.md"
  },
  {
    id: "toonhub-carousel",
    name: "Toonhub 3D Carousel",
    category: "interactive",
    description: "3D character-figurine carousel with role-based transitions and grain overlay.",
    filePath: "./04-toonhub-carousel.md"
  },
  {
    id: "jack-3d-creator",
    name: "Jack 3D Portfolio",
    category: "interactive",
    description: "Magnetic portrait effect, scroll-driven marquee, and sticky-stacking project cards.",
    filePath: "./05-jack-3d-creator.md"
  },
  {
    id: "microvisuals",
    name: "MicroVisuals Boomerang",
    category: "cinematic",
    description: "GSAP-driven parallax mouse tracking and boomerang video canvas render.",
    filePath: "./06-microvisuals.md"
  },
  {
    id: "velorix-saas",
    name: "Velorix AI Native",
    category: "saas",
    description: "Fullscreen video with mobile-responsive hamburger menu and precision-edge layout.",
    filePath: "./07-velorix-saas.md"
  },
  {
    id: "wanderful-travel",
    name: "Wanderful Cinematic Travel",
    category: "cinematic",
    description: "Liquid-glass utility with high-speed playback and tailored itinerary layout.",
    filePath: "./08-wanderful-travel.md"
  },
  {
    id: "prosthetics-product",
    name: "Smart Prosthetics Hero",
    category: "saas",
    description: "Bottom-left aligned content with micro-interactions and Badge link components.",
    filePath: "./09-prosthetics-product.md"
  },
  {
    id: "max-reed-features",
    name: "Max Reed Grid",
    category: "interactive",
    description: "Bento-style grid with scrolling marquee software icons and client voice cards.",
    filePath: "./10-max-reed-features.md"
  },
  {
    id: "aura-email",
    name: "Aura Email Client",
    category: "saas",
    description: "macOS-style menu bar, realistic inbox mockup, and shiny gradient headlines.",
    filePath: "./11-aura-email.md"
  },
  {
    id: "cta-faq-footer",
    name: "Transfer Borders Kit",
    category: "saas",
    description: "Animated gradient CTA card with FAQ accordion and detailed footer.",
    filePath: "./12-cta-faq-footer.md"
  },
  {
    id: "michael-smith-portfolio",
    name: "Michael Smith Collection",
    category: "interactive",
    description: "GSAP loading screen, rotating words, and bento grid with halftone overlays.",
    filePath: "./13-michael-smith-portfolio.md"
  },
  {
    id: "securify-saas",
    name: "Securify Data Security",
    category: "saas",
    description: "Floating pill-shaped navbar with large staggered typography and stat blocks.",
    filePath: "./14-securify-saas.md"
  },
  {
    id: "aurora-sign-up",
    name: "Aurora Registration",
    category: "saas",
    description: "Two-column registration interface with staggered reveal and StepItem components.",
    filePath: "./15-aurora-sign-up.md"
  },
  {
    id: "movie-streaming",
    name: "Cinematic Movie Hero",
    category: "cinematic",
    description: "Bottom blur overlay with CSS mask and blur-fade-up staggered animations.",
    filePath: "./16-movie-streaming.md"
  },
  {
    id: "web3-immersive",
    name: "Web3 Immersive Protocol",
    category: "cinematic",
    description: "Dark glowing neon vectors, floating glassmorphic panels, and WebGL-style ThreeJS canvas simulation.",
    filePath: "./17-web3-immersive.md"
  },
  {
    id: "saas-bento-grid",
    name: "SaaS Bento Grid Pro",
    category: "saas",
    description: "Multi-layered bento grid with live interactive widgets, micro-charts, and sticky header.",
    filePath: "./18-saas-bento-grid.md"
  },
  {
    id: "ecommerce-lookbook",
    name: "E-Commerce Immersive Lookbook",
    category: "interactive",
    description: "Horizontal scroll lookbook with magnetic cursor tracking, quick-view modals, and liquid-glass tags.",
    filePath: "./19-ecommerce-lookbook.md"
  },
  {
    id: "editorial-magazine",
    name: "Editorial Serif Magazine",
    category: "studio",
    description: "High-contrast serif typography, asymmetric grid layouts, pull quotes, and sepia-toned grain overlay.",
    filePath: "./20-editorial-magazine.md"
  }
];
