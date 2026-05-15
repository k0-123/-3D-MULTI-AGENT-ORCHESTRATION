/**
 * Few-shot examples for Phase 4: Agent Training
 * These examples show each agent what "Perfect" output looks like.
 */

export const FEW_SHOT_EXAMPLES: Record<string, string> = {
  senior: `## Technical Architecture: Real-time Notification System

### Overview
This architecture leverages Redis Pub/Sub for low-latency message delivery and WebSockets for real-time client updates.

### Key Components
- **Message Broker**: Redis (Pub/Sub)
- **Transport**: WebSocket (Socket.io)
- **Database**: PostgreSQL (Persistence)

### Implementation Detail (TypeScript)
\`\`\`typescript
import { createClient } from 'redis';

const pubClient = createClient();
const subClient = pubClient.duplicate();

async function initSync() {
  await Promise.all([pubClient.connect(), subClient.connect()]);
  console.log('Redis connected');
}
\`\`\`

> **Note**: Ensure horizontal scalability by using a Redis adapter for Socket.io.`,

  intern: `## Documentation: Setting Up the Development Environment

Welcome to the team! Follow these steps to get your local environment running in less than 5 minutes.

### Prerequisites
- Node.js v18.x or higher
- Docker Desktop
- A Git client

### Getting Started
1. **Clone the repository**:
   \`\`\`bash
   git clone https://github.com/org/project.git
   \`\`\`
2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
3. **Environment variables**:
   Copy \`.env.example\` to \`.env\` and fill in your keys.

### Pro Tips
- Use \`npm run dev\` for hot-reloading.
- Check the \`/docs\` folder for advanced architecture diagrams.`,

  offer: `# Executive Summary: Premium Subscription Model

## Market Analysis
Our research indicates a 15% gap in the mid-tier market for privacy-focused productivity tools.

## Recommended Pricing
| Tier | Price | Best For |
|:---|:---|:---|
| Basic | Free | Individuals |
| **Pro** | **$12/mo** | **Power Users** |
| Enterprise | Custom | Large Teams |

## Strategic Roadmap
- **Q1**: Launch Beta for Pro tier.
- **Q2**: Implement end-to-end encryption.
- **Q3**: Global marketing campaign.

> **Risk Assessment**: Competitor 'X' might lower their entry price; we must emphasize our unique encryption protocol.`,

  growth: `# Growth Strategy: Q4 User Acquisition

## Goal
Increase active monthly users (MAU) by 25% through targeted social proof campaigns.

![Growth Strategy Banner](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80)

## Channel Breakdown
| Channel | Budget | Target KPI |
|:---|:---|:---|
| X (Twitter) | $2,000 | 500 signups |
| LinkedIn | $3,500 | 150 Enterprise leads |
| Meta | $1,500 | 2,000 Beta installs |

## Viral Loop Mechanism
- **Referral Program**: Give 1 month free for every 3 successful invites.
- **Milestone Sharing**: Auto-generated "Year in Review" cards for social media.

### Action Plan
1. Finalize ad creatives by Monday.
2. Launch A/B test for landing page V2.
3. Partner with 5 micro-influencers in the DevTools space.`,

  funnel: `# User Journey: Checkout Conversion Optimization

## Current Drop-off Analysis
We are losing 40% of users at the "Shipping Information" step.

## Optimized Flow (Step-by-Step)
1. **Landing Page**: Simplified value prop with one "Get Started" button.
2. **Account Creation**: Google/GitHub OAuth only (no manual forms).
3. **Checkout**: Single-page form with "Express Pay" options (Apple/Google Pay).
4. **Success**: Immediate access to the dashboard + welcome email.

## Key Metrics to Track
- **Add-to-Cart Rate**: Target 12%
- **Checkout Completion**: Target 65%
- **Time-to-Value**: Target < 2 minutes`,

  designer: `# Design Specification: "Cyber-Slate" UI System

## Color Palette
| Token | Value | Usage |
|:---|:---|:---|
| Primary | #6366f1 | Buttons, Links |
| Background | #0f172a | Main Surface |
| Surface | #1e293b | Cards, Modals |
| Text | #f8fafc | Primary Readability |

## Typography
- **Primary Font**: 'Inter', sans-serif
- **Scale**: 14px (Base), 18px (H3), 24px (H2), 32px (H1)

## Component Assets
- **Buttons**: 8px border-radius, subtle 2px glow on hover.
- **Inputs**: Transparent background, 1px slate-700 border.

> **Visual Style**: Minimalist, high-contrast, dark-mode first with neon accents.`,

  deck_master: `# Presentation Outline: 2026 Innovation Roadmap

## Slide 1: The Vision
- **Visual**: High-res space background with "The Future is Agentic" overlay.
- **Key Note**: We aren't just building tools; we're building coworkers.

## Slide 2: Market Opportunity
- **Data**: Global AI agent market expected to hit $10B by 2027.
- **Chart**: Bar chart showing 300% YoY growth in automation sector.

## Slide 3: Our Unique Edge
- **Points**: 3D Visualization, Multi-agent orchestration, Cross-model fallbacks.
- **Speaker Note**: Emphasize our 5x faster mission performance.

## Slide 4: Q&A and Next Steps
- **Call to Action**: Sign up for early access at our website.`,
};
