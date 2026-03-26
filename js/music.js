/**
 * music.js
 * Controls the background song: Palagi by TJ Monterde.
 * The audio element is defined in birthday.html (<audio id="bg-audio">).
 *
 * Public API:
 *   toggleMusic()     — play / pause (called by the music button)
 *   startBgMusic()    — called by entrance.js after the user clicks "Open"
 */

const bgAudio = document.getElementById('bg-audio');
bgAudio.volume = 0.7;

/** Start music — called right after the entrance button click (user gesture). */
function startBgMusic() {
  if (!bgAudio.src && !bgAudio.querySelector('source')) return;
  bgAudio.play().then(() => {
    const btn = document.getElementById('musicBtn');
    btn.textContent = '🎶';
    btn.classList.add('playing');
  }).catch(() => {
    // Autoplay blocked — user can still press the button manually
  });
}

/** Toggle play / pause. Called by the music button. */
function toggleMusic() {
  const btn = document.getElementById('musicBtn');
  if (bgAudio.paused) {
    bgAudio.play();
    btn.textContent = '🎶';
    btn.classList.add('playing');
  } else {
    bgAudio.pause();
    btn.textContent = '🎵';
    btn.classList.remove('playing');
  }
}
