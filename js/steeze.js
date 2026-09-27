(() => {
  const trigger = document.querySelector('[data-steeze-open]');
  if (!trigger) return;

  const photos = [
    "WhatsApp Image 2026-09-22 at 16.36.47.jpeg",
    "WhatsApp Image 2026-09-22 at 16.36.49.jpeg",
    "WhatsApp Image 2026-09-22 at 16.36.44 (1).jpeg",
    "WhatsApp Image 2026-09-22 at 16.36.44.jpeg",
    "WhatsApp Image 2026-09-22 at 16.36.45.jpeg",
    "WhatsApp Image 2026-09-22 at 16.36.46 (1).jpeg",
    "WhatsApp Image 2026-09-22 at 16.36.46.jpeg",
    "WhatsApp Image 2026-09-22 at 16.36.47 (1).jpeg",
    "WhatsApp Image 2026-09-22 at 16.36.48 (1).jpeg",
    "WhatsApp Image 2026-09-22 at 16.36.48.jpeg",
    "WhatsApp Image 2026-09-22 at 16.36.49 (1).jpeg"
];
  const dialog = document.createElement('dialog');
  dialog.id = 'steeze-memories';
  dialog.className = 'picnic';
  dialog.setAttribute('aria-labelledby', 'steeze-title');
  dialog.innerHTML = `
    <header class="picnic__bar"><span>THE BLCKGROOVE ARCHIVE / 08</span><button type="button" class="picnic__close" aria-label="Close Steeze After Stress memories" autofocus>CLOSE &times;</button></header>
    <div class="picnic__content">
      <p class="picnic__eyebrow">JULY 2026 / ONDO CITY</p>
      <h2 id="steeze-title">STEEZE AFTER STRESS<span>. </span></h2>
      <p class="picnic__intro">Good company. Unforgettable moments.</p>
      <figure class="picnic__film">
        <div class="picnic__player">
          <video playsinline preload="none" poster="assets/images/steeze-poster.jpg" aria-label="Steeze After Stress highlights, 30 seconds"><source src="assets/videos/steeze-after-stress-30s.mp4" type="video/mp4"></video>
          <span class="picnic__film-tag">STEEZE / THE HIGHLIGHTS</span>
          <button type="button" class="picnic__big-play" aria-label="Play Steeze After Stress highlights"><span aria-hidden="true">▶</span><small>RELIVE IT</small></button>
          <div class="picnic__controls">
            <button type="button" data-film-play aria-label="Play video">▶</button>
            <span class="picnic__time">0:00 / 0:30</span>
            <input class="picnic__progress" type="range" min="0" max="30" step="0.1" value="0" aria-label="Video progress" disabled>
            <button type="button" data-film-sound aria-label="Mute video" aria-pressed="false">SOUND ON</button>
          </div>
        </div>
        <p class="picnic__status" role="status"></p>
        <figcaption><span>RELIVE THE MOMENT</span><span>00:30 / THE FILM</span></figcaption>
      </figure>
      <div class="picnic__heading"><h3>The memory wall<span>.</span></h3><span>${String(photos.length).padStart(2, '0')} MOMENTS TO KEEP</span></div>
      <div class="picnic__wall">${photos.map((file, index) => `<figure class="picnic__photo"><button type="button" data-steeze-photo="${index}" aria-label="View Steeze After Stress photo ${index + 1} in full"><img src="assets/images/${file}" alt="Steeze After Stress memory ${index + 1}" loading="lazy" decoding="async"><span class="picnic__photo-hint">VIEW PHOTO ↗</span></button><figcaption>STEEZE AFTER STRESS <span>${String(index + 1).padStart(2, '0')}</span></figcaption></figure>`).join('')}</div>
      <p class="picnic__ending">Same people. A thousand memories.</p>
    </div>`;
  document.body.append(dialog);
  const video = dialog.querySelector('video');
  window.setupFilmPlayer(dialog);

  const viewer = document.createElement('dialog');
  viewer.className = 'picnic-viewer';
  viewer.setAttribute('aria-label', 'Steeze After Stress full photo');
  viewer.innerHTML = `<button type="button" class="picnic-viewer__close" aria-label="Close full photo" autofocus>CLOSE &times;</button><button type="button" class="picnic-viewer__previous" aria-label="Previous photo">←</button><figure><img alt=""><figcaption aria-live="polite"></figcaption></figure><button type="button" class="picnic-viewer__next" aria-label="Next photo">→</button>`;
  document.body.append(viewer);
  let selected = 0;
  let photoOpener;
  const showPhoto = index => {
    selected = (index + photos.length) % photos.length;
    viewer.querySelector('img').src = `assets/images/${photos[selected]}`;
    viewer.querySelector('img').alt = `Steeze After Stress memory ${selected + 1}`;
    viewer.querySelector('figcaption').textContent = `STEEZE AFTER STRESS / ${selected + 1} OF ${photos.length}`;
  };
  dialog.querySelectorAll('[data-steeze-photo]').forEach(button => button.addEventListener('click', () => {
    photoOpener = button;
    video.pause();
    showPhoto(Number(button.dataset.steezePhoto));
    viewer.showModal();
  }));
  viewer.querySelector('.picnic-viewer__close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.picnic-viewer__previous').addEventListener('click', () => showPhoto(selected - 1));
  viewer.querySelector('.picnic-viewer__next').addEventListener('click', () => showPhoto(selected + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(selected + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => photoOpener?.focus({ preventScroll: true }));
  let previousOverflow;
  trigger.addEventListener('click', () => {
    previousOverflow = document.body.style.overflow;
    document.querySelectorAll('video').forEach(film => film.pause());
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.scrollTop = 0;
    video.preload = 'metadata';
  });
  dialog.querySelector('.picnic__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    video.pause();
    document.body.style.overflow = previousOverflow;
    trigger.focus({ preventScroll: true });
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
})();

