# Pixel Nebula — Technical Specification

## Dependencies

### Runtime

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.1 | UI framework |
| react-dom | ^19.1 | React DOM renderer |
| gsap | ^3.12 | Animation engine (horizontal scroll, entrance, modal, hover timelines) |
| lucide-react | ^0.469 | Icons (close, copy, social platform icons, carousel arrows) |

### Dev

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^5.7 | Type safety |
| vite | ^6.3 | Build tool |
| @vitejs/plugin-react | ^4.4 | React Vite plugin |
| tailwindcss | ^4.1 | Utility-first CSS |
| @tailwindcss/vite | ^4.1 | Tailwind Vite integration |
| @types/react | ^19.0 | React type definitions |
| @types/react-dom | ^19.0 | ReactDOM type definitions |

### Fonts

Space Mono via Google Fonts `<link>` — no npm package (700 + 400 weights).

### GSAP Plugins (all free, register at app init)

- **ScrollTrigger** — Pin horizontal wrapper, scrub translateX
- **Flip** — Layout transition (loading → hero state change)
- **Observer** — Normalized wheel/touch/pointer → horizontal scroll on desktop; unified gesture handling for carousel drag/swipe

---

## Component Inventory

### Layout

| Component | Source | Notes |
|-----------|--------|-------|
| NavBar | Custom | Fixed top bar with logo + links + hamburger mobile menu. Progress bar width driven by ScrollTrigger progress callback. |
| HorizontalScrollContainer | Custom | GSAP ScrollTrigger pins wrapper, scrubs x translation. This is the scroll orchestrator — not just a wrapper. |
| LoadingScreen | Custom | Full-viewport overlay. Dismisses after 1.5s simulated load. Removed from DOM after fade-out. |

### Sections (one per horizontal panel)

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Left-aligned content, large decorative pink planet on right. |
| SkillsSection | Custom | Right-aligned content, ringed planet upper-left, 3-col skill grid. |
| ProjectsSection | Custom | Centered content, purple planet with orbiting moons, horizontal project carousel. |
| ContactSection | Custom | Right-aligned content, UFO + alien left-center, contact card, footer. |

### Reusable Components

| Component | Source | Used By | Notes |
|-----------|--------|---------|-------|
| GlassCard | Custom | All sections, ProjectModal | Glassmorphism style with hover lift/border glow. Configurable padding, max-width. |
| StarfieldCanvas | Custom (canvas) | Global (fixed background) | requestAnimationFrame loop. 300–500 stars with per-star twinkle phase/speed. `will-change: transform` on canvas. |
| PixelStarDivider | Custom (CSS) | Between sections | 5 CSS box-shadow pixel stars with staggered twinkle. |
| SectionLabel | Custom | Hero, Skills, Projects, Contact | "// SECTOR 0X" label with pixel star icon. |
| SkillCard | Custom | SkillsSection | Icon + name + proficiency bar. Hover lift via GlassCard. |
| ProjectCard | Custom | ProjectsSection | Image + body + tags. Click opens modal. Hover via GlassCard. |
| ProjectCarousel | Custom | ProjectsSection | Horizontal scrollable container. Mouse drag + touch swipe via GSAP Observer. Edge gradient fades. Arrow buttons. |
| ProjectModal | Custom (portal) | ProjectsSection | Full-screen overlay with glassmorphic modal. GSAP timeline open/close. Focus trap + Escape + overlay click to close. |
| SocialButton | Custom | ContactSection | Circular icon button with hover color inversion. |
| PixelIcon | Custom (CSS) | SkillCard, NavBar, SectionLabel | CSS box-shadow pixel art renderer. Accepts a pixel grid definition (array of color strings), outputs a scaled pixel sprite. |

### Hooks

| Hook | Purpose |
|------|---------|
| useHorizontalScroll | Encapsulates GSAP ScrollTrigger setup for the horizontal canvas. Returns a ref for the wrapper element. Registers/unregisters on mount/unmount. |
| useReducedMotion | Reads `prefers-reduced-motion` media query. Returns boolean. Consumed by StarfieldCanvas, floating animations, entrance animations. |

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Horizontal scroll system | GSAP + ScrollTrigger | Pin `.page-wrapper`, animate `x` to negative scrollWidth offset. `scrub: 1`, `end: "+=4000"`. Parallax via nested layer transforms driven by ScrollTrigger callbacks at 0.2x/0.6x/1.0x speeds. | 🔒 High |
| Starfield twinkling | Canvas 2D (raw) | requestAnimationFrame loop. Per-star opacity oscillation via `sin(time * speed + phase)`. Single `fillRect()` per star. No object allocation in loop. | 🔒 High |
| Loading screen sequence | GSAP timeline | Timeline: typing text (GSAP stagger on chars), progress bar width tween, simultaneous dim-to-bright starfield opacity. Dismiss overlay fade-out, then DOM removal. | Medium |
| Hero entrance sequence | GSAP timeline | Staggered timeline: label → name → role → bio → buttons → planet scale-in. Fires after loading screen dismiss. | Medium |
| Section entrance animations | GSAP + ScrollTrigger | Per-section ScrollTrigger with `onEnter`. Cards: `opacity 0→1`, `y: 40→0`. Text: `opacity 0→1`, `x: -30→0` with stagger. Titles: `scale 0.95→1`. Trigger at viewport+20%. | Low |
| Floating bob (planets/UFO) | GSAP | Infinite `yoyo: true, repeat: -1` tween on `y` (-8 to +8px). Duration randomized 3–5s per element. UFO also has horizontal sway on x (-4 to +4px, 2s). | Low |
| Moon orbit | CSS @keyframes | Parent container `rotate(0→360deg)` 20s linear infinite. Child moons positioned at different radii via absolute positioning. | Low |
| Meteor streak | CSS @keyframes | Diagonal line element with opacity trail fade. 4s duration, 12s repeat delay. CSS-only. | Low |
| Pixel star divider twinkle | CSS @keyframes | Per-star `opacity` oscillation, 2s, staggered `animation-delay` (0.3s increments). | Low |
| Nav progress bar | GSAP ScrollTrigger callback | Update CSS `width` percentage via ScrollTrigger `onUpdate` progress. | Low |
| Scroll prompt pulse | GSAP | `x: 0→8px` on arrow, 1.5s infinite yoyo. Remove after first scroll detected. | Low |
| Card hover effects | CSS transitions | `translateY(-4px)`, border-color brighten, shadow intensify. 300ms ease. Pure CSS `:hover`. | Low |
| Button hover effects | CSS transitions | Background/border/glow changes. 200ms ease. Pure CSS. | Low |
| Modal open/close | GSAP timeline | Open: overlay fade → container scale (back.out) → content stagger. Close: reverse sequence. | Medium |
| Project carousel drag/swipe | GSAP Observer | `onChangeX` handler translates carousel container. Momentum via `inertia` optional. Boundary clamping. Arrow buttons scroll by card width. | Medium |
| UFO easter egg | GSAP timeline | Shake (rotation ±5deg, 3 cycles) → beam glow intensify → cow element appears + float-up → beam fade → happy wobble. Triggered on click/keyboard. | Medium |
| Copy-to-clipboard tooltip | CSS transition | "COPIED!" text opacity toggle. 1.5s auto-dismiss. | Low |
| Custom cursor | GSAP quickTo | `quickTo` on x/y for 60fps tracking. Crosshair (CSS lines) default, expandable ring on interactive hover. `pointer-events: none`. Desktop only. | Medium |
| Mobile menu toggle | CSS transitions + JS | Hamburger lines → X via CSS transforms (300ms). Menu slide-down. | Low |

---

## State & Logic Plan

### Horizontal Scroll Architecture

The entire page lives inside a single `.page-wrapper` (500vw wide, `display: flex`). GSAP ScrollTrigger pins this wrapper and translates it horizontally based on vertical scroll input. All sections are flex children at `100vw` each.

**Key decisions**:
- One ScrollTrigger instance controls the master horizontal translation.
- Parallax is achieved by applying additional `x` offsets to the planet layer (0.6x) and starfield canvas (0.2x) within the same scrub context — do NOT create separate ScrollTrigger instances for each layer.
- Mobile breakpoint (< 768px): disable GSAP horizontal scroll entirely, switch `.page-wrapper` to `display: block` with native vertical scrolling. Unmount ScrollTrigger on breakpoint change.

### Loading → Hero Transition Orchestration

The loading screen must coordinate its dismissal with the hero entrance animation:

1. Loading screen runs its internal timeline (spinner + typing + progress bar).
2. After 1.5s, loading screen triggers its fade-out timeline.
3. **Simultaneously**, the starfield canvas opacity tween (0.3 → 1) begins.
4. On loading screen fade complete, fire the hero entrance timeline.

Implement as a ref-based callback: LoadingScreen accepts an `onDismiss` prop. The hero section mounts immediately but content starts at `opacity: 0`, entrance timeline paused until `onDismiss` fires.

### Project Carousel State

The carousel needs imperative scroll position management:

- Track current scroll offset in a ref (not React state — 60fps updates).
- GSAP Observer provides drag/swipe delta → add to offset → apply `transform: translateX`.
- Clamp offset between `0` and `-(totalWidth - viewportWidth)`.
- Arrow buttons: offset by `(cardWidth + gap)` per click.
- Disable left arrow at offset 0, right arrow at max offset.
- Edge gradient fades are CSS masks (`mask-image: linear-gradient(...)`) — no JS needed.

### Modal Focus Trap

Manual focus trap (no external library):

- On open: save `document.activeElement`, find all focusable elements inside modal (querySelectorAll on `a, button, input, [tabindex]:not([tabindex="-1"])`), focus first element.
- `Tab` key: cycle through focusable elements, wrap from last to first.
- `Shift+Tab`: reverse cycle.
- On close: restore focus to saved element.

### Copy-to-Clipboard

Use `navigator.clipboard.writeText()`. Show tooltip on success. Handle fallback for insecure contexts (deprecated `document.execCommand('copy')` on hidden textarea).

---

## Other Key Decisions

### Starfield as Canvas (not CSS background)

The design specifies 300–500 twinkling stars with per-star opacity oscillation. This must be a Canvas 2D element — CSS `box-shadow` or DOM elements would not perform at this particle count with individual opacity animation. The canvas is `position: fixed` and sized to the full horizontal canvas width (500vw) so stars are correctly positioned across the entire scrollable area.

### Pixel Icons as CSS Component (not images)

All skill icons, decorative pixel stars, and the custom cursor crosshair are rendered via a reusable `PixelIcon` component using CSS `box-shadow` technique. This avoids 10+ tiny image requests and keeps icons as data (pixel grid arrays) rather than assets. The component accepts a color palette and 2D grid definition, renders at configurable scale.

### Project Images Strategy

The 4 project screenshots are generated assets (AI images). They are displayed at 280×160px with `object-fit: cover`. Use `loading="lazy"` and Intersection Observer to load only when the Projects section is near viewport. Consider a low-quality blurred placeholder (LQIP) — a tiny 28×16px version inlined as base64 or a CSS gradient placeholder.

### Font Loading

Space Mono (400 + 700) loaded via Google Fonts `<link>` with `display=swap`. Since this is a monospace portfolio, the font is critical — use `font-display: swap` and show a system monospace fallback immediately. No FOIT (flash of invisible text).

### Mobile Horizontal → Vertical Switch

The mobile breakpoint switches the entire scroll paradigm. This is not just CSS — the GSAP ScrollTrigger must be killed and re-created (or not created) based on viewport width. Use a `useMediaQuery` hook or ResizeObserver to detect the breakpoint and conditionally initialize the horizontal scroll system. On resize crossing the breakpoint, tear down/rebuild the scroll system.
