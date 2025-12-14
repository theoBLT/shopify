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

### Visual Testing with dev-browser

**dev-browser** is a browser automation plugin that lets Claude view and test the website during development.

**Prerequisites:**
- Bun runtime installed: `~/.bun/bin/bun --version`
- dev-browser plugin installed via Claude Code

**Starting the server:**
```bash
# Navigate to plugin directory
cd ~/.claude/plugins/cache/dev-browser-marketplace/dev-browser/*/skills/dev-browser

# Start server (first run downloads Chromium ~160MB)
./server.sh &

# Wait for "Ready" message
```

**Quick test script:**
```bash
cd ~/.claude/plugins/cache/dev-browser-marketplace/dev-browser/*/skills/dev-browser

# Take screenshot of homepage
bun x tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect("http://localhost:9222");
const page = await client.page("main");

await page.goto("http://localhost:9292");
await waitForPageLoad(page);
await page.screenshot({ path: "tmp/screenshot.png" });

console.log("Screenshot saved!");
await client.disconnect();
EOF

# View screenshot
open tmp/screenshot.png
```

**When Claude uses dev-browser:**
- Verify visual design and layout
- Test responsive design (mobile/tablet/desktop)
- Check brand color implementation
- Verify accessibility (contrast, focus states)
- Test interactive elements (navigation, cart, forms)
- Debug CSS/layout issues

**Key files:**
- Screenshots: `tmp/*.png`
- Scripts: `tmp/*.ts`
- Server: runs on port 9222

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

**Display Font: National Park (Headings)**
- Files: `./assets/NationalPark-*.woff2`
- Weights: Regular (400), Medium (500), Semibold (600), Bold (700)
- Usage: All headings, CTAs, emphasized UI text
- Variable: `--font-heading-family`

**Body Font: Nunito (Body Text)**
- Files: `./assets/Nunito-*.woff2`
- Weights: Regular (400), Semibold (600), Bold (700)
- Usage: Body copy, paragraphs, general text
- Variable: `--font-body-family`

**Weight Usage Guidelines:**
- **Regular (400):** Body copy, paragraph text
- **Semibold (600):** Headings, subheadings, emphasized text
- **Bold (700):** Strong emphasis, major headings

```css
/* Headings use National Park */
.heading {
  font-family: var(--font-heading-family);
  font-weight: 600; /* SemiBold for most headings */
}

/* Body text uses Nunito */
body, p {
  font-family: var(--font-body-family);
  font-weight: 400; /* Regular for body */
}
```

**Best Practices:**
- Always declare font-weight explicitly
- National Park for headings creates bold, confident brand presence
- Nunito for body provides excellent readability
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

**Utility Colors** (functional colors for backgrounds and text):
```css
--cream-light: #f7f5e8;            /* Light neutral backgrounds */
--charcoal: #2d3436;               /* Dark text and backgrounds */
--text-dark: #2d3436;              /* Primary dark text */
--text-light: #ffffff;             /* Primary light text */
--text-muted-dark: rgba(45, 52, 54, 0.7);    /* Muted dark text */
--text-muted-light: rgba(255, 255, 255, 0.7); /* Muted light text */
```

**Color Usage:**
- Primary colors should appear more frequently than secondary
- Secondary colors add visual interest but shouldn't dominate
- Utility colors provide accessible, functional alternatives
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

### 4. Button Treatment

**Pill-Shaped Design:**
All buttons use rounded pill styling for a modern, friendly aesthetic.

```css
/* Global button settings (configured in settings_data.json) */
buttons_radius: 50          /* Full pill shape */
buttons_border_thickness: 3 /* Strong, visible borders */
buttons_border_opacity: 100 /* Fully opaque borders */
```

**Button Transitions:**
Buttons have smooth hover and active states with subtle lift effect.

```css
.button {
  transition: box-shadow var(--duration-short) ease,
              background-color var(--duration-short) ease,
              color var(--duration-short) ease,
              transform 0.2s ease;
}

.button:hover {
  transform: translateY(-2px); /* Lift on hover */
}

.button:active {
  transform: translateY(0); /* Return to normal on click */
}
```

**Button Best Practices:**
- All CTAs use pill shape (50px border-radius)
- 3px borders provide visual weight and clarity
- Hover states include subtle upward movement
- Transitions create polished, premium feel
- Button colors inherit from section color schemes

**Button Variants:**
- **Primary:** Filled background, contrasting text
- **Secondary:** Outlined with transparent background
- **Tertiary:** Text-only with minimal styling

---

### 5. Accessibility Requirements

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

### Translation Guidelines

**CRITICAL: Always add German translations for custom content**

When adding ANY custom text to the theme (homepage sections, announcements, newsletter, etc.), you MUST:

1. **Add translation keys to both locale files:**
   - `/locales/en.default.json` - English original
   - `/locales/de.json` - German translation

2. **Use the t: prefix syntax in JSON config files:**
   ```json
   {
     "heading": "t:custom_content.section.key"
   }
   ```
   **IMPORTANT:** Use `t:` prefix (NOT Liquid syntax `{{ 'key' | t }}`)

3. **NEVER include HTML formatting tags in translation strings:**

   ❌ **WRONG:**
   ```json
   "heading": "<strong>Our Story</strong>"
   ```

   ✅ **CORRECT:**
   ```json
   "heading": "Our Story"
   ```

   **Why:** HTML tags in translation strings will display as literal text (`<strong>Our Story</strong>`) instead of being rendered.

   **Solution:** Add HTML formatting in the Liquid template, not in translation strings:
   ```liquid
   <h2><strong>{{ heading }}</strong></h2>
   ```

4. **Avoid `| escape` on translated labels (prevents `&#39;` showing up):**
   - Some translated strings can already contain HTML entities (e.g. `&#39;` for apostrophes).
   - If you apply `| escape` again in Liquid, it can double-encode to `&amp;#39;`, which renders visibly as `&#39;` on the page.

   ✅ **Correct (plain text button label):**
   ```liquid
   {{ button_label }}
   ```

   ❌ **Wrong (can double-encode entities):**
   ```liquid
   {{ button_label | escape }}
   ```

4. **How the translation system works:**
   - JSON config files store values with `t:` prefix: `"heading": "t:custom_content.hero.heading"`
   - Section Liquid files detect the `t:` prefix and apply translation filter:
     ```liquid
     {%- liquid
       assign heading = block.settings.heading
       if heading contains 't:'
         assign translation_key = heading | remove: 't:'
         assign heading = translation_key | t
       endif
     -%}
     ```
   - Translation filter fetches the value from `locales/en.default.json` or `locales/de.json` based on selected language

5. **Naming convention:**
   ```
   custom_content.{section_name}.{element}

   Examples:
   - custom_content.hero.heading
   - custom_content.newsletter.text
   - custom_content.what_we_curate.apparel.title
   ```

6. **Translation tone:**
   - Preserve playful-yet-sophisticated brand voice
   - Use gender-neutral language (e.g., "Erste*r" instead of "Erster/Erste")
   - Maintain warm, inviting, quality-focused tone
   - Keep Berlin-specific references intact

7. **Test before committing:**
   - Verify language selector works in header
   - Check both EN and DE versions render correctly
   - Ensure NO HTML tags appear as literal text in the browser

**Files to update when adding custom text:**
- `locales/en.default.json` (add English key - plain text only)
- `locales/de.json` (add German translation - plain text only)
- Template/section JSON file (use `t:key` syntax)
- Section Liquid file (add translation detection logic if not present, add HTML formatting)

**Never:**
- ❌ Hardcode text directly in JSON configs without translation keys
- ❌ Skip German translations for customer-facing content
- ❌ Use auto-translation tools - manually craft quality German copy
- ❌ Include HTML tags (`<strong>`, `<em>`, `<p>`, etc.) in translation strings
- ❌ Use Liquid syntax in JSON files (use `t:` prefix instead)

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

### CRITICAL: ALWAYS Verify Changes Work

**⚠️ MANDATORY AFTER EVERY CHANGE ⚠️**

Before committing or pushing ANY changes, you MUST:

1. **Check the live site loads without errors:**
   ```bash
   curl -I http://localhost:9292
   # Should return HTTP/1.1 200 OK
   # If you see HTML error page, there's a validation error
   ```

2. **Check dev server logs for errors:**
   ```bash
   # Look for recent errors in the dev server output
   tail -50 /tmp/claude/tasks/[dev-server-task-id].output | grep -i error
   ```

3. **If using dev-browser, take a screenshot:**
   ```bash
   # Verify the page actually renders
   cd ~/.claude/plugins/cache/dev-browser-marketplace/dev-browser/*/skills/dev-browser
   bun x tsx <<'EOF'
   import { connect } from "@/client.js";
   const client = await connect("http://localhost:9222");
   const page = await client.page("verify");
   await page.goto("http://localhost:9292", { timeout: 10000, waitUntil: 'domcontentloaded' });
   await page.waitForTimeout(2000);
   await page.screenshot({ path: "tmp/verify.png" });
   console.log("Screenshot saved - check for errors");
   await client.disconnect();
   EOF
   ```

4. **Common Shopify Validation Errors to Check:**
   - ❌ Section settings values outside min/max range
   - ❌ Section settings not in correct step increments
   - ❌ Section IDs in "order" array don't match section keys
   - ❌ Padding values > 100 (max is 100)
   - ❌ Invalid color_scheme references

**NEVER commit without verifying the site loads successfully first.**

---

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
