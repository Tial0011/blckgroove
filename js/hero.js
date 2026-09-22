/* Bounded background drift; text stays still and readable. */
(() => {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
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

  hero.querySelector('[data-hero-scroll]').addEventListener('click', (event) => {
    const target = document.querySelector('#about');
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    history.replaceState(null, '', '#about');
  });
})();
