(() => {
  const section = document.querySelector('[data-memories]');
  if (!section) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const reveals = [...section.querySelectorAll('[data-reveal]')];
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('is-pending');
    observer.unobserve(entry.target);
  }), { threshold: .08 });
  if (!reduced.matches) reveals.forEach((element, index) => {
    element.classList.add('is-pending');
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
    observer.observe(element);
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) { observer.disconnect(); reveals.forEach(el => el.classList.remove('is-pending')); }
  });

  const video = section.querySelector('video');
  const play = section.querySelector('.memories__play');
  const status = section.querySelector('.memories__video-status');
  video.controls = false;
  play.hidden = false;
  play.addEventListener('click', async () => {
    status.textContent = '';
    video.controls = true;
    play.hidden = true;
    try { await video.play(); } catch {
      play.hidden = false;
      status.textContent = 'Unable to play the film. Please try again.';
    }
  });
  video.addEventListener('play', () => { play.hidden = true; });
  video.addEventListener('pause', () => { play.hidden = false; });
  video.addEventListener('ended', () => { video.currentTime = 0; play.hidden = false; video.controls = false; });
  new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) video.pause(); }).observe(video);
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });

  const items = [...section.querySelectorAll('[data-memory]')];
  const dialog = section.querySelector('dialog');
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('figcaption');
  let selected = 0;
  let opener;
  let previousOverflow;
  const show = index => {
    selected = (index + items.length) % items.length;
    const original = items[selected].querySelector('img');
    image.src = original.src;
    image.alt = original.alt;
    caption.textContent = `${String(selected + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} / STEEZE AFTER STRESS`;
  };
  items.forEach((item, index) => item.addEventListener('click', () => {
    opener = item;
    show(index);
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    video.pause();
    dialog.showModal();
    dialog.querySelector('.memories__close').focus();
  }));
  dialog.querySelector('.memories__close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.memories__previous').addEventListener('click', () => show(selected - 1));
  dialog.querySelector('.memories__next').addEventListener('click', () => show(selected + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); show(selected + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(selected - 1); }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({ preventScroll: true });
  });
})();

