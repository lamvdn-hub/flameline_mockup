---
name: Flameline
description: One continuous scroll-driven camera flight from an Estelí field to a lit cigar, under a single ember key light on near-black ground.
colors:
  ember: "#d49152"
  amber: "#e7b46a"
  bronze: "#b89968"
  oxblood: "#8b2d20"
  ground: "#0c0a08"
  panel: "#14110e"
  line: "#3a312a"
  cream: "#e9e2d3"
  muted: "#c9bfa8"
  dim: "#6f6350"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.6rem, 5.4vw, 5rem)"
    fontWeight: 300
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "normal"
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
  wordmark:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.26em"
  body:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: 1.55
    letterSpacing: "0.01em"
  body-small:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: 1.7
    letterSpacing: "0.01em"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "10.5px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.22em"
  label-tight:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.18em"
rounded:
  none: "0"
spacing:
  s1: "8px"
  s2: "16px"
  s3: "24px"
  s4: "32px"
  s8: "64px"
  s12: "96px"
  section: "72px"
  section-mobile: "56px"
components:
  button-primary:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.ground}"
    typography: "{typography.label-tight}"
    rounded: "{rounded.none}"
    padding: "15px 26px"
  button-primary-hover:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.ground}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.amber}"
    typography: "{typography.label-tight}"
    rounded: "{rounded.none}"
    padding: "15px 26px"
  button-outline-hover:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.ground}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.label-tight}"
    padding: "24px 14px 22px"
  nav-link-hover:
    textColor: "{colors.amber}"
  nav-b2b:
    backgroundColor: "transparent"
    textColor: "{colors.amber}"
    typography: "{typography.label-tight}"
    rounded: "{rounded.none}"
    padding: "9px 16px"
  nav-b2b-hover:
    backgroundColor: "{colors.ember}"
    textColor: "{colors.ground}"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.label-tight}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
  card-pathway:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "30px 26px"
  package-row:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "18px 22px"
  image-slot:
    backgroundColor: "transparent"
    textColor: "{colors.dim}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
---

# Design System: Flameline

## Overview

**Creative North Star: "The Single Ember"**

A dark room lit by one flame. Everything in the world is either the near-black ground the room is made of, the cream and parchment the light falls on, or the ember itself. The page is a photoreal camera flight, an Estelí tobacco field to a cigar catching from a lighter, and scroll is the only thing that moves the camera. Chrome stays out of the way: a fixed hairline nav, a rail of four ember dots, a mono scroll hint. Nothing else animates, nothing floats, nothing lifts.

Density is low and unhurried. Copy sits in a single 42vw column pinned to the left of the film, one headline and one sentence per scene, tags in tracked mono underneath. The body sections beneath the film keep the same restraint: a numbered section head with a hairline rule, a three-card row on panel, one two-column teaser, one trade band, a footer. The build ships these body sections at placeholder grade (lorem ipsum, dashed image slots awaiting client photography); their structure and tokens are the system, their copy and imagery are not.

Materials are filmic rather than digital: a fine SVG turbulence grain overlays the whole page at 50% overlay blend, display type is a light-weight Garamond with one italic ember word per headline, all rules are 1px hairlines, all corners are square. The category default (hero grid, at-a-glance card, three feature tiles with icons) is rejected in favour of one continuous shot.

**Key Characteristics:**
- One key light: ember (#d49152) is the only saturated colour on any screen; amber is its highlight, bronze its resting stroke.
- Near-black ground (#0c0a08) with a single panel step (#14110e) and 1px hairlines (#3a312a) for all structure.
- Cormorant Garamond at weight 300 for display, weight 400 for section headlines, with one italic ember word for emphasis.
- JetBrains Mono for every label, tag, nav item and button: 10 to 11px, uppercase, tracked 0.18 to 0.22em.
- Square corners everywhere; the only curves are the 9px route dots and the drawn scroll-hint mouse.
- Motion is scroll: the film scrubs with the scrollbar, and every other state change is a 200 to 300ms colour or opacity fade.
- Fine film grain over everything (body::before, fractalNoise, 50% opacity, overlay blend).

## Colors

A monochrome warm-black room with one ember accent and its two derived warm tones; oxblood is held in reserve for the health warning.

### Primary
- **Ember** (#d49152): the single key light. Italic emphasis words in headlines, scene eyebrows, section numbers and card kickers, the primary button fill, the route rail dots and rail line, the animated wheel inside the scroll hint. It is never used as a text colour for running copy.
- **Amber** (#e7b46a): ember's highlight. The wordmark, page-wide link colour, outline button text, nav hover, primary button hover fill, the focus-visible outline (1px, 3px offset).
- **Bronze** (#b89968): ember's resting stroke. Outline-button and B2B-login borders, the pathway card border on hover, the scrollbar thumb on hover.

### Tertiary
- **Oxblood** (#8b2d20): reserved. The footer health warning and the italic ampersand in the trade headline. Never a fill, never a CTA.

### Neutral
- **Ground** (#0c0a08): the page and film background, the primary button's label colour, the solid nav once the hero has scrolled away, the package-row fill. The engine's `--sw-bg` maps here so scene posters and the copy gradient dissolve into it.
- **Panel** (#14110e): one tonal step up. Pathway cards and the events section band.
- **Line** (#3a312a): every hairline: nav bottom, section bottoms, card borders, package grid gaps, image-slot dashes, scrollbar thumb.
- **Cream** (#e9e2d3): headline and body text, the wordmark on hover, selection text.
- **Muted** (#c9bfa8): secondary text: card bodies, teaser bodies, kickers by default, nav links, tags, scroll hint.
- **Dim** (#6f6350): tertiary text: footer meta and image-slot labels.

### Named Rules
**The Single Ember Rule.** Ember is the only saturated colour on a screen and it lands on small things: one italic word, a 10px label, a 9px dot, one button fill. If ember is on more than roughly a tenth of a viewport, the scene has two lights and the rule is broken.

**The Warm Derivative Rule.** Interactive states move within the ember family only: rest in bronze, hover to amber or ember, never to a new hue. Links are amber at rest and underline on hover; they do not change colour.

**The Oxblood Reserve Rule.** Oxblood appears only where the law or the language asks for it (the health warning, a typographic ampersand). It is never a call to action, a badge or a hover state.

## Typography

**Display Font:** Cormorant Garamond (with Georgia, serif)
**Body Font:** Inter Tight (with system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace)

**Character:** A light, high-contrast serif carries every headline at weight 300 or 400 with tight negative tracking and one italic ember word; a tracked uppercase monospace carries every label like a plate on a humidor drawer; a compact grotesque at weight 300 does the quiet reading in between. The pairing reads as editorial and unhurried, never as a tech product.

### Hierarchy
- **Display** (300, clamp(2.6rem, 5.4vw, 5rem), 0.98, -0.02em): the film's per-scene headline and the no-JS fallback hero. One word per headline set in italic ember (`<em>`). Text-wrap balanced. Mobile: clamp(1.9rem, 7.5vw, 2.7rem).
- **Headline** (400, 32 to 40px, 1.05): section heads (34px), the events teaser (40px, 32px under 860px) and the trade band (32px, 28px under 860px). Emphasis word in italic ember at weight 300.
- **Title** (400, 24px): pathway card titles. Package names use the same face at 20px.
- **Wordmark** (500, 22px, 0.26em, uppercase): "Flameline" in the nav in amber, 19px in the footer. Cormorant is the only face used for the brand.
- **Body** (300, 16px base, 1.55, 0.01em): running copy. Section bodies step down to 13.5 to 14.5px at 1.6 to 1.7 line-height; the film body is clamp(1rem, 1.25vw, 1.14rem) at 1.55. Measures are short: 40ch in the film, 52ch in the teaser, 60ch in the trade band.
- **Label** (400, 10.5px, 0.22em, uppercase): kickers, scene eyebrows, scene counters, section numbers (11px in ember), image-slot labels. Tight variant (10px, 0.18em) for nav links, tags, card CTAs, rail labels, footer meta (9.5px). Buttons use 11px at 0.18em.

### Named Rules
**The Light Display Rule.** Headlines are Cormorant Garamond at 300 (display) or 400 (section), tracked -0.02em at display size, line-height at or under 1.05, with exactly one italic ember word. No bold weights, no all-caps headlines, no system serif fallback in shipped markup.

**The Tracked Plate Rule.** Anything that names, numbers or navigates is JetBrains Mono 10 to 11px, uppercase, tracked 0.18 to 0.22em, weight 400, in muted, ember or amber. Never in the serif, never in the sans, never below 9.5px.

## Layout

The page is two layers. The film is a fixed full-viewport stage (`position: fixed; inset: 0`) scrubbed by a tall scroll track: each of the four scenes owns 1.4 viewport-heights of scroll by default (the field 1.7, the light 1.8), adjacent scenes dissolve across 0.4vh, and a `linger` remap (0.25 to 0.45) settles the camera mid-scene where the copy peaks. No connectors: the four dives crossfade directly. Scene copy sits in one column pinned left at `clamp(18px, 5vw, 64px)`, vertically centred, `min(42vw, 460px)` wide, under a left-to-right ground gradient `min(58vw, 780px)` wide that carries the type over the picture. A route rail of four dots sits right at `clamp(14px, 2.4vw, 30px)`, vertically centred; the scroll hint sits bottom centre at 26px.

The body scrolls over the film's end on a solid ground layer (`z-index: 2`). Content sits in a 1180px container with 32px side gutters (16px under 640px). Sections are 72px tall top and bottom (56px under 860px) and end in a 1px hairline. Section heads are a baseline-aligned flex row: ember number, headline, a flexed hairline, optional mono aside (hidden under 860px). Pathways are a three-column grid with 14px gaps; the events teaser is two equal columns with 56px gap; the trade band is a wrapping flex row with 36px gap. Under 860px every grid collapses to one column and the nav links hide, leaving the wordmark and B2B button.

Spacing tokens follow an 8pt grid (8, 16, 24, 32, 64, 96) for gutters and vertical rhythm; component internals use tighter literal values (14, 18, 22, 26, 30px) that sit off-grid on purpose to keep card padding compact. Breakpoints: 860px (nav, grids, film mobile mode) and 640px (container gutter).

On phones the film's copy anchors to the bottom (`bottom: clamp(56px, 12dvh, 110px) + safe-area`), the gradient turns vertical (bottom 60%), rail labels hide, and route-dot hit areas grow to 28px without growing the dot.

## Elevation & Depth

There are no box shadows. Depth comes from tonal layering (ground beneath panel beneath a hairline), from the photographic film itself, and from the grain overlay that sits at z-index 9999 over everything and unifies UI and imagery into one exposure. The film's copy carries two soft text-shadows so it stays legible over bright scene areas; these are ground-coloured glows, not offsets.

### Shadow Vocabulary
- **Display glow** (`text-shadow: 0 2px 24px color-mix(in srgb, var(--sw-bg) 70%, transparent)`): under the film headline only.
- **Body glow** (`text-shadow: 0 1px 12px color-mix(in srgb, var(--sw-bg) 90%, transparent)`): under the film body only.
- **Active dot halo** (`box-shadow: 0 0 0 5px color-mix(in srgb, var(--sw-accent) 22%, transparent)`): the route rail's active dot. The only box-shadow in the build.

### Named Rules
**The No-Lift Rule.** Surfaces never lift. Hover changes a border colour or a fill, never adds a shadow, a translate or a scale. A card that rises on hover is outside the world.

**The One Exposure Rule.** The grain overlay stays fixed over the whole page at 50% opacity, overlay blend. Nothing renders above it; nothing is exempt from it.

## Shapes

Square corners everywhere: `border-radius: 0` on buttons, tags, cards, rail labels, inputs-to-come and image slots. Structure is drawn in 1px hairlines in Line (#3a312a): solid for chrome and cards, dashed for placeholder image slots, and a 1px Line gap between package rows (grid gap on a Line background, so the rows read as one ruled list). The only curved forms are the 9px circular route dots on the rail and the drawn scroll-hint mouse (22 by 34px, 12px radius, 2px stroke); both are wayfinding glyphs, not surfaces. The grain is the only texture; image slots carry a faint 135deg hatch until photography arrives.

## Components

Refined and restrained. Every control is a mono label in a square box; state is a colour change only.

### Buttons
- **Shape:** square (0 radius), JetBrains Mono 11px uppercase tracked 0.18em, 15px 26px padding.
- **Primary:** ember fill with ground label (`.btn--solid`, and the film's `.sw-btn--primary`, which pads 15px 24px). Hover: amber fill (page) or ember lightened 20% toward white (film). Transition 200 to 250ms on background, border and colour.
- **Outline / Ghost:** transparent with a 1px bronze border and amber label (`.btn--outline`). Hover: ember fill, ember border, ground label. The film's ghost (`.sw-btn--ghost`) uses cream text on a 25% cream hairline and hovers to an ember border and ember text.
- **Nav B2B:** the outline button at 9px 16px padding, 10px type; same hover.
- **Focus:** 1px amber outline, 3px offset, page-wide.

### Chips / Tags
- **Style:** JetBrains Mono 10px uppercase 0.18em in muted, 8px 12px padding, 1px hairline border, square. In the film the fill is 70% ground and the border 22% cream so the tag holds over the picture; on the page they inherit Line.
- **State:** informational only; no selected state exists.

### Cards / Containers
- **Pathway card:** panel fill, 1px Line border, 30px 26px padding, flex column with the mono CTA pushed to the bottom (`margin-top: auto`, 18px top padding). The whole card is the link. Hover: border to bronze in 250ms; nothing else moves.
- **Package list:** rows of ground on a Line background with 1px gaps and a 1px border, 18px 22px padding, Cormorant name (20px) against a mono level (10px, 0.14em) on one baseline.
- **Image slot:** dashed Line border, faint 135deg hatch, dim mono label centred, aspect ratio set per use (default 16:9). Placeholder grade; replaced by client photography.
- **Shadow strategy:** none (see Elevation & Depth).

### Navigation
- **Style:** fixed top, 68px tall, 1180px inner container, translucent ground at 82% with 8px backdrop blur and a hairline bottom. Once the hero leaves the viewport it turns solid ground (`.nav--solid`, 300ms background transition) so body headlines never pass under the wordmark.
- **Wordmark:** Cormorant 500, 22px, 0.26em uppercase, amber; hover to cream, no underline.
- **Links:** mono 10px 0.18em uppercase in muted, 24px 14px 22px padding, transparent 2px bottom border; hover to amber in 200ms. Hidden under 860px.
- **B2B button:** the outline button, always visible; the trade path is one click from every scroll position.

### Section Head (signature)
A baseline-aligned row: ember mono number (11px, 0.22em), Cormorant headline (34px, 400) with one italic ember word, a flexed 1px hairline that runs to the container edge, and an optional mono aside. It is how every body section is numbered and how the hairline language enters the content.

### Scroll Film (signature)
The hero. Four scenes (the leaf, the hand, the house, the light), each a still plus a scrubbed clip on a fixed stage. Per-scene copy fades in and out with scroll: counter (`01 / 04`), ember eyebrow, display headline, body, tags; the last scene adds the CTA pair. A route rail of four ember dots (9px, 40% ember at rest, full ember and 1.4x with a 22% halo when active, labels in a hairlined mono plate) marks position and jumps between scenes. A mono `SCROLL` hint with a drawn mouse fades out over the first half viewport. Theme is bound through `--sw-bg`, `--sw-ink`, `--sw-ink-soft`, `--sw-accent` and the three font variables on `.sw-root`. Reduced motion stops the hint wheel; the film still scrubs because it is scroll-positioned, not time-animated.

## Do's and Don'ts

### Do:
- **Do** keep ember (#d49152) to small emphasis: one italic word per headline, mono labels, a 9px dot, one button fill per viewport.
- **Do** set every headline in Cormorant Garamond at 300 or 400 with `letter-spacing: -0.02em` at display size and line-height at or under 1.05.
- **Do** set every label, tag, nav item and button in JetBrains Mono, 10 to 11px, uppercase, tracked 0.18 to 0.22em, weight 400.
- **Do** draw all structure with 1px hairlines in Line (#3a312a) and step surfaces only between ground (#0c0a08) and panel (#14110e).
- **Do** keep hover to a colour change within the ember family (bronze to ember, muted to amber) over 200 to 250ms.
- **Do** leave the grain overlay in place over every new surface.
- **Do** keep the body's 1180px container with 32px gutters (16px under 640px) and 72px section padding (56px under 860px).

### Don't:
- **Don't** add a second accent hue; oxblood (#8b2d20) is reserved for the health warning and a typographic ampersand.
- **Don't** round a corner on any surface or control; `border-radius: 0` is the rule, and the route dots and hint mouse are the only exceptions.
- **Don't** add box shadows, hover lifts, scale or bounce; the only transform in the world is the route dot's active state and the only shadows are the two text glows under film copy.
- **Don't** animate anything on time. Scroll drives the film; every other change is a fade of 300ms or less. No scroll-reveal on body sections.
- **Don't** set body or section copy above 16px or below 13.5px, or run a measure past 60ch.
- **Don't** use a bold weight, an all-caps headline, or the sans or mono for a headline.
- **Don't** ship the placeholder grade as final: lorem ipsum, dashed image slots and hatch fills are stand-ins for the client's copy and photography.
