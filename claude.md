# Claude.md - Shopify Theme Project Guide

## Project Overview

This is a customized **Shopify Dawn theme (v15.3.0)** for Kinder Tresor. Dawn is Shopify's official reference theme, featuring modern web standards, performance optimization, and accessibility best practices.

**Key Technologies:**
- Liquid templating engine
- Vanilla JavaScript (ES6+ Web Components)
- CSS with extensive use of CSS custom properties
- National Park custom font family

---

## BEFORE YOU START - Critical Information

### Working Directory Check
```bash
# Always ensure you're in the project root (where this claude.md file lives)
pwd

# Verify you're in the Shopify theme directory by checking for key files
ls -la | grep -E "(sections|assets|config|layout)"

# Should see directories: sections, snippets, assets, config, locales, templates, layout
```

### Critical Constraints (READ FIRST)
- ✋ **NEVER** use hardcoded colors - use CSS variables or brand colors
- ✋ **NEVER** create fixed heights - use min-height or let content define height
- ✋ **NEVER** edit files without reading them first
- ✋ **NEVER** skip the defer attribute on script tags
- ✋ **NEVER** forget alt text on images
- ✋ **NEVER** distort, rotate, or add effects to the logo
- ✅ **ALWAYS** test mobile-first (< 750px breakpoint)
- ✅ **ALWAYS** use paths relative to project root
- ✅ **ALWAYS** check for existing components before creating new ones
- ✅ **ALWAYS** use exact brand color hex values for consistency
- ✅ **ALWAYS** run `shopify theme check` before committing

### Project Structure (All paths relative to project root)
```
./sections/          → Section templates
./snippets/          → Reusable components
./assets/            → CSS, JS, fonts, SVGs
./config/            → Theme settings
./locales/           → Translation files
./templates/         → Page templates
./layout/            → Layout files
```

### Key Files You'll Edit Often
- `./locales/en.default.json` - English translations
- `./config/settings_schema.json` - Theme-wide settings
- `./config/settings_data.json` - Current theme config
- `./assets/base.css` - Core styles
- `./layout/theme.liquid` - Main layout wrapper

---

## Quick Reference

### Common Commands
```bash
# Start development server (ALWAYS run this when working)
shopify theme dev

# Check theme for errors (run before committing)
shopify theme check

# List all sections
ls ./sections/

# List all component CSS files
ls ./assets/component-*.css

# Search for a component or feature
grep -r "search-term" ./sections/
grep -r "search-term" ./snippets/
```

### Key CSS Variables
```css
/* Dawn Colors */
--color-base-text
--color-base-background-1
--color-base-accent-1
--gradient-base-background-1

/* Brand Colors */
--color-brand-turquoise: #80cedc
--color-brand-pink: #eaa4c8
--color-brand-green: #77ae79
--color-brand-yellow: #f5d748
--color-brand-coral: #ec6563
--color-brand-orange: #ef9050
--color-brand-purple: #767ab4
--color-brand-cream: #f1eecf

/* Typography */
--font-body-family
--font-heading-family

/* Spacing */
--spacing-sections-desktop
--spacing-sections-mobile
--page-width
```

### Key Liquid Objects
```liquid
{{ section.settings }}     → Section settings from schema
{{ block.settings }}       → Block settings from schema
{{ product }}              → Current product
{{ cart }}                 → Cart object
{{ settings }}             → Theme-level settings
```

---

## Decision Trees

### DECISION: Section vs Snippet?

**Create a SECTION if:**
- ✅ Needs theme editor (drag & drop)
- ✅ Requires merchant settings/schema
- ✅ Standalone page element
- ✅ Example: `featured-collection.liquid`

**Create a SNIPPET if:**
- ✅ No merchant settings needed
- ✅ Called via `{% render %}`
- ✅ UI component (icon, badge)
- ✅ Example: `icon-star.liquid`

**File location:**
```bash
# Sections
./sections/feature-name.liquid

# Snippets
./snippets/component-name.liquid
```

---

### DECISION: Create New CSS File vs Edit Existing?

**BEFORE creating new CSS:**

```bash
# Search for related components
ls ./assets/ | grep "component-"
```

**Edit EXISTING if:**
- ✅ Adding variant to existing component
- ✅ Tightly coupled to existing component

**Create NEW if:**
- ✅ Completely distinct functionality
- ✅ Reusable across contexts

**Naming:** `component-[feature].css`

**Link in template:**
```liquid
{{ 'component-name.css' | asset_url | stylesheet_tag }}
```

---

### DECISION: Where to Add Styles?

```
Used by ALL pages?
├─ YES → ./assets/base.css
│
└─ NO → Reusable UI pattern?
        ├─ YES → ./assets/component-*.css
        │
        └─ NO → Section-specific?
                ├─ YES → ./assets/section-*.css
                │
                └─ NO → ./assets/template-*.css
```

---

## Design Guidelines

### 1. Typography

**Font:** National Park (Custom)
- Files: `./assets/NationalPark-*.woff`
- Weights: Regular (400), Medium (500), Semibold (600), Bold (700)
- Fallback: `assistant_n4` → system fonts

**Weight Usage Guidelines:**
- **Regular (400):** Body copy, general text
- **Medium (500):** Subheadings, emphasized text
- **Semibold (600):** Headlines, CTAs, important UI elements
- **Bold (700):** Strong emphasis, major headings

```css
.heading {
  font-family: var(--font-heading-family);
  font-weight: 600; /* Always declare explicitly */
}
```

**Best Practices:**
- Always declare font-weight explicitly when using National Park
- Limit to these 4 weights for consistency
- Maintain heading hierarchy (h1 → h6)
- Body text minimum 16px base

---

### 2. Color System

**ALWAYS use CSS variables:**
```css
/* ✅ CORRECT */
.element {
  color: var(--color-base-text);
  background: var(--color-base-background-1);
}

/* ❌ WRONG */
.element {
  color: #000000;
}
```

**Kinder Tresor Brand Colors:**

In addition to Dawn's configurable color schemes, use these brand-specific colors:

**Primary Colors** (use for dominant areas, logos, major CTAs):
```css
--color-brand-turquoise: #80cedc;  /* Headers, accent backgrounds */
--color-brand-pink: #eaa4c8;       /* Primary CTAs, highlights */
--color-brand-green: #77ae79;      /* Section backgrounds, accents */
```

**Secondary Colors** (use sparingly for highlights and variety):
```css
--color-brand-yellow: #f5d748;     /* Special highlights */
--color-brand-coral: #ec6563;      /* Alert/attention states */
--color-brand-orange: #ef9050;     /* Warm accents */
--color-brand-purple: #767ab4;     /* Cool accents */
--color-brand-cream: #f1eecf;      /* Soft backgrounds */
```

**Color Usage:**
- Primary colors should appear more frequently than secondary
- Secondary colors add visual interest but shouldn't dominate
- Always use exact hex values for brand consistency
- These supplement Dawn's `--color-base-*` system

**Accessibility:** Min contrast 4.5:1 for text, 3:1 for UI
**Test:** https://webaim.org/resources/contrastchecker/

---

### 3. Spacing & Layout

**Breakpoints:**
```css
/* Mobile < 750px */
.element { }

/* Tablet 750px+ */
@media screen and (min-width: 750px) {
  .element { }
}

/* Desktop 990px+ */
@media screen and (min-width: 990px) {
  .element { }
}
```

**NEVER use fixed heights:**
```css
/* ❌ WRONG */
.element { height: 400px; }

/* ✅ CORRECT */
.element { min-height: 400px; }
```

---

### 4. Accessibility Requirements

**Checklist before committing:**
- [ ] Contrast ≥ 4.5:1 for text
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels on icon buttons
- [ ] Alt text on images
- [ ] Heading hierarchy (h1→h2→h3)

**Testing:**
```bash
# Keyboard: Tab through page
# Screen reader: Cmd+F5 (VoiceOver on Mac)
# Contrast: https://webaim.org/resources/contrastchecker/
# Lighthouse: DevTools → Lighthouse → Accessibility
```

---

### 5. Brand Identity Elements

**Logo Usage:**

The Kinder Tresor logo combines a house and treasure chest shape representing warmth and discovery.

**Available Variations:**
- Primary logo: Full house shape with "KINDER" (top/green) and "TRESOR" (bottom/pink)
- Secondary logo: Compact version for limited space
- Logomark: House symbol only
- Black/white versions for different backgrounds

**Critical Rules:**
- Never add CSS transforms that rotate/skew the logo
- Never add drop shadows, gradients, or outline effects
- Maintain minimum clearance (padding equal to logo height × 0.15)
- Never stretch or distort aspect ratio
- Use appropriate logo variation for the space available

**Logo Files:** `./assets/logo-*.png` or `./assets/logo-*.svg`

---

**Kinbear Character:**

A friendly bear mascot inspired by the Berlin Bear, representing warmth, family, and childhood.

**When to Use:**
- Empty states or loading screens
- Decorative elements in hero sections
- Special announcements or events
- About/story sections

**When NOT to Use:**
- Don't overuse—should feel special when it appears
- Avoid in critical UI flows (checkout, cart)
- Not for product photography backgrounds

**Assets:** `./assets/kinbear-*.svg` or `./snippets/icon-kinbear.liquid`

**Available Variations:**
- Solid color versions (can use any brand color)
- Patterned versions (dots, stripes, checkerboard)
- Can sit on top of logo for special occasions

---

**Design Tone & Principles:**

**Target Audience:** Design-savvy parents who value quality, creativity, and mindful consumption

**Visual Balance:** Playful yet sophisticated
- Clean, timeless aesthetic (avoid overly trendy treatments)
- Thoughtful use of color and space
- Design-conscious but approachable
- Warm and inviting, not corporate

**When Making Design Decisions:**
- Favor quality and clarity over decoration
- Use whitespace generously
- Let products and content breathe
- Maintain sophistication while being family-friendly
- Storytelling should feel authentic, not marketing-heavy

---

## Development Guidelines

### Before Editing ANY File

```bash
# 1. Read first
cat ./[path-to-file]

# 2. Search for similar
grep -r "similar-feature" ./sections/
grep -r "similar-feature" ./snippets/
```

---

### Liquid Templating

**Defensive coding:**
```liquid
{%- liquid
  # Check existence
  if product.featured_image
    assign image = product.featured_image
  else
    assign image = blank
  endif

  # Use defaults
  assign heading = section.settings.heading | default: 'Default'
-%}
```

**Translations:**
```liquid
<!-- ALWAYS use translation filters -->
<h2>{{ 'sections.featured.title' | t }}</h2>

<!-- Add new keys to ./locales/en.default.json -->
```

---

### JavaScript Web Components

**Complete lifecycle:**
```javascript
class CustomElement extends HTMLElement {
  constructor() {
    super(); // ONE-TIME setup
    this.handlers = [];
  }

  connectedCallback() {
    // ADD event listeners here
    this.button = this.querySelector('button');
    this.onClick = this.onClick.bind(this);
    this.button.addEventListener('click', this.onClick);
  }

  disconnectedCallback() {
    // REMOVE listeners (prevent leaks)
    this.button.removeEventListener('click', this.onClick);
  }

  onClick(event) {
    // Handle interaction
  }
}

customElements.define('custom-element', CustomElement);
```

**Pub/Sub complete example:**
```javascript
// Define event
window.PUB_SUB_EVENTS = window.PUB_SUB_EVENTS || {};
window.PUB_SUB_EVENTS.cartUpdate = 'cart-update';

// Subscribe
class CartCount extends HTMLElement {
  connectedCallback() {
    this.unsubscribe = subscribe(
      PUB_SUB_EVENTS.cartUpdate,
      (event) => this.updateCount(event.cart.item_count)
    );
  }

  disconnectedCallback() {
    this.unsubscribe();
  }

  updateCount(count) {
    this.textContent = count;
  }
}

// Publish
async function addToCart(formData) {
  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    });
    const cart = await response.json();

    publish(PUB_SUB_EVENTS.cartUpdate, { cart });
  } catch (error) {
    console.error('Add to cart failed:', error);
  }
}

customElements.define('cart-count', CartCount);
```

**File:** `./assets/component-name.js`

**Link:**
```liquid
<script src="{{ 'component-name.js' | asset_url }}" defer="defer"></script>
```

---

### Section Schema

**Complete example:**
```liquid
{% comment %} sections/custom-feature.liquid {% endcomment %}

<div class="custom-feature color-{{ section.settings.color_scheme }}">
  <h2>{{ section.settings.heading }}</h2>
</div>

{% schema %}
{
  "name": "Custom Feature",
  "tag": "section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Featured Content"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Color scheme",
      "default": "scheme-1"
    }
  ],
  "blocks": [
    {
      "type": "item",
      "name": "Item",
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Image"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Custom Feature",
      "blocks": [
        { "type": "item" },
        { "type": "item" }
      ]
    }
  ]
}
{% endschema %}
```

**Validation:**
- [ ] `name` exists (theme editor)
- [ ] `presets` exists (allow adding)
- [ ] All settings have `id`, `type`, `label`, `default`

---

## Data Flow & State Management

### Cart Flow
```
User clicks "Add to cart"
  ↓
product-form.js submits
  ↓
POST /cart/add.js
  ↓
Shopify returns cart JSON
  ↓
publish(cartUpdate, { cart })
  ↓
Subscribers update:
  - cart-drawer
  - cart-count badge
  - cart-notification
```

### Critical Rules

**DO NOT:**
- ❌ Store cart in localStorage (use Shopify API)
- ❌ Duplicate state (use pub/sub)
- ❌ Mutate cart directly (fetch from API)

**ALWAYS:**
- ✅ Fetch from `/cart.js`
- ✅ Publish state changes
- ✅ Handle errors

---

## Testing Guidelines

### Feature-Specific Checklists

**When Modifying Product Pages:**
```bash
shopify theme dev
```
- [ ] Variant selection updates price
  → Select size/color → verify price changes
- [ ] Variant selection updates image
  → Select variant → verify gallery switches
- [ ] Out of stock shows "Sold Out"
  → Select unavailable → verify button disabled
- [ ] Add to cart disabled when no variant selected
- [ ] Quick add modal works

**When Modifying Cart:**
- [ ] Quantity update recalculates totals
  → Change quantity → verify price × quantity
- [ ] Remove item updates count badge
- [ ] Empty cart shows empty state
- [ ] Cart persists across navigation
- [ ] Discount codes apply

**When Modifying Navigation:**
- [ ] Mega menu opens/closes
- [ ] Mobile menu works (< 750px)
- [ ] Search modal functions
- [ ] Cart drawer opens from all icons

---

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest) - often has CSS/JS differences
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)
- [ ] Responsive: 375px, 750px, 1200px
- [ ] Console errors (DevTools)
- [ ] Network tab (no 404s)
- [ ] Slow 3G simulation

---

### Accessibility Testing

**Keyboard:**
```bash
# Press Tab through entire page
# Verify all interactive elements get focus
# Verify focus indicators visible
# Verify logical tab order
# Verify no keyboard traps
```

**Screen Reader (Mac):**
```bash
# Cmd+F5 to enable VoiceOver
# VO+Right Arrow to navigate
# Verify all content announced
# Verify button purposes clear
# Cmd+F5 to disable
```

**Contrast:**
```bash
# Inspect element for colors
# Visit: https://webaim.org/resources/contrastchecker/
# Verify ≥ 4.5:1 for text
# Verify ≥ 3:1 for UI
```

**Lighthouse:**
```bash
# DevTools → Lighthouse
# Select "Accessibility"
# Click "Analyze page load"
# Target score ≥ 90
```

---

## Troubleshooting

### Issue: CSS Changes Not Reflecting

**DIAGNOSE:**
```bash
# 1. Check file exists
ls ./assets/component-name.css

# 2. Check where linked
grep -r "component-name.css" ./sections/*.liquid
grep -r "component-name.css" ./layout/*.liquid

# 3. Check browser network tab (DevTools)
# Look for 404 or 200 status

# 4. Verify CLI running
# Should see output in terminal
```

**SOLUTIONS:**
- Hard reload: Cmd+Shift+R
- Verify file linked in template
- Check CSS syntax (unclosed brackets)
- Restart CLI: `shopify theme dev`

---

### Issue: JavaScript Not Working

**DIAGNOSE:**
```bash
# 1. Console errors (DevTools → Console)

# 2. Check element defined
# In browser console:
customElements.get('custom-element')

# 3. Check script loads (Network tab)

# 4. Verify defer attribute
grep -r "your-script.js" ./layout/*.liquid
grep -r "your-script.js" ./sections/*.liquid
```

**SOLUTIONS:**
- Fix syntax errors from console
- Verify `customElements.define()` called
- Ensure `defer="defer"` attribute
- Check element name matches HTML

---

### Issue: Section Not in Theme Editor

**DIAGNOSE:**
```bash
# 1. Check schema exists
cat ./sections/your-section.liquid

# 2. Validate JSON
# Copy schema, paste: https://jsonlint.com/
```

**SOLUTIONS:**
- Verify `presets` array exists
- Ensure `name` field exists
- Fix JSON syntax errors
- Refresh editor (Cmd+R)

---

### If Issue Persists

**ESCALATION:**
```bash
# 1. Document error exactly (screenshot)
# 2. Document reproduction steps
# 3. Check: https://www.shopifystatus.com/
# 4. Search: https://community.shopify.com/
# 5. Report to user with diagnostic summary
```

---

## Dawn Theme Updates

**Current:** Dawn 15.3.0
**Last Updated:** 2025-12-10

### Before Updating

```bash
# 1. Document custom files
find . -name "*ai_gen_block*"

# 2. Review changelog
# https://github.com/Shopify/dawn/releases

# 3. Test on development theme
shopify theme push --development
```

### Update Strategy

**Custom files (safe):**
- `./blocks/ai_gen_block_*.liquid`
- Any new sections/snippets you create

**Modified Dawn files (document here):**
- *List any Dawn files you modify*

**Best practices:**
- ✅ Create new files vs modifying Dawn
- ✅ Override styles in new CSS files
- ⚠️ If modifying, add comment: `{% comment %}CUSTOM: [why]{% endcomment %}`

---

## Agent Instructions

### Pre-flight Checklist (EVERY task)

```bash
# 1. Verify working directory (should be project root with sections/, assets/, etc.)
pwd
ls -la | grep -E "(sections|assets|config)"

# 2. Verify CLI running
# If not: shopify theme dev

# 3. Understand task
# If unclear: Ask user
```

---

### When Adding Features

**REQUIRED PROCESS:**

```bash
# STEP 1: Search existing
grep -r "feature-keyword" ./sections/
ls ./assets/component-*.css | grep "related"

# STEP 2: Read if found
cat ./[found-file]

# STEP 3: Decide (use decision trees)
# Section vs snippet?
# New CSS vs edit existing?

# STEP 4: Create with proper naming
# ./sections/feature-name.liquid
# ./assets/component-name.css

# STEP 5: Link assets
{{ 'component-name.css' | asset_url | stylesheet_tag }}
<script src="{{ 'name.js' | asset_url }}" defer="defer"></script>

# STEP 6: Add translations
# Edit: ./locales/en.default.json

# STEP 7: Apply brand guidelines
# - Use brand colors (--color-brand-*) for brand elements
# - Use National Park font (4 weights only)
# - Follow playful-yet-sophisticated tone
# - Ensure logo/Kinbear usage is appropriate

# STEP 8: Test (use feature checklist)

# STEP 9: Theme check
shopify theme check
```

---

### Code Quality Standards

**Before marking complete:**
- [ ] Files read before editing
- [ ] Follows existing patterns
- [ ] CSS uses variables (Dawn or brand colors)
- [ ] Brand colors use exact hex values
- [ ] Typography uses National Park (4 weights only)
- [ ] Logo/Kinbear usage follows brand guidelines
- [ ] Design tone is playful yet sophisticated
- [ ] JS has error handling
- [ ] Images have alt text
- [ ] UI text uses translations
- [ ] Accessibility met
- [ ] Tested mobile (< 750px)
- [ ] No console errors
- [ ] `shopify theme check` passes
- [ ] Feature checklist complete

---

## Iteration & Improvement Notes

### Known Issues & Workarounds
*(Add as discovered)*

---

### Custom Patterns
*(Add project-specific patterns)*

---

### Agent Performance
*(Track what works/doesn't)*

---

### Testing Additions
*(Add edge cases)*

---

**Last Updated:** 2025-12-10
**Theme Version:** Dawn 15.3.0
**Note:** All file paths in this guide are relative to the project root (where this claude.md file lives)
