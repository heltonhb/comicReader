# Design System: Golden Noir

## 1. Core Philosophy

The design language is centered around **Cinematic Luxury**. It evokes the feeling of premium physical media, collector's editions, and high-end theater experiences. Dark backgrounds provide depth, while gold and red accents guide the user's attention.

## 2. Visual Theme: "Golden Noir"

**Core Aesthetic:**

- **Vibe:** Ultra-premium, exclusive, cinematic, high-contrast.
- **Lighting:** Spotlight effects, moody vignetting, glowing accents.
- **Reference:** High-end streaming apps, luxury watch interfaces, physical collector's edition boxes.

### Color Palette

- **Primary Background:** `Void Dark Gradient` (radial from #1c1c1e to #121214).
- **Accent Primary (Gold):** `Champagne Gold` (#E5D0AC) for headings, borders, and premium indicators.
- **Accent Secondary (Red):** `Crimson Neon` (#D92534) for primary Call-to-Actions (CTAs) and active states.
- **Text Primary:** `Ivory` (#F5F5F0) or White for body text and high legibility.
- **Text Secondary:** `Muted Gold` (#B8A07E) for subtitles, metadata, and labels.
- **Text Tertiary:** `Grey-500` (#71717a) for less important details.
- **Borders/Glows:** `Amber Glow` (rgba(229, 208, 172, 0.5)) for active items.

### Typography

- **Headings:** Sans-serif, Bold (700/800), Uppercase, Tracking-widest. Prefer fonts like *Montserrat*, *Inter*, or *Outfit*.
- **Body:** Clean sans-serif, high readability, normal tracking.

### Component Styling

- **Cards:** 3D perspective ("Cover Flow"), rounded corners (xl or 2xl). Active item has a glowing border (`border-gold/50`, `shadow-gold/30`). Inactive items are dimmed (`opacity-60`) and smaller (`scale-75`).
- **Glassmorphism:** Subtle usage. Dark tinted glass (`bg-black/40`, `backdrop-blur-md`) for overlays or navigation bars.
- **Buttons (Primary CTA):**
  - Shape: Circular or pill-shaped with full rounding.
  - Background: Gradient Red (`bg-gradient-to-r from-red-600 to-red-700`).
  - Shadow: Glowing Red shadow (`shadow-red-500/50`).
  - Text: White, Bold, Uppercase.
- **Navigation:** Simple, icon-based, minimal distraction.
- **Pagination:** Simple dots. Active = Red, Inactive = Dark Grey.

## 3. Layout Principles

- **Central Focus:** The active item in the carousel is the absolute hero. Everything else frames it.
- **Vertical Rhythm:** Clear spacing between Header -> Carousel -> Details -> CTA.
- **Whitespace:** Generous use of negative space to create a "luxury" feel.
- **Z-Index Layering:** Content should float above the deep background.

## 4. Animation

- **Transitions:** Smooth, spring-based physics for carousel movement.
- **Hover/Active:** Subtle scale up (105%) and brightness increase.
- **Entrance:** Fade-in and slide-up for text elements.
