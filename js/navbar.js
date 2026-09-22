/* ==========================================================================
   BLCKGROOVE — Navbar behaviour
   Loads components/navbar.html into the page, then wires up:
   - transparent → solid scroll transition
   - active link highlighting based on scroll position
   Exposes window.initNavbar(), called by main.js once the fetch resolves.
   ========================================================================== */

async function loadNavbar() {
  const root = document.getElementById('navbar-root');
  if (!root) return;

  try {
    const response = await fetch('components/navbar.html');
    if (!response.ok) throw new Error(`Navbar fetch failed: ${response.status}`);
    root.innerHTML = await response.text();
  } catch (error) {
    // Fetching a local file fails under file:// — serve the project with a
    // local dev server (e.g. `npx serve`, VS Code Live Server) or deploy it.
    console.error('Could not load navbar component.', error);
    return;
  }

  initScrollBehaviour();
  initActiveLinks();
  window.dispatchEvent(new CustomEvent('navbar:ready'));
}

function initScrollBehaviour() {
  const navbar = document.querySelector('[data-navbar]');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 24;
  let ticking = false;

  const applyState = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  };

  applyState();

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(applyState);
        ticking = true;
      }
    },
    { passive: true }
  );
}

function initActiveLinks() {
  const links = Array.from(document.querySelectorAll('[data-nav-link]'));
  if (!links.length) return;

  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === id);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}
