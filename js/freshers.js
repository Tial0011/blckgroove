(() => {
  const trigger = document.querySelector('[data-freshers-open]');
  if (!trigger) return;
  const photos = [
    'WhatsApp Image 2026-09-27 at 22.39.54.jpeg',
    'WhatsApp Image 2026-09-27 at 22.39.54 (1).jpeg',
    'WhatsApp Image 2026-09-27 at 22.39.55.jpeg',
    'WhatsApp Image 2026-09-27 at 22.39.55 (1).jpeg',
    'WhatsApp Image 2026-09-27 at 22.39.56.jpeg',
    'WhatsApp Image 2026-09-27 at 22.39.57.jpeg',
    'WhatsApp Image 2026-09-27 at 22.39.58.jpeg',
    'WhatsApp Image 2026-09-27 at 22.39.58 (1).jpeg',
  ];
  const dialog = document.createElement('dialog');
  dialog.id = 'freshers-memories';
  dialog.className = 'picnic';
  dialog.setAttribute('aria-labelledby', 'freshers-title');
  dialog.innerHTML = `
    <header class="picnic__bar"><span>THE BLCKGROOVE ARCHIVE / FRESHERS</span><button type="button" class="picnic__close" aria-label="Close Freshers Party memories" autofocus>CLOSE &times;</button></header>
    <div class="picnic__content">
      <p class="picnic__eyebrow">FRESH FACES. UNFORGETTABLE NIGHTS.</p>
      <h2 id="freshers-title">FRESHERS PARTY<span>.</span></h2>
      <p class="picnic__intro">The start of something worth remembering.</p>
      <div class="picnic__heading"><h3>The memory wall<span>.</span></h3><span>${String(photos.length).padStart(2, '0')} MOMENTS TO KEEP</span></div>
      <div class="picnic__wall">${photos.map((file, index) => `<figure class="picnic__photo"><button type="button" data-freshers-photo="${index}" aria-label="View Freshers Party photo ${index + 1} in full"><img src="assets/images/${file}" alt="Freshers Party memory ${index + 1}" loading="lazy" decoding="async"><span class="picnic__photo-hint">VIEW PHOTO &nearr;</span></button><figcaption>FRESHERS PARTY <span>${String(index + 1).padStart(2, '0')}</span></figcaption></figure>`).join('')}</div>
      <p class="picnic__ending">New faces. Lasting memories.</p>
    </div>`;
  const viewer = document.createElement('dialog');
  viewer.className = 'picnic-viewer';
  viewer.setAttribute('aria-label', 'Freshers Party full photo');
  viewer.innerHTML = `<button type="button" class="picnic-viewer__close" aria-label="Close full photo" autofocus>CLOSE &times;</button><button type="button" class="picnic-viewer__previous" aria-label="Previous photo">&larr;</button><figure><img alt=""><figcaption aria-live="polite"></figcaption></figure><button type="button" class="picnic-viewer__next" aria-label="Next photo">&rarr;</button>`;
  document.body.append(dialog, viewer);
  let selected = 0;
  let photoOpener;
  let previousOverflow;
  const showPhoto = index => {
    selected = (index + photos.length) % photos.length;
    viewer.querySelector('img').src = `assets/images/${photos[selected]}`;
    viewer.querySelector('img').alt = `Freshers Party memory ${selected + 1}`;
    viewer.querySelector('figcaption').textContent = `FRESHERS PARTY / ${selected + 1} OF ${photos.length}`;
  };
  dialog.querySelectorAll('[data-freshers-photo]').forEach(button => button.addEventListener('click', () => {
    photoOpener = button;
    showPhoto(Number(button.dataset.freshersPhoto));
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
  trigger.addEventListener('click', () => {
    previousOverflow = document.body.style.overflow;
    document.querySelectorAll('video').forEach(video => video.pause());
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.scrollTop = 0;
  });
  dialog.querySelector('.picnic__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    trigger.focus({ preventScroll: true });
  });
})();
