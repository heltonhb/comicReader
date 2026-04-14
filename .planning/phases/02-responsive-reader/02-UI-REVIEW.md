---
phase: 02
title: "UI Audit — Leitor Responsivo Definitivo"
auditor: gsd-ui-auditor
date: 2026-04-14
overall_score: 17
max_score: 24
---

# UI Audit — Phase 02: Leitor Responsivo Definitivo

## Overall Score: 17/24

| Pillar | Score | Verdict |
|--------|-------|---------|
| Copywriting | 3/4 | Good — Portuguese labels clear, minor improvement areas |
| Visuals | 3/4 | Good — Shimmer skeleton is premium; drop-shadow conditional well done |
| Color | 3/4 | Good — Dark palette consistent; brand colors underused |
| Typography | 2/4 | Needs Work — Hardcoded px sizes, no font-display tokens |
| Spacing | 3/4 | Good — Safe-area support added; minor inconsistencies in control bar |
| Experience Design | 3/4 | Good — Zoom gestures intuitive; some discoverability issues |

---

## Pillar 1: Copywriting (3/4)

### ✓ Strengths
- **Bilingual consistency**: All user-facing strings in Portuguese (target audience) — "Voltar", "Índice", "Resetar Zoom", "Página Anterior", "Próxima Página"
- **Contextual hints**: ProgressBar shows different instructions for mobile ("Toque nas laterais para virar • Belisque para zoom") vs desktop ("Clique nas laterais ou use ← →")
- **Accessible labels**: All buttons have `aria-label` attributes with descriptive Portuguese text

### ⚠ Findings
| ID | Severity | Component | Issue | Fix |
|----|----------|-----------|-------|-----|
| C-01 | Low | `ZoomResetButton` | "Resetar Zoom" uses anglicized verb. Consider "Restaurar Zoom" or simpler "1:1" | Change label text |
| C-02 | Low | `ProgressBar` | "Belisque para zoom" — "belisque" is informal. Consider "Toque duplo para zoom" which is more accurate to the actual double-tap behavior | Update hint string |
| C-03 | Info | `NavigationOverlay` | Chevron icons appear on hover only — no text cue for first-time users on desktop. Consider a first-visit tooltip | Add onboarding hint |

---

## Pillar 2: Visuals (3/4)

### ✓ Strengths
- **Shimmer skeleton** (`animate-shimmer` + `animate-pulse`) replaces generic spinner — premium loading feel
- **Conditional drop-shadow**: `drop-shadow(0 25px 25px rgba(0,0,0,0.15))` only on desktop; clean edge-to-edge on mobile
- **Clean page rendering**: `overflow-hidden`, `border-x border-white/5` creates subtle page-edge definition
- **Page number watermark**: `text-white/20 text-[9px]` — unobtrusive but present

### ⚠ Findings
| ID | Severity | Component | Issue | Fix |
|----|----------|-----------|-------|-----|
| V-01 | Medium | `Page.jsx` | Placeholder for non-visible pages shows only page number in `text-white/5 text-[8px]` — invisible on dark background. Add a very faint page outline or small icon | Add `border border-white/[0.03]` to placeholder div |
| V-02 | Low | `FlipbookReader` | `TransformComponent` uses `!w-full !h-full` with `!important` overrides. If `react-zoom-pan-pinch` updates CSS internal structure, these will break silently | Create proper wrapper class in `index.css` instead of `!important` hacks |
| V-03 | Low | `ReaderControls` | Tooltip spans (`hidden sm:block`) use `scale-90 group-hover:scale-100` animation on every button — 5 simultaneous scale animations on hover feels heavy on low-end devices | Use `opacity` only, drop `scale` transition |

---

## Pillar 3: Color (3/4)

### ✓ Strengths
- **Dark palette consistency**: `bg-zinc-950`, `bg-zinc-900`, `bg-background (#0a0f1c)` — coherent dark theme
- **Glass morphism**: `bg-zinc-900/70 backdrop-blur-xl` on controls — modern, non-intrusive
- **Brand color used**: `bg-primary/70` in ProgressBar fill — ties reader to brand identity
- **Subtle separators**: `border-white/10`, `ring-1 ring-white/10` — refined micro-contrast

### ⚠ Findings
| ID | Severity | Component | Issue | Fix |
|----|----------|-----------|-------|-----|
| CO-01 | Medium | `ZoomResetButton` | Uses `bg-black/60` instead of the design system `bg-zinc-900/70` used by ReaderControls. Inconsistent glass morphism | Align to `bg-zinc-900/70 backdrop-blur-xl` |
| CO-02 | Low | `NavigationOverlay` | Chevron color is `text-white/70` but hovers to pure `text-white`. Could use `text-text-primary` token for consistency | Use Tailwind token |
| CO-03 | Info | Global | `highlight` (#FFCA00) and `secondary` (#008000) brand colors are defined in config but never used in reader components. Consider using `highlight` for zoom-active indicator | Optional brand enrichment |

---

## Pillar 4: Typography (2/4)

### ✓ Strengths
- **Font stack defined**: `Montserrat, Roboto, system-ui` in `:root` and Tailwind config
- **Tabular nums**: ProgressBar uses `tabular-nums` for page counter — prevents layout shift

### ⚠ Findings
| ID | Severity | Component | Issue | Fix |
|----|----------|-----------|-------|-----|
| T-01 | High | `Page.jsx` | Page number watermark uses `text-[9px]` — hardcoded pixel size. Below minimum accessible font size (10px). If this is decorative, add `role="presentation"` | Add ARIA role or bump to `text-[10px]` |
| T-02 | High | `ProgressBar` | Help text uses `text-[10px]` — at accessibility floor. Combined with `text-white/30` (4.5:1 contrast fails against dark bg), this is WCAG-fail territory | Bump to `text-xs` (12px) and `text-white/50` |
| T-03 | Medium | `ProgressBar` | Page counter `text-[11px]` is between Tailwind scales (`text-xs` = 12px). Use design system scale | Change to `text-xs` |
| T-04 | Medium | `ZoomResetButton` | Uses `text-sm` which is correct, but `font-medium` while ReaderControls buttons don't specify font-weight. Inconsistent weight hierarchy | Align font-weight across controls |
| T-05 | Low | Global | No `@font-face` `font-display: swap` declaration for Montserrat. FOIT risk on slow connections | Add `font-display: swap` in CSS or Google Fonts import |

---

## Pillar 5: Spacing (3/4)

### ✓ Strengths
- **Safe-area insets**: `env(safe-area-inset-bottom)` support via `.reader-controls-safe` class — notch/Dynamic Island aware
- **PROGRESS_BAR_HEIGHT constant**: `32px` reservation prevents content overlap
- **Responsive padding strategy**: `MOBILE_PADDING=0`, `TABLET_PADDING=24`, `DESKTOP_PADDING=48` — deliberate scale
- **Smooth orientation transitions**: `.reader-container` with `transition: width 0.3s ease-out`

### ⚠ Findings
| ID | Severity | Component | Issue | Fix |
|----|----------|-----------|-------|-----|
| S-01 | Medium | `ReaderControls` | `bottom-8` (32px) from viewport bottom, but `ProgressBar` is `bottom-0`. On mobile, the control bar overlaps the progress bar. The `PROGRESS_BAR_HEIGHT` reserves space for the page content but not for the controls | Add `mb-12` or `bottom-16` to push controls above progress |
| S-02 | Low | `ReaderControls` | `gap-2` (8px) between buttons, `px-4 py-3` padding. On small phones (320px width), 5 buttons × (p-3 + gap-2) = ~260px. Tight but works. Below 320px would overflow | Add `overflow-x-auto` as safety net |  
| S-03 | Low | `NavigationOverlay` | Touch targets are `w-[15%]` — on a 375px phone, that's 56px. Apple HIG recommends 44px minimum ✓ but close to the edge | Acceptable but monitor on smaller devices |
| S-04 | Info | `Page.jsx` | Placeholder page number `text-[8px]` has no padding from container edges. Could be clipped on extremely small pages | Add `p-1` to placeholder |

---

## Pillar 6: Experience Design (3/4)

### ✓ Strengths
- **Inline zoom**: Pinch-to-zoom now works directly on the page (vs. old modal overlay) — much more native feel
- **Gesture conflict prevention**: Swipe navigation auto-disables during zoom (`panning.disabled: !isZoomed`) — prevents accidental page flips
- **Background preloading**: `useImagePreloader` loads 3 pages ahead — eliminates white-flash on page turn
- **Debounced viewport resize**: 100ms debounce prevents jitter during mobile address bar animation
- **Performance optimization**: `decoding="async"`, `fetchPriority="high"` for first 2 pages

### ⚠ Findings
| ID | Severity | Component | Issue | Fix |
|----|----------|-----------|-------|-----|
| E-01 | High | `ReaderControls` | The "Zoom" button (`toggleZoom` from store) still exists in the controls, but its behavior is now disconnected — it toggles `isZoomed` in store without controlling the `TransformWrapper`. Pinch and double-tap work, but the button does nothing visible | Either remove the Zoom button from controls, or wire it to `TransformWrapper.zoomIn()` |
| E-02 | Medium | `FlipbookReader` | `disableFlipByClick: isMobile` disables click-to-flip on mobile, expecting swipe. But the swipe handler (`handleTouchStart`/`handleTouchEnd`) is on the outer div which also receives `TransformWrapper` touch events. Potential gesture deadzone when zoom is at 1x | Test on real mobile device and verify swipe works at scale=1 |
| E-03 | Medium | Global | No keyboard shortcut for zoom reset. `Esc` should reset zoom (mentioned in plan but not implemented) | Add `useEffect` with keydown listener for 'Escape' → `resetTransform()` |
| E-04 | Low | `ZoomResetButton` | Button position `top-4 right-4` could collide with device status bar in fullscreen mode on notched phones | Use `top-[env(safe-area-inset-top)+16px]` or conditional offset |

---

## Priority Fix List

### 🔴 Critical (Must Fix)
1. **E-01**: Zoom button in ReaderControls is dead — either remove it or wire to TransformWrapper
2. **T-01/T-02**: Sub-accessible font sizes and low-contrast text in ProgressBar

### 🟡 Important (Should Fix)
3. **CO-01**: ZoomResetButton styling inconsistent with control bar glass morphism
4. **S-01**: ReaderControls overlaps ProgressBar on mobile
5. **E-03**: Missing Escape key handler for zoom reset

### 🟢 Nice to Have
6. **V-03**: Optimize tooltip animations (opacity only, drop scale)
7. **T-05**: Add `font-display: swap` for Montserrat

---

## UI REVIEW COMPLETE
