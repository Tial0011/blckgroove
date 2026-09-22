(() => {
  const copy = document.querySelector('[data-copy-account]');
  if (copy && navigator.clipboard?.writeText) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      const status = document.querySelector('.temptation__copy-status');
      try {
        await navigator.clipboard.writeText('7060577255');
        status.textContent = 'Account number copied.';
      } catch {
        status.textContent = 'Select the account number to copy it manually.';
      }
    });
  }
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
