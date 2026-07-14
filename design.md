# Ground Zero — Design Specification & Visual Standards

This document serves as the master guide for the Ground Zero visual design system, UI components, and design token implementation.

---

## 1. Visual Philosophy & Editorial Layouts

Ground Zero uses a **premium editorial publication style** instead of a generic SaaS layout:
*   **Typography-First Design:** Combined usage of high-contrast serif headers (*Playfair Display*), elegant italicized accents (*Cormorant Garamond*), and clean numeric/parameter tracking (*DM Sans*).
*   **Generous Spacing & Air:** Large margins (`--space-section` of 140px, `--space-hero` of 200px) and clean, border-delimited sections mimicking modern luxury interfaces.
*   **Smooth Motions:** Snappy keyword animations (1200ms morph) and custom bezier animations (`cubic-bezier(0.0, 0.0, 0.2, 1)`) for UI transitions.

---

## 2. Core Color Tokens (Light vs. Dark Mode)

All colors are controlled using CSS variables in [globals.css](file:///c:/Users/Rajat/antigravity/Ground-Zero/GroundZero/src/app/globals.css) and automatically mapped to Tailwind v4 class names.

### Master Themes
| Token Variable | Light Mode (Warm Alabaster) | Dark Mode (Premium Purple Night) | Description |
| :--- | :--- | :--- | :--- |
| `--gz-bg` | `#FAF9F5` | `#09080F` | Main page background |
| `--gz-bg-card` | `#FFFFFF` | `#13111F` | Grid card backgrounds |
| `--gz-text` | `#0A0A0A` | `#F5F2FF` | Primary text and headings |
| `--gz-secondary` | `#6B6B70` | `#A8A3C4` | Secondary paragraphs & labels |
| `--gz-tertiary` | `#A3A3AC` | `#625E7A` | Muted captions & placeholder text |
| `--gz-border` | `rgba(180,165,150,0.12)` | `rgba(168, 140, 255, 0.08)` | Thin container borders |
| `--gz-border-md` | `rgba(180,165,150,0.20)` | `rgba(168, 140, 255, 0.15)` | Mid-opacity borders |
| `--gz-border-strong` | `rgba(180,165,150,0.30)` | `rgba(168, 140, 255, 0.25)` | High-contrast borders / scrollbar |

### Luxury Action Accent Tokens
Used for status badges, tags, and highlights:
*   **Warm Accent (Champagne / Aubergine):**
    *   Light: Background `#F7F3EC` / Text `#6B5D4D`
    *   Dark: Background `#261A28` / Text `#F2CEE7`
*   **Green Accent (Sage / Forest Emerald):**
    *   Light: Background `#E8F0E9` / Text `#3E5E47`
    *   Dark: Background `#162821` / Text `#A5DFBD`
*   **Blue Accent (Steel Blue / Indigo Blue):**
    *   Light: Background `#EDF2F6` / Text `#3B546E`
    *   Dark: Background `#1D263B` / Text `#B9C7F2`
*   **Gold Accent (Cream Gold / Deep Gold):**
    *   Light: Background `#FAF5E6` / Text `#735D2E`
    *   Dark: Background `#2B2313` / Text `#E8C98B`

---

## 3. Typographic Scale

The platform loads three Google Fonts in [layout.tsx](file:///c:/Users/Rajat/antigravity/Ground-Zero/GroundZero/src/app/layout.tsx): `DM Sans` (Sans-serif), `Playfair Display` (Serif), and `Cormorant Garamond` (Accent Serif/Italics).

### Presets
*   **`gz-hero-headline`:** `clamp(56px, 7vw, 96px)` / `--leading-display` (1.02) / `--tracking-tight` (-0.03em)
*   **`gz-h2`:** `clamp(32px, 4vw, 56px)` / `--leading-heading` (1.1) / `--tracking-tight` (-0.02em)
*   **`gz-h3`:** `clamp(24px, 3vw, 36px)` / `--leading-heading` (1.1)
*   **`gz-eyebrow`:** `10px` / `--tracking-widest` (0.20em) / Uppercase
*   **`gz-body-lg`:** `18px` / `--leading-body` (1.65) / Font-Weight 300
*   **`gz-body`:** `16px` / `--leading-body` (1.65)
*   **`gz-caption`:** `12px` / Font-Weight 400

---

## 4. CSS Design Tokens & Reset Rules

Custom borders and panels enforce standard visual roundedness:
*   **Border Radius:**
    *   `--radius-sm`: `8px` (Buttons, small cards)
    *   `--radius-md`: `12px` (Medium elements)
    *   `--radius-lg`: `16px` (Detail modals, map canvas elements)
    *   `--radius-xl`: `20px` (Inner panel layouts)
    *   `--radius-2xl`: `28px` (Main card containers, dashboards)
*   **Shadows:**
    *   `--shadow-card`: `0 4px 16px rgba(0,0,0,0.05), 0 1px 4px rgba(0,0,0,0.03)`
    *   `--shadow-float`: `0 24px 48px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)`

---

## 5. UI Elements & Layout Canvas indicator styling

### interactive Stall Floorplan status mapping:
Stall maps display interactive SVG rectangles. The color codes are styled dynamically based on the stall's booking status:

1.  **AVAILABLE:** Transparent fill, thin border.
    *   *Light Mode:* White background card, fine border.
    *   *Dark Mode:* `#13111F` card background, gold border highlight.
2.  **BOOKED / PAID:** Solid, high-contrast dark fills.
    *   *Light Mode:* Solid Black.
    *   *Dark Mode:* Solid Midnight Black.
3.  **NEGOTIATION:** Muted blue-dashed elements.
    *   *Light Mode:* Dashed border, semi-transparent.
    *   *Dark Mode:* Steel blue-dashed border, muted fill.
4.  **RESERVED:** Muted grey elements indicating pending admin holds.
    *   *Light Mode:* Muted Silver-Grey.
    *   *Dark Mode:* Deep Gold (`#2B2313`) fill with gold text overlay.
