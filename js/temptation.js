(() => {
  const elements = document.querySelectorAll('[data-temptation-reveal]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-unseen');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  elements.forEach(element => { element.classList.add('is-unseen'); observer.observe(element); });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    observer.disconnect();
    elements.forEach(element => element.classList.remove('is-unseen'));
  });
})();
