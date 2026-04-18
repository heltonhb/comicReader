---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments:
  - PROJECT.md
  - REQUIREMENTS.md
  - STATE.md
  - ROADMAP.md
---

# UX Design Specification hq

**Author:** Helton
**Date:** 2026-04-18

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Input Documents Summary

### From .planning/
- **PROJECT.md** — Project definition: "Historia HQ — Leitor de Quadrinhos". SPA for digital comic reading with flip-page UX.
- **REQUIREMENTS.md** — Phases 1-3 requirements: Auth, Admin Panel, Reader enhancements.
- **STATE.md** — Current status: Phase 3 (Admin Panel) completed.
- **ROADMAP.md** — Plan items 03-01 through 03-03 completed.

### Project Context (from code review)
- React 18 + Vite + Tailwind CSS
- Firebase backend (Auth, Firestore, Storage)
- Flip reader mode (react-pageflip)
- WebP image optimization
- 95 uncommitted files in working tree

## Executive Summary

### Project Vision
Historia HQ is a digital comic reader SPA that delivers an immersive, flip-page reading experience mimicking physical comics/manga. Firebase-powered for authentication and progress sync.

### Target Users
- Casual to hardcore comic readers online
- Users who appreciate minimalist, content-focused design
- Mobile-first experience (responsive to any device)

### Key Design Challenges
1. Mobile-first reading — Flip animation must feel native on touch devices
2. Progress continuity — Seamless resume across sessions/devices
3. Edge-to-edge display — Maximizing screen real estate without losing controls

### Design Opportunities
1. Immersive reading — Removing all chrome during reading
2. Gesture-first navigation — Intuitive swipe/tap interactions
3. Smart preloading — Anticipating next pages for zero wait

---

## Core User Experience

### Defining Experience
The primary interaction is flipping through comic pages — like turning physical pages. The flip animation is the core "magic" moment that defines the product's value.

### Platform Strategy
- Web-first SPA, touch-optimized for mobile
- Responsive: mobile → tablet → desktop
- No offline required; always connected

### Effortless Interactions
- One-tap entry with automatic resume
- Gesture-based navigation (swipe to flip)
- Auto-save progress on every page turn

### Critical Success Moments
- Flip animation feeling like real books
- Progress persistence across sessions
- Edge-to-edge display on any device

### Experience Principles
1. Flip-first — page-turning is primary
2. Instant resume — never lose place
3. Invisible controls — fade during reading
4. Zero-wait loading — preload ahead

---

## Desired Emotional Response

### Primary Emotional Goals
- **Immersion**: Users forget they're on a device
- **Delight**: The flip feels tactile and satisfying
- **Trust**: Progress is always saved

### Emotional Journey Mapping
| Touchpoint | Desired Emotion | UX Driver |
|-----------|---------------|----------|
| First visit | Curiosity | Compelling cover carousel |
| Opening a comic | Anticipation | Cover thumbnail, seamless load |
| Reading | Immersion | Edge-to-edge, hidden UI |
| Page flip | Delight | Realistic flip animation |
| Closing | Confidence | "I'll be back exactly here" |
| Returning | Recognition | Resume prompt |

### Micro-Emotions
- **Confidence** (not Confusion)
- **Delight** (not Boredom)
- **Trust** (not Frustration)
- **Excitement** (not Anxiety)

### Design Implications
- Flip animation → tactile satisfaction
- Hidden controls → uninterrupted immersion
- Auto-save → trust in progress
- Progress bar → confidence in location

### Emotional Design Principles
1. The page turn must feel real
2. Controls disappear when not needed
3. Never lose the user's place
4. Make every return feel like "welcome back"

---

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis
| App | What They Do Well | UX Lesson for Us |
|-----|-----------------|----------------|
| Webtoon | Infinite scroll, vertical reading | Smooth transitions, never-ending content |
| Tapas | Binge-friendly, episode markers | Progress visibility, bookmarking |
| Kindle | Sync across devices | True cross-device persistence |
| Apple Books | Page-turn animation | Realistic flip physics |

### Transferable UX Patterns
- **Swipe gestures** → Core page navigation
- **Progress bar** → Always visible, non-intrusive
- **Auto-fullscreen** → Immersive on tap
- **Edge-to-edge** → Maximize content, minimal chrome

### Anti-Patterns to Avoid
- Forced registration before trying — Let users browse first
- Slow load times — Preload everything
- Cluttered UI during reading — Keep chrome minimal
- Losing progress — Auto-save always

### Design Inspiration Strategy
- **Adopt**: Webtoon's smooth transitions, Kindle's sync, Apple's flip physics
- **Adapt**: Combine vertical + horizontal reading modes
- **Avoid**: Paywall-first, content loss on reload

---

## Design System Foundation

### Design System Choice
Custom Design System built on Tailwind CSS

### Rationale for Selection
- Already implemented — lower friction
- Complete visual control for flip experience
- Dark-first, reading-optimized
- Performance without runtime overhead

### Implementation Approach
- Extend tailwind.config.js with custom tokens
- Create reusable component patterns
- Define animation library (@apply for flip feel)
- Build design system progressively

### Customization Strategy
- **Colors**: Dark palette for immersion
- **Typography**: Reading-optimized fonts
- **Spacing**: Consistent rhythm system
- **Animations**: Flip physics, fade transitions

---

## 2. Core User Experience

### 2.1 Defining Experience
**"Flip to read the next page"** — The page-turn interaction with realistic animation that mimics physical books.

### 2.2 User Mental Model
- Physical book: right-to-left page turn
- Tap edges or swipe to navigate
- Double-tap to zoom, pinch to resize appear
- Progress restores automatically

### 2.3 Success Criteria
- **Flip animation**: 300-500ms with realistic physics
- **Controls**: Transparent (0% opacity when hidden), auto-hide after 2s, non-intrusive
- **Progress**: Always visible but subtle (non-distracting)

### 2.4 Novel UX Patterns
- Combined flipbook + webtoon modes
- Transparent touch control overlay that doesn't block content
- Gesture-aware navigation (knows when zoomed vs. reading)

### 2.5 Experience Mechanics
1. **Initiation**: Tap screen → controls fade in (300ms)
2. **Navigation**: Edge tap (15%) or swipe → page turns
3. **Controls**: Minimal chrome, positioned at bottom, auto-hide after 2s of inactivity
4. **Completion**: Smooth flip animation, automatic progress save

---

## Visual Design Foundation

### Color System
| Role | Color | Usage |
|------|-------|-------|
| Background | #0a0f1c | Deep dark for immersion |
| Surface | #131b2e | Cards, overlays |
| Primary | #D81E1E | Brand, progress |
| Highlight | #FFCA00 | Accents |
| Text Primary | #F3F4F6 | Main text |
| Text Secondary | #9CA3AF | Muted text |

### Typography System
- **Primary**: Montserrat (headings + body)
- Clean, modern, excellent readability
- Scale optimized for reading

### Spacing & Layout Foundation
- 4px base grid (Tailwind default)
- Generous content padding
- Edge-to-edge display on mobile

### Accessibility
- Dark-first: reduced eye strain during long reading
- High contrast: WCAG compliant
- 44px minimum touch targets for mobile

---

## Design Direction Decision

### Design Directions Explored
Your existing implementation serves as the primary design direction:
- Dark-first theme (#0a0f1c background)
- Red (#D41E1E) accent for brand moments
- Transparent control overlay with auto-hide

### Chosen Direction
**Baseline: Current Implementation**
- 14+ React components already built
- GoldCarousel for volume selection
- ReaderControls with transparent, auto-hiding design
- Flipbook + Webtoon mode support
- Gesture-based navigation

### Design Rationale
- Already implemented and functional
- Dark theme reduces eye strain during reading
- Transparent controls don't obstruct content
- Auto-hide (2s) balances accessibility with immersion

### Implementation Approach
- Use current component structure as foundation
- Refine control transparency and timing based on UX goals
- Document component patterns for consistency

---

## User Journey Flows

### Journey 1: Browse → Select Volume
1. User opens app
2. Views GoldCarousel with volumes
3. Taps desired volume
4. Fullscreen activates
5. Reader opens at saved page (or page 1)

### Journey 2: Reading & Navigation
- Tap left edge (15%) → previous page
- Tap right edge (15%) → next page
- Swipe left → next page
- Swipe right → previous page
- Double-tap → zoom mode
- Pinch → zoom (in zoom mode)
- Auto-hide controls after 2s inactivity

### Journey 3: Exit & Resume
1. User presses back / closes
2. Progress saved to Firestore/localStorage
3. Later: opens same volume
4. Resumes at exact saved page

### Journey Patterns
- **Progressive Disclosure**: Controls hidden, show on tap
- **Optimistic UI**: Instant flip, async save
- **Gesture Aware**: Knows context (reading vs. zoomed)
- **Auto-Save**: Every page turn, always synced

### Refinements from Party Mode
- **Browse**: Add volume metadata preview on tap (chapter count, progress)
- **Reading**: Edge zone subtle feedback on first visit; progress bar 2px at bottom
- **Exit→Resume**: "Continue from Page X?" prompt with thumbnail preview
- **Technical**: Start localStorage, add API sync only if multi-device needed

---

## Component Strategy

### Design System Components
Tailwind CSS provides: buttons, inputs, modals, layouts, colors, typography, animations.

### Custom Components (Already Built)
| Component | Purpose |
|-----------|---------|
| GoldCarousel | Volume browsing with horizontal scroll |
| ReaderControls | Transparent, auto-hide after 2s |
| NavigationOverlay | Edge tap zones (15% left/right) |
| ProgressBar | 2px subtle progress bar at bottom |
| ThumbnailDrawer | Page navigation grid |
| ZoomOverlay | Zoom mode with pinch support |
| WebtoonMode | Vertical scroll reading |
| FlipbookReader | Page flip with realistic animation |

### Component Implementation Strategy
- All core components already implemented
- Transparent controls design confirmed
- Gesture-aware navigation in place
- Progress auto-save on every page turn

### Implementation Roadmap
- **Phase 1 (Core)**: Reader, Navigation, Progress → ✅ Complete
- **Phase 2 (Supporting)**: Thumbnails, Zoom → ✅ Complete
- **Phase 3 (Enhancement)**: Webtoon mode → ✅ Complete

---

## UX Consistency Patterns

### Navigation Patterns
- Edge tap (15% zones): flip pages left/right
- Swipe gestures: left/right navigation
- Double-tap: zoom mode toggle
- Pinch: zoom when in zoom mode
- Auto-hide controls: 2s timeout after last interaction

### Feedback Patterns
- Progress bar: 2px height, accent color (#D81E1E), bottom edge
- Auto-save: debounced on page turn + visibility change triggers
- Resume prompt: "Continue from Page X?" on return with thumbnail preview
- Sync confirmation: subtle "✓ Saved" indicator (fades after 1s)

### Loading & Empty States
- BookLoader: spinning animation with "Carregando HQ" text
- PdfThumbnail: "Sem capa" fallback when no cover available
- ThumbnailDrawer: grid of page thumbnails for quick navigation

---

## Responsive Design & Accessibility

### Responsive Strategy
- **Mobile**: Primary focus — edge-to-edge reading, touch-optimized, bottom controls
- **Tablet**: Touch + gesture support, larger tap zones
- **Desktop**: Mouse click edges, hover states, keyboard shortcuts

### Breakpoint Strategy
Using Tailwind defaults: sm(<640px), md(640-1024px), lg(>1024px)

### Accessibility Strategy
- **Target**: WCAG Level AA (industry standard)
- **Color contrast**: #F3F4F6 on #0a0f1c = 14:1 ratio ✅
- **Touch targets**: 44px minimum (edge zones 15%)
- **Keyboard**: Escape exits zoom, arrow keys navigate pages
- **Screen reader**: role="presentation", aria-hidden on decorative elements

### Testing Strategy
- Real device testing (not just DevTools)
- Screen reader testing: VoiceOver, NVDA
- Keyboard-only navigation testing
- Color blindness simulation

### Implementation Guidelines
- Use vh/vw units for reader dimensions
- Mobile-first media queries
- Semantic HTML with ARIA labels
- Test on actual phones/tablets