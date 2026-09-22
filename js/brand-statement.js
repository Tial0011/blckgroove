/* Scroll position drives one sticky brand composition; no continuous render loop. */
(() => {
  const section = document.querySelector('[data-brand-statement]');
  if (!section) return;
  const stage = section.querySelector('.brand-statement__stage');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px)');
  let visible = false;
  let frame = null;
  const update = () => {
    frame = null;
    if (reduced.matches) return;
    const runway = section.offsetHeight - stage.offsetHeight;
    const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / Math.max(1, runway)));
    const eased = progress * progress * (3 - 2 * progress);
    section.style.setProperty('--brand-scale', (0.92 + eased * 0.08).toFixed(4));
    section.style.setProperty('--brand-x', `${(mobile.matches ? -24 : -15) + eased * (mobile.matches ? 12 : 11)}vw`);
    section.style.setProperty('--brand-y', `${(1 - eased) * 28}px`);
    section.style.setProperty('--brand-crop', `${(1 - eased) * 28}%`);
  };
  const schedule = () => {
    if (frame === null && visible) frame = requestAnimationFrame(update);
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
  });
  observer.observe(section);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', schedule);
  update();
})();
