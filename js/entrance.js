/**
 * entrance.js
 * Handles the entrance overlay: floating particles, the "Open Your Surprise"
 * button interaction, and the animated exit transition into the main page.
 *
 * Depends on: spawnHeartAt() defined in effects.js (loaded after this file,
 * but only called on user click — by then all scripts are guaranteed loaded).
 */

// Prevent the browser from restoring a previous scroll position on reload
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ── Floating particles inside the entrance overlay ─────────────────── */
(function initEntranceParticles() {
  const layer  = document.getElementById('e-particle-layer');
  const GLYPHS = ['✦', '✧', '⋆', '🌸', '💜', '✨', '⭐', '🌟', '💫'];
  const COLORS = ['#fde68a', '#e9d5ff', '#c084fc', '#f9a8d4', '#ffffff'];

  function createParticle() {
    const el = document.createElement('span');
    el.className = 'e-pt';
    el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    el.style.left      = (Math.random() * 98) + '%';
    el.style.bottom    = '-20px';
    el.style.color     = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.fontSize  = (Math.random() * 14 + 8) + 'px';

    const duration = Math.random() * 6 + 7;
    el.style.animationDuration = duration + 's';
    el.style.animationDelay   = (Math.random() * 5) + 's';

    layer.appendChild(el);
    setTimeout(() => el.remove(), (duration + 5) * 1000);
  }

  for (let i = 0; i < 30; i++) createParticle();
  setInterval(createParticle, 700);
}());


/* ── Enter button handler ────────────────────────────────────────────── */
function enterSite() {
  const entrance = document.getElementById('entrance');
  const btn      = document.getElementById('enterBtn');

  // Start music immediately on click (this IS the user gesture — autoplay allowed)
  if (typeof startBgMusic === 'function') startBgMusic();

  btn.textContent = '✨ Opening… ✨';
  btn.style.pointerEvents = 'none';

  // Burst of hearts from the centre of the screen
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const x = window.innerWidth  / 2 + (Math.random() - 0.5) * 300;
      const y = window.innerHeight / 2 + (Math.random() - 0.5) * 200;
      spawnHeartAt(x, y);   // defined in effects.js
    }, i * 60);
  }

  // Fade + scale the overlay out, then remove it
  setTimeout(() => {
    entrance.classList.add('exit');
    setTimeout(() => {
      entrance.style.display = 'none';
      document.body.classList.remove('entrance-active');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 1150);
  }, 500);
}
