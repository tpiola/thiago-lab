# NEXUS BUILDER — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^18.3.0 | UI framework |
| `react-dom` | ^18.3.0 | React DOM renderer |
| `three` | ^0.160.0 | WebGL 3D engine for particle helix |
| `@react-three/fiber` | ^8.15.0 | React renderer for Three.js |
| `@react-three/drei` | ^9.88.0 | R3F helpers (not heavily used but available) |
| `gsap` | ^3.12.0 | Animation engine: timelines, tweens, ScrollTrigger |
| `@gsap/react` | ^2.1.0 | useGSAP hook for lifecycle-safe GSAP usage |
| `lenis` | ^1.0.0 | Smooth scroll with inertia |
| `lucide-react` | ^0.400.0 | Icon library (pre-installed with webapp-building) |
| `tailwindcss` | ^3.4.0 | Utility-first CSS (pre-installed) |
| `@fontsource/inter` | ^5.0.0 | Self-hosted Inter font |
| `@fontsource/jetbrains-mono` | ^5.0.0 | Self-hosted JetBrains Mono font |

---

## Component Inventory

### Layout

| Component | Source | Notes |
|---|---|---|
| `Navigation` | Custom | Fixed top bar. Scroll-aware background transition (scrollY > 50). Desktop center links hidden on mobile. |
| `Footer` | Custom | 5-column link grid. Static, no animations. |

### Sections

| Component | Source | Notes |
|---|---|---|
| `HeroSection` | Custom | Full-viewport. Mounts `HeroHelix` as background. Text positioned left (8vw). |
| `PlatformIntelligenceSection` | Custom | 3-column feature card grid. ScrollTrigger stagger entrance. |
| `BuilderShowcaseSection` | Custom | Two alternating 60/40 rows (Website + SaaS builders). ScrollTrigger slide+fade. |
| `AvatarStudioSection` | Custom | 45/55 split. Darker background (#080808). |
| `CopywritingFunnelSection` | Custom | 50/50 split. Left: tabbed copywriter (React state). Right: CSS AARRR funnel bars. |
| `SEOGEDSection` | Custom | Overlapping cards layout. SEO (left) + GEO (right offset). |
| `MonetizationHubSection` | Custom | 4-column card grid (responsive: 3/2/1 cols). |
| `PricingSection` | Custom | 3-column pricing cards. Center card highlighted. Monthly/Yearly toggle. |
| `CTABannerSection` | Custom | Full-width banner. Mounts `CTAParticles` background. Large faint "NEXUS" watermark text. |

### Reusable Components

| Component | Source | Used By |
|---|---|---|
| `HeroHelix` | Custom (R3F) | `HeroSection` only |
| `CTAParticles` | Custom (R3F) | `CTABannerSection` only |
| `FeatureCard` | Custom | `PlatformIntelligenceSection` (3x) |
| `MonetizationCard` | Custom | `MonetizationHubSection` (8x) |
| `PricingCard` | Custom | `PricingSection` (3x) |
| `SectionLabel` | Custom | All sections — JetBrains Mono uppercase label pattern |
| `SectionHeader` | Custom | Most sections — label + H2 + subtitle pattern |
| `BrowserMockup` | Custom | `BuilderShowcaseSection` row 1 — browser chrome frame with dots + URL bar |
| `CodeEditorMockup` | Custom | `BuilderShowcaseSection` row 2 — dark IDE frame with syntax highlighting |
| `AARRRFunnel` | Custom | `CopywritingFunnelSection` — CSS horizontal bar funnel with width animation |
| `CopywritingTabs` | Custom | `CopywritingFunnelSection` — AIDA/PAS/Storytelling tab switcher |

### Hooks

| Hook | Purpose |
|---|---|
| `useLenis` | Initialize Lenis instance, connect to ScrollTrigger, expose for scroll-to |
| `useNavScroll` | Tracks scrollY > 50 threshold for nav background transition |

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|---|---|---|---|
| Particle Helix (dual strands) | Three.js + R3F | Custom ShaderMaterial with vertex displacement, 2 Points objects with CatmullRomCurve3, useFrame rotation + time uniform | **High** 🔒 |
| CTA Particle Field | Three.js + R3F | Single Points object, 500 random particles, same shader pattern at 5% opacity | **Medium** |
| Hero text entrance | GSAP | Single timeline: label → headline line 1 → line 2 → subtitle → CTA → trust row, staggered delays | Medium |
| Platform cards stagger | GSAP ScrollTrigger | `stagger: 0.15`, `y: 60 → 0`, triggered at `top 80%` | Low |
| Builder showcase rows | GSAP ScrollTrigger | Row 1: image from `x: -40`, text fade with delay. Row 2: reversed. `top 75%` | Low |
| Avatar studio entrance | GSAP ScrollTrigger | Text from left, card `scale: 0.95 → 1` + opacity, `duration: 1.0` | Low |
| Copy/funnel cards | GSAP ScrollTrigger | Left card from `x: -30`, right from `x: 30`, stagger 0.2 | Low |
| SEO/GEO cards | GSAP ScrollTrigger | Both `y: 40 → 0`, stagger 0.2, `duration: 1.0` | Low |
| Monetization grid | GSAP ScrollTrigger | `stagger: 0.1` from bottom, `duration: 0.6` | Low |
| Pricing cards | GSAP ScrollTrigger | `scale: 0.95 → 1` + opacity, stagger 0.15, Pro card extra 0.2s delay | Low |
| CTA banner entrance | GSAP ScrollTrigger | H2, body, CTA staggered `y` + opacity, 0.2s apart | Low |
| AARRR bar width | GSAP ScrollTrigger | Animate `width` from 0 to target percentage on scroll entry | Low |
| Nav background | CSS transition | `transition: 300ms` on bg/border/backdrop-filter, toggled by scroll class | Low |
| Copywriting tab switch | CSS transition | `opacity: 0 → 1`, `200ms`, toggled by React activeTab state | Low |

---

## State & Logic

### Lenis ↔ ScrollTrigger Bridge

Lenis owns the scroll position. ScrollTrigger must be kept in sync via `lenis.on('scroll', ScrollTrigger.update)`. The Lenis instance is created once at app root in `useLenis` hook and never recreated. On unmount, the listener is removed.

### Pricing Toggle

Simple React state `billingCycle: 'monthly' | 'yearly'` in `PricingSection`. Affects only displayed prices (Starter $0 always, Pro $49/$39, Enterprise "Custom"). No URL params, no persistence.

### Copywriting Tab State

`activeTab: 'aida' | 'pas' | 'storytelling'` in `CopywritingFunnelSection`. Content switches with CSS opacity transition. No external data fetching.

### R3F Scene Mounting Strategy

`HeroHelix` and `CTAParticles` are mounted only within their respective sections. Each uses its own `<Canvas>` with independent render loops. The Hero canvas uses `dpr={[1, 2]}`, CTA canvas uses `dpr={[1, 1.5]}` for performance. No shared renderer, no global R3F context.

### Scroll-Triggered Animation Registration

All GSAP ScrollTrigger instances are created inside `useGSAP` hooks with `scope` set to the section container. This ensures:
- Cleanup on component unmount
- No orphaned ScrollTrigger instances
- Scoped query selectors within the section only

### Reduced Motion Handling

A single `usePrefersReducedMotion` hook (media query `prefers-reduced-motion: reduce`) drives three behaviors:
1. **Lenis**: Disabled (instant scroll) when reduced motion is preferred
2. **GSAP**: All animations set to `duration: 0` (effectively disabled)
3. **R3F**: Helix and CTA particles set to `frameloop="demand"` with no auto-rotation

The hook result is passed via React context or prop drilling to consumers.

---

## Other Key Decisions

**Font loading**: Self-hosted via `@fontsource/inter` and `@fontsource/jetbrains-mono` rather than Google Fonts CDN. Eliminates external network dependency and FOUT issues.

**No shadcn/ui components**: The design uses entirely custom components with glassmorphism, custom borders, and specific hover behaviors. No standard shadcn primitives (Button, Card, Tabs) match the design closely enough to justify the override effort.

**Image assets**: 3 images generated via AI (hero-3d-avatar, builder-templates, code-editor). No external image dependencies beyond these generated assets.

**CSS approach**: All styling via Tailwind utility classes. No CSS modules, no styled-components. Design tokens map to Tailwind config extensions (colors, spacing, border-radius, font-family).

**TypeScript**: Full TypeScript coverage. GSAP targets typed as `HTMLElement[]` or `Element[]`. R3F refs typed with `THREE.Group`, `THREE.Points`.

**Bundle consideration**: Three.js is the largest dependency (~600KB gzipped). Code-split via dynamic imports if possible, but R3F's declarative approach requires it at module level. Accept the bundle cost — 3D is a core feature, not optional.
