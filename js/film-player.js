window.setupFilmPlayer = root => {
  const video = root.querySelector('video');
  const play = root.querySelector('[data-film-play]');
  const bigPlay = root.querySelector('.picnic__big-play');
  const progress = root.querySelector('.picnic__progress');
  const sound = root.querySelector('[data-film-sound]');
  const status = root.querySelector('.picnic__status');
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
    root.querySelector('.picnic__time').textContent = `${time(video.currentTime)} / ${time(duration)}`;
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

  video.addEventListener('play', () => {
    document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
  });
  sync();
};
