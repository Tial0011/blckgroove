(() => {
  const trigger = document.querySelector('[data-picnic-open]');
  if (!trigger) return;

  const photos = [
    'WhatsApp Image 2026-09-27 at 07.49.20.jpeg',
    'WhatsApp Image 2026-09-27 at 07.49.20 (1).jpeg',
    'WhatsApp Image 2026-09-27 at 07.49.20 (2).jpeg',
    'WhatsApp Image 2026-09-27 at 07.49.21.jpeg',
    'WhatsApp Image 2026-09-27 at 07.49.21 (1).jpeg',
    'WhatsApp Image 2026-09-27 at 07.49.19.jpeg',
    'WhatsApp Image 2026-09-27 at 07.49.19 (1).jpeg',
  ];
  const dialog = document.createElement('dialog');
  dialog.id = 'picnic-memories';
  dialog.className = 'picnic';
  dialog.setAttribute('aria-labelledby', 'picnic-title');
  dialog.innerHTML = `
    <header class="picnic__bar"><span>THE BLCKGROOVE ARCHIVE / 07</span><button type="button" class="picnic__close" aria-label="Close G4 Picnic memories" autofocus>CLOSE &times;</button></header>
    <div class="picnic__content">
      <p class="picnic__eyebrow">GARRI ULTIMATE HANGOUT</p>
      <h2 id="picnic-title">G4 PICNIC<span>. </span></h2>
      <p class="picnic__intro">Good company. Unforgettable moments.</p>
      <figure class="picnic__film">
        <div class="picnic__player">
          <video playsinline preload="none" poster="assets/images/g4-picnic-poster.jpg" aria-label="G4 Picnic highlights, 30 seconds"><source src="assets/videos/g4-picnic-30s.mp4" type="video/mp4"></video>
          <span class="picnic__film-tag">G4 / THE HIGHLIGHTS</span>
          <button type="button" class="picnic__big-play" aria-label="Play picnic highlights"><span aria-hidden="true">▶</span><small>RELIVE IT</small></button>
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
      <div class="picnic__wall">${photos.map((file, index) => `<figure class="picnic__photo"><button type="button" data-picnic-photo="${index}" aria-label="View G4 Picnic photo ${index + 1} in full"><img src="assets/images/${file}" alt="G4 Picnic memory ${index + 1}" loading="lazy" decoding="async"><span class="picnic__photo-hint">VIEW PHOTO ↗</span></button><figcaption>G4 PICNIC <span>${String(index + 1).padStart(2, '0')}</span></figcaption></figure>`).join('')}</div>
      <p class="picnic__ending">Same people. A thousand memories.</p>
    </div>`;
  document.body.append(dialog);
  const video = dialog.querySelector('video');
  const play = dialog.querySelector('[data-film-play]');
  const bigPlay = dialog.querySelector('.picnic__big-play');
  const progress = dialog.querySelector('.picnic__progress');
  const sound = dialog.querySelector('[data-film-sound]');
  const status = dialog.querySelector('.picnic__status');
  const time = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
  const sync = () => {
    const duration = Number.isFinite(video.duration) ? video.duration : 30;
    const playing = !video.paused && !video.ended;
    play.textContent = playing ? 'Ⅱ' : '▶';
    play.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    bigPlay.hidden = playing;
    progress.disabled = !Number.isFinite(video.duration);
    progress.max = duration;
    progress.value = video.currentTime;
    progress.style.setProperty('--played', `${duration ? video.currentTime / duration * 100 : 0}%`);
    dialog.querySelector('.picnic__time').textContent = `${time(video.currentTime)} / ${time(duration)}`;
  };
  const togglePlayback = async () => {
    if (!video.paused) { video.pause(); return; }
    status.textContent = '';
    if (video.ended) video.currentTime = 0;
    try { await video.play(); } catch { status.textContent = 'Could not play the film. Please try again.'; }
  };
  play.addEventListener('click', togglePlayback);
  bigPlay.addEventListener('click', togglePlayback);
  video.addEventListener('click', togglePlayback);
  ['play', 'pause', 'ended', 'loadedmetadata', 'timeupdate'].forEach(event => video.addEventListener(event, sync));
  video.addEventListener('error', () => { status.textContent = 'The film could not load. Please refresh and try again.'; });
  progress.addEventListener('input', () => { video.currentTime = Number(progress.value); sync(); });
  sound.addEventListener('click', () => { video.muted = !video.muted; });
  video.addEventListener('volumechange', () => {
    sound.textContent = video.muted ? 'SOUND OFF' : 'SOUND ON';
    sound.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
    sound.setAttribute('aria-pressed', String(video.muted));
  });

  const viewer = document.createElement('dialog');
  viewer.className = 'picnic-viewer';
  viewer.setAttribute('aria-label', 'G4 Picnic full photo');
  viewer.innerHTML = `<button type="button" class="picnic-viewer__close" aria-label="Close full photo" autofocus>CLOSE &times;</button><button type="button" class="picnic-viewer__previous" aria-label="Previous photo">←</button><figure><img alt=""><figcaption aria-live="polite"></figcaption></figure><button type="button" class="picnic-viewer__next" aria-label="Next photo">→</button>`;
  document.body.append(viewer);
  let selected = 0;
  let photoOpener;
  const showPhoto = index => {
    selected = (index + photos.length) % photos.length;
    viewer.querySelector('img').src = `assets/images/${photos[selected]}`;
    viewer.querySelector('img').alt = `G4 Picnic memory ${selected + 1}`;
    viewer.querySelector('figcaption').textContent = `G4 PICNIC / ${selected + 1} OF ${photos.length}`;
  };
  dialog.querySelectorAll('[data-picnic-photo]').forEach(button => button.addEventListener('click', () => {
    photoOpener = button;
    video.pause();
    showPhoto(Number(button.dataset.picnicPhoto));
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

