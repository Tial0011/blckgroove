/* Bounded background drift; text stays still and readable. */
(() => {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const background = hero.querySelector('.hero__media img');
  if (background) {
    const reveal = () => {
      background.classList.remove('is-loading');
      background.classList.add('is-ready');
    };
    background.classList.add('is-loading');
    background.addEventListener('load', reveal, { once: true });
    background.addEventListener('error', () => background.classList.remove('is-loading'), { once: true });
    if (background.complete) reveal();
  }
  let frame = null;

  const update = () => {
    const distance = Math.max(0, -hero.getBoundingClientRect().top);
    hero.style.setProperty('--hero-drift', reducedMotion.matches ? '0px' : `${Math.min(distance * 0.12, 70)}px`);
    frame = null;
  };
  const schedule = () => {
    if (frame === null) frame = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  reducedMotion.addEventListener('change', schedule);
  update();

  hero.querySelectorAll('[data-hero-scroll]').forEach((link) => link.addEventListener('click', (event) => {
    const target = document.querySelector('#about');
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    history.replaceState(null, '', '#about');
  }));
})();
