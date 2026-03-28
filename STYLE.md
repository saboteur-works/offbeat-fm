# OffBeat-FM — UI Styling Guide

**Version:** 0.1  
**Parent brand:** Saboteur LLC (SAB/works)  
**Last updated:** 2026-03

---

## 1. Brand context

OffBeat-FM is an independent music discovery platform built for artists who haven't been found yet and listeners who want to find them. It is not a streaming service and is explicitly not algorithmic in the way major platforms are. The brand positioning is confrontational toward the status quo of music platforms — this should be legible in the UI without being loud about it.

The product sits within the Saboteur system. It shares the parent brand's type family (IBM Plex), color tokens, and structural logic (red marks structure and interaction). Where it differs from the parent brand: red appears at higher frequency here than in GetWrite, because OffBeat-FM is a platform with energy and discovery as core qualities. Red signals that something is happening — an active state, an action, a live element.

The canonical product name is **OffBeat-FM**. Not "OffBeat", not "Offbeat". The FM suffix is intentional and should always be present in the wordmark. In running prose, "OffBeat-FM" is acceptable. In code, use `offbeat-fm` as the identifier convention.

---

## 2. Color tokens

These are the only colors in the system. Do not introduce new colors without explicit approval.

```
--color-black:   #0A0A0A   /* primary background, dark UI surfaces */
--color-white:   #F5F4F0   /* primary text, light UI background — warm, not pure white */
--color-red:     #D44040   /* Signal Red — brand accent, structure and interaction */
--color-mid:     #6A6864   /* secondary text, muted labels, descriptors */
--color-surface: #111110   /* raised dark surfaces, cards on dark background */
--color-surface2: #161614  /* deeper surface, nested elements on dark background */
--color-dim:     #2E2E2C   /* borders, rules, very muted elements */
--color-rule:    #1A1A18   /* divider lines, structural separators */
```

### Red usage — OffBeat-FM specific

Red appears at higher frequency in OffBeat-FM than in the parent brand or GetWrite. Every use of red must still trace back to one of these categories:

**Red IS used for:**

- The FM suffix in the wordmark (always red, on both dark and light backgrounds — never inverts)
- The vertical bar on the wordmark lockup
- Active navigation state (current page indicator)
- Primary CTA buttons (red fill, white text)
- Track card left-border accent stripe (3px, full card height)
- Artist card left-border accent (3px)
- Active/selected state on genre tags and filter chips
- Focus rings on interactive elements (use `rgba(212, 64, 64, 0.4)`)

**Red is NOT used for:**

- Body text or headings
- Decorative fills or gradient overlays
- Error states — use a system error color distinct from brand red to avoid semantic confusion
- Icon fills unless the icon is directly tied to a red-designated element
- Hover states — use white/mid tone shifts instead
- Secondary buttons — use outlined with dim border, mid text

### Dark/light mode

The product supports dark mode as primary, light mode as secondary. The token names above refer to dark mode values. Light mode inverts the surface hierarchy but keeps red identical — red never changes value between modes.

Light mode surface tokens:

```
--color-black:   #F5F4F0   /* inverted — now the background */
--color-white:   #0A0A0A   /* inverted — now the text */
--color-surface: #ECEAE3   /* light raised surface */
--color-surface2: #E4E1DA  /* deeper light surface */
--color-dim:     #D0CEC8   /* light mode borders */
--color-rule:    #D8D5CE   /* light mode dividers */
--color-mid:     #7A7870   /* slightly adjusted for light contrast */
```

Red (#D44040) and mid (#6A6864) are unchanged in light mode.

---

## 3. Typography

All type is set in the IBM Plex family. Do not substitute other typefaces.

### Typeface roles

| Role               | Typeface                | Weight   | Use                                                            |
| ------------------ | ----------------------- | -------- | -------------------------------------------------------------- |
| Display / Wordmark | IBM Plex Sans Condensed | 700      | Product name, hero headings, section titles at large sizes     |
| Body               | IBM Plex Sans           | 400, 700 | UI text, descriptions, nav labels                              |
| Technical / Mono   | IBM Plex Mono           | 400, 500 | Labels, metadata, tags, timestamps, descriptors, the FM suffix |

### Type scale

```
--text-hero:    clamp(60px, 9vw, 88px)   /* hero wordmark, major landing headings */
--text-display: 48px                      /* section heroes, large feature headings */
--text-h1:      32px                      /* page titles */
--text-h2:      22px                      /* section headings */
--text-h3:      16px                      /* card titles, subsection headings */
--text-body:    14px                      /* primary body text */
--text-small:   13px                      /* secondary body, descriptions */
--text-label:   11px                      /* UI labels, nav items */
--text-micro:   10px                      /* timestamps, metadata, mono labels */
--text-nano:     9px                      /* the smallest permissible size */
```

### Tracking (letter-spacing)

Condensed display type runs tight: `-0.04em` at hero size, `-0.03em` at display, `-0.02em` at h1.  
Mono labels run open: `0.14em` to `0.22em` depending on size — wider tracking at smaller sizes.  
Body text runs at default (`0`) or `0.01em` maximum.

### Line height

```
--leading-tight:  1.05   /* hero/display headings */
--leading-snug:   1.3    /* h1, h2 */
--leading-normal: 1.6    /* h3, body */
--leading-relaxed: 1.8   /* small body, descriptions */
```

### Wordmark construction

The OffBeat-FM wordmark is always constructed as follows:

- "OffBeat" in IBM Plex Sans Condensed 700, `letter-spacing: -0.04em`, color: white (or black on light bg)
- "FM" immediately following, in IBM Plex Mono 400, approximately 52% of the wordmark font size, `letter-spacing: 0.04em`, color: `#D44040` (never inverts)
- Left border: 4px solid `#D44040`

At nav/small sizes:

- "OffBeat" in IBM Plex Sans Condensed 700, 20px, `letter-spacing: -0.03em`
- "FM" in IBM Plex Mono 400, 11px, `letter-spacing: 0.1em`, color: `#D44040`
- Left border: 3px solid `#D44040`

Do not render the wordmark as a single styled string. The FM element must be a separate span with its own styles.

---

## 4. Spacing

Base unit is 4px. All spacing values are multiples of 4.

```
--space-1:   4px
--space-2:   8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
```

Page-level horizontal padding: `--space-16` (64px) at desktop, `--space-6` (24px) at mobile.  
Card internal padding: `--space-8` (32px) standard, `--space-6` (24px) compact.

---

## 5. Surfaces and elevation

OffBeat-FM uses a dark-first surface stack. Elevation is communicated through surface color shift, not shadows.

```
Level 0 — Page background:     #0A0A0A  (--color-black)
Level 1 — Cards, panels:       #111110  (--color-surface)
Level 2 — Nested elements:     #161614  (--color-surface2)
Level 3 — Inputs, code blocks: #1C1C1A
```

Borders use `0.5px solid #2E2E2C` (--color-dim) as the default. Use `1px solid #2E2E2C` for emphasized borders. Never use drop shadows for elevation — surface color is the only elevation signal.

Border radius:

```
--radius-sm:  3px    /* tags, chips, small elements */
--radius-md:  5px    /* buttons, inputs */
--radius-lg:  8px    /* cards */
--radius-xl: 12px    /* modals, large containers */
```

---

## 6. Component patterns

### Navigation bar

Height: 52px. Background: `--color-black`. Bottom border: `0.5px solid --color-dim`.

- Wordmark: left-anchored, 16px from left edge
- Nav links: IBM Plex Mono, 10px, `letter-spacing: 0.14em`, uppercase, color `--color-mid`. Active state: `--color-white` with no additional decoration — the color shift is sufficient
- Auth buttons: IBM Plex Mono, 10px, uppercase. Outlined style: `border: 1px solid --color-dim`, transparent background. On hover: border shifts to `--color-mid`

### Buttons

**Primary (CTA):**

- Background: `#D44040`
- Text: `#F5F4F0`, IBM Plex Mono 400, 10px, `letter-spacing: 0.18em`, uppercase
- Padding: `10px 20px`
- Border radius: `--radius-md` (5px)
- No border
- Hover: darken background to `#C03838`

**Outline:**

- Background: transparent
- Text: `--color-mid`, IBM Plex Mono 400, 10px, `letter-spacing: 0.18em`, uppercase
- Border: `1px solid --color-dim`
- Padding: `10px 20px`
- Border radius: `--radius-md`
- Hover: border shifts to `--color-mid`, text shifts to `--color-white`

**Destructive:**

- Use outline style with `border-color: #D44040` and `color: #D44040`
- Never use red fill for destructive actions — the fill is reserved for primary CTAs

### Track cards

Structure:

1. Square art thumbnail (full width, aspect-ratio 1:1). Background: `--color-surface2`. Left border accent: `3px solid #D44040`.
2. Track title: IBM Plex Sans 700, 13px, `--color-white`, `letter-spacing: -0.01em`
3. Artist name: IBM Plex Mono 400, 10px, `--color-mid`, `letter-spacing: 0.06em`

Genre label inside the art thumbnail: IBM Plex Mono 400, 8px, uppercase, `letter-spacing: 0.1em`, `--color-mid`, positioned bottom-left with `8px` padding.

The red left-border stripe on the art thumbnail is not optional. It is the track card's visual connection to the brand system.

### Artist cards / profile header

Left-border accent: `3px solid #D44040`.  
Artist name: IBM Plex Sans Condensed 700, 22px, `letter-spacing: -0.02em`.  
Meta line (track count, genre): IBM Plex Mono 400, 10px, `letter-spacing: 0.1em`, `--color-mid`.

Tags/genre chips: IBM Plex Mono 400, 9px, uppercase, `letter-spacing: 0.14em`. Default state: `border: 0.5px solid --color-dim`, `color: --color-mid`. Active/selected: `border-color: #D44040`, `color: #D44040`, `opacity: 0.8`.

### Section headers / eyebrows

Eyebrow labels above section headings: IBM Plex Mono 400, 10px, uppercase, `letter-spacing: 0.2em`, `color: #D44040`.

Example: "NEW THIS WEEK" or "RECENTLY ADDED" set in mono above a condensed display heading.

### Forms and inputs

Input fields: IBM Plex Sans 400, 13px, `--color-white`. Background: `--color-surface2`. Border: `0.5px solid --color-dim`. Border radius: `--radius-md`. Padding: `10px 14px`. On focus: border shifts to `0.5px solid --color-mid`, focus ring `0 0 0 3px rgba(212,64,64,0.2)`.

Labels: IBM Plex Mono 400, 10px, uppercase, `letter-spacing: 0.14em`, `--color-mid`. Always above the input, `8px` gap.

---

## 7. Iconography

Use outline-style icons only. Filled icons conflict with the flat surface system. Recommended library: Lucide (already used in the codebase).

Icon color follows the element it sits within — it is never independently colored. In nav: `--color-mid`. In active state: `--color-white`. Never red unless the icon is inside a red-designated interactive element.

---

## 8. Motion

Transitions: `150ms ease` for color/border shifts (hover, focus, active states). `200ms ease` for opacity and transform changes. Do not use spring physics or bounce easing — it conflicts with the brand's direct, no-nonsense register.

No decorative animations. Motion serves function: indicating state change, confirming action, revealing content. An element should never move without a reason.

---

## 9. What this product is not

These patterns should never appear in OffBeat-FM UI:

- **Blue interactive elements.** Browser default blue has no place in this system. If you find yourself reaching for blue, use `--color-red` for primary actions and `--color-mid` / `--color-white` for secondary.
- **Gradient overlays on hero sections.** Flat surfaces only. If you need to overlay text on an image, use a solid dark overlay at controlled opacity.
- **Rounded typefaces.** If IBM Plex is unavailable, fall back to system sans-serif — do not substitute a rounded font.
- **Emoji in UI chrome.** The landing page previously used musical note emoji as decorative elements. Remove these. They conflict with the editorial register.
- **Mixed casing on the product name.** Always "OffBeat-FM". Never "Offbeat FM", "offbeat-fm" (in display contexts), or "OffBeat" alone.

---

## 10. Relationship to parent brand

OffBeat-FM is a product of SAB/works (saboteur-works). The Saboteur parent mark does not appear in the product UI except in footer attribution ("A Saboteur product" or "© Saboteur LLC") and about/legal pages.

The OffBeat-FM mark is not a sub-brand of SABOTEUR in the same way SAB/labs and SAB/works are — it is a product. The relationship is: Saboteur → SAB/works → OffBeat-FM. The visual connection is maintained through the shared type system, color tokens, and structural logic (red bar, mono labels), not through the mark itself.
