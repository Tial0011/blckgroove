/* Ease toward scroll progress; stop rendering once settled or offscreen. */
(() => {
  const section = document.querySelector('[data-brand-statement]');
  if (!section) return;
  const stage = section.querySelector('.brand-statement__stage');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let frame = null;
  let current = 0;
  let target = 0;
  let lastTime = 0;

  const paint = () => {
    const eased = current * current * (3 - 2 * current);
    section.style.setProperty('--brand-scale', (0.92 + eased * 0.08).toFixed(5));
    section.style.setProperty('--brand-x', `${-2 + eased * 2}vw`);
    section.style.setProperty('--brand-y', `${(1 - eased) * 16}px`);
  };
  const animate = (time) => {
    frame = null;
    if (!visible || reduced.matches) return;
    const delta = lastTime ? Math.min(time - lastTime, 64) : 16;
    lastTime = time;
    current += (target - current) * (1 - Math.exp(-delta / 110));
    if (Math.abs(target - current) < 0.0001) current = target;
    paint();
    if (current !== target) frame = requestAnimationFrame(animate);
    else lastTime = 0;
  };
  const schedule = () => {
    if (!visible || reduced.matches) return;
    const runway = Math.max(1, section.offsetHeight - stage.offsetHeight);
    const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
    target = Math.min(1, Math.max(0, (stickyTop - section.getBoundingClientRect().top) / runway));
    if (frame === null) frame = requestAnimationFrame(animate);
  };
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule();
    else {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastTime = 0;
    }
  }).observe(section);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastTime = 0;
    schedule();
  });
  paint();
})();
