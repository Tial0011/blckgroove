/* ==========================================================================
   BLCKGROOVE — Mobile menu behaviour
   Opens/closes the full-screen menu, locks body scroll while open, closes
   on link click, Escape key, or resize past the mobile breakpoint.
   Called once the navbar component has been injected (navbar:ready).
   ========================================================================== */

function initMobileMenu() {
  const trigger = document.querySelector('[data-menu-trigger]');
  const closeBtn = document.querySelector('[data-menu-close]');
  const menu = document.querySelector('[data-mobile-menu]');
  const mobileLinks = document.querySelectorAll('[data-mobile-link]');

  if (!trigger || !menu) return;

  const MOBILE_BREAKPOINT = 960;

  const openMenu = () => {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    closeBtn?.focus();
  };

  const closeMenu = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    trigger.focus();
  };

  trigger.addEventListener('click', () => {
    const isOpen = menu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  closeBtn?.addEventListener('click', closeMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

window.addEventListener('navbar:ready', initMobileMenu);
