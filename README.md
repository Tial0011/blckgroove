# BLCKGROOVE Entertainment — Website

## Phase 1: Project structure + navbar only

### What's built
- Project structure (vanilla HTML/CSS/JS, organized like a component-based app)
- Design tokens (`css/variables.css`)
- Global base styles (`css/global.css`)
- Desktop navbar: transparent over the hero, transitions to a dark blurred
  bar on scroll
- Mobile navbar: brand-styled full-screen menu, not a generic dropdown
- Active-link highlighting as you scroll past each section
- Scroll lock while the mobile menu is open

### Not built yet (future phases)
Hero content, About, Temptation, Experience, Gallery, and Tickets sections
are all empty placeholders for now — just enough height to scroll past and
see the navbar transition working.

### Running it locally
The navbar markup is loaded via `fetch('components/navbar.html')`, which
browsers block over the bare `file://` protocol. Serve the folder with any
static server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open the printed local URL.

### Structure

```
index.html
assets/
  images/   → general site imagery (empty for now)
  logo/     → blckgroove-logo.jpeg
  icons/    → UI icons (empty for now)
  videos/   → future hero/background video (empty for now)
css/
  variables.css   → color, type, spacing, motion tokens
  global.css      → resets + base styles
  navbar.css      → navbar layout + scroll transition
  responsive.css  → breakpoints + full-screen mobile menu
js/
  main.js         → boots the app
  navbar.js       → loads the navbar component, scroll state, active links
  mobile-menu.js  → mobile menu open/close, focus, scroll lock
components/
  navbar.html     → navbar + mobile menu markup (single source of truth)
```

### Brand notes for future phases
- **BLCKGROOVE** is the primary identity — logo always leads.
- **TEMPTATION** is a current event under the BLCKGROOVE brand, not the
  main identity — the flyer was used only as a mood reference (reds,
  chrome accents, nightlife crowd energy), not a literal template.
- Chrome/silver (`--chrome-1/2/3`, `--gradient-chrome`) is reserved for
  event-specific flourishes later — kept out of the base navbar so the
  brand doesn't read as "everything red and chrome."
