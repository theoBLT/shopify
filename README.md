# Kinder Trésor Shopify Theme

Custom Shopify Dawn theme (v15.3.0) for Kinder Trésor - a curated kids concept store in Berlin.

## Quick Start

### Prerequisites

- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli/install)
- Node.js and npm
- [Bun runtime](https://bun.sh) (for dev-browser visual testing)

### Development Setup

1. **Start the Shopify dev server:**
   ```bash
   shopify theme dev
   ```
   Access at: http://localhost:9292

2. **Run theme checks before committing:**
   ```bash
   shopify theme check
   ```

## Project Structure

```
./sections/          → Section templates
./snippets/          → Reusable components
./assets/            → CSS, JS, fonts, SVGs
./config/            → Theme settings
./locales/           → Translation files
./templates/         → Page templates
./layout/            → Layout files
```

## Working with Claude Code

This project includes [CLAUDE.md](./CLAUDE.md) - a comprehensive guide for Claude Code AI assistant with:
- Project architecture and patterns
- Brand guidelines (colors, typography, logo usage)
- Code quality standards
- Accessibility requirements
- Testing checklists

**Key commands:**
- Read CLAUDE.md first before making changes
- Follow the decision trees for section vs snippet, new vs existing files
- Always use brand colors and design guidelines

## Visual Testing with dev-browser

Claude Code can view and test the website using the dev-browser plugin.

### Setup (First Time)

1. **Install Bun runtime:**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Install dev-browser in Claude Code:**
   ```
   /plugin marketplace add sawyerhood/dev-browser
   /plugin install dev-browser@sawyerhood/dev-browser
   ```

3. **Restart Claude Code** to activate the plugin

### Using dev-browser

When Claude needs to verify visual changes:

1. Start Shopify dev server: `shopify theme dev`
2. Claude can now view, screenshot, and interact with the site
3. Screenshots are saved to the plugin's `tmp/` directory

**What Claude can do:**
- Take screenshots (desktop and mobile views)
- Test responsive breakpoints
- Verify brand color implementation
- Check accessibility (contrast, focus states)
- Test interactive elements (navigation, cart, etc.)

## Brand Guidelines

### Colors

Use these exact hex values:

**Primary Colors:**
- Turquoise: `#80cedc`
- Pink: `#eaa4c8`
- Green: `#77ae79`

**Secondary Colors:**
- Yellow: `#f5d748`
- Coral: `#ec6563`
- Orange: `#ef9050`
- Purple: `#767ab4`
- Cream: `#f1eecf`

### Typography

**Font:** National Park (custom)
- Regular (400) - Body copy
- Medium (500) - Subheadings
- Semibold (600) - Headlines, CTAs
- Bold (700) - Strong emphasis

### Logo & Kinbear

- Never rotate, distort, or add effects to the logo
- Kinbear character used sparingly for special moments
- Maintain playful yet sophisticated tone

## Development Guidelines

### Critical Rules

- ✋ Never use hardcoded colors - use CSS variables
- ✋ Never create fixed heights - use min-height
- ✋ Never edit files without reading them first
- ✋ Never skip defer attribute on script tags
- ✅ Always test mobile-first (< 750px)
- ✅ Always use brand color hex values
- ✅ Always run `shopify theme check` before committing

### Testing Checklist

**Before committing:**
- [ ] Tested on mobile (< 750px)
- [ ] Tested on tablet (750px - 990px)
- [ ] Tested on desktop (> 990px)
- [ ] No console errors
- [ ] All images have alt text
- [ ] Contrast ratio ≥ 4.5:1 for text
- [ ] Keyboard navigation works
- [ ] `shopify theme check` passes

## Resources

- [Shopify Theme Documentation](https://shopify.dev/docs/themes)
- [Dawn Theme Repository](https://github.com/Shopify/dawn)
- [dev-browser Plugin](https://github.com/SawyerHood/dev-browser)
- [CLAUDE.md](./CLAUDE.md) - Complete development guide

## Support

For detailed instructions on any aspect of development, consult [CLAUDE.md](./CLAUDE.md).

---

**Last Updated:** 2025-12-10
**Theme Version:** Dawn 15.3.0
