/**
 * effects.js
 * All ambient visual effects:
 *  - Confetti (page-load burst + post-wish burst)
 *  - Balloons (hero section)
 *  - Sparkles (hero section)
 *  - Scroll-reveal (IntersectionObserver)
 *  - Floating hearts (hero click + cake interaction)
 */


/* ═══════════════════════════════════════════════════════════════════════
   CONFETTI — page-load rain (auto-stops after 9 s)
   ═══════════════════════════════════════════════════════════════════════ */
(function initConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');
  const COLORS = ['#7c3aed', '#c084fc', '#e9d5ff', '#f59e0b', '#fde68a', '#ec4899', '#ffffff', '#a5f3fc'];

  let W, H, active = true;
  const particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor(prePosition) { this.reset(prePosition); }

    reset(prePosition) {
      this.x    = Math.random() * W;
      this.y    = prePosition ? Math.random() * H - H : -16;
      this.w    = Math.random() * 10 + 5;
      this.h    = Math.random() * 5  + 3;
      this.col  = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.vy   = Math.random() * 2.5 + 1;
      this.vx   = (Math.random() - 0.5) * 1.8;
      this.rot  = Math.random() * Math.PI * 2;
      this.rotV = (Math.random() - 0.5) * 0.12;
      this.op   = Math.random() * 0.55 + 0.4;
      this.type = Math.random() > 0.45 ? 'rect' : 'circle';
    }

    step() {
      this.y   += this.vy;
      this.x   += this.vx;
      this.rot += this.rotV;
      if (this.y > H + 20) this.reset(false);
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.op;
      ctx.fillStyle   = this.col;
      if (this.type === 'rect') {
        ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle(true));

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    if (active) particles.forEach(p => { p.step(); p.draw(); });
    requestAnimationFrame(loop);
  }());

  setTimeout(() => { active = false; }, 9000);
}());


/* ═══════════════════════════════════════════════════════════════════════
   CONFETTI BURST — triggered when all candles are blown out
   (secondary overlay canvas so it doesn't interfere with the main one)
   ═══════════════════════════════════════════════════════════════════════ */
(function initConfettiBurst() {
  const burstCanvas = document.createElement('canvas');
  burstCanvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1000';
  document.body.appendChild(burstCanvas);

  const bCtx    = burstCanvas.getContext('2d');
  const BCOLORS = ['#7c3aed', '#c084fc', '#fde68a', '#ec4899', '#fff', '#f59e0b'];
  const bParticles = [];

  function resize() {
    burstCanvas.width  = window.innerWidth;
    burstCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function makeParticle() {
    return {
      x:    Math.random() * burstCanvas.width,
      y:    Math.random() * burstCanvas.height * 0.5,
      w:    Math.random() * 12 + 5,
      h:    Math.random() * 6  + 3,
      col:  BCOLORS[Math.floor(Math.random() * BCOLORS.length)],
      vy:   Math.random() * 4 + 2,
      vx:   (Math.random() - 0.5) * 3,
      rot:  Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.15,
      op:   0.9,
    };
  }
  for (let i = 0; i < 60; i++) bParticles.push(makeParticle());

  (function loop() {
    bCtx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);
    if (window._confettiBurst) {
      bParticles.forEach(p => {
        p.y += p.vy; p.x += p.vx; p.rot += p.rotV;
        if (p.y > burstCanvas.height + 20) {
          Object.assign(p, makeParticle());
          p.y = -10;
        }
        bCtx.save();
        bCtx.translate(p.x, p.y);
        bCtx.rotate(p.rot);
        bCtx.globalAlpha = p.op;
        bCtx.fillStyle   = p.col;
        bCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        bCtx.restore();
      });
    }
    requestAnimationFrame(loop);
  }());

  // Listen for the custom event dispatched by cake.js
  window.addEventListener('restartConfetti', () => {
    window._confettiBurst = true;
    setTimeout(() => { window._confettiBurst = false; }, 5000);
  });
}());


/* ═══════════════════════════════════════════════════════════════════════
   BALLOONS — float upward in the hero section
   ═══════════════════════════════════════════════════════════════════════ */
(function initBalloons() {
  const layer  = document.getElementById('balloonLayer');
  const COLORS = ['#7c3aed', '#c084fc', '#e9d5ff', '#ec4899', '#f59e0b', '#a5f3fc'];

  function createBalloon() {
    const el       = document.createElement('div');
    el.className   = 'balloon';
    const color    = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size     = Math.random() * 44 + 38;
    const duration = Math.random() * 10 + 13;
    const delay    = Math.random() * 4;

    el.style.left              = (Math.random() * 100) + '%';
    el.style.animationDuration = duration + 's';
    el.style.animationDelay    = delay + 's';

    el.innerHTML = `
      <svg width="${size}" height="${size * 1.35}" viewBox="0 0 60 82" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30" cy="30" rx="28" ry="30" fill="${color}" opacity=".88"/>
        <ellipse cx="21" cy="18" rx="9"  ry="6"  fill="#fff" opacity=".22"/>
        <path d="M30 60 L27 72 L33 72 Z" fill="${color}" opacity=".65"/>
        <path d="M30 60 Q23 66 18 70 Q24 63 30 60 Q36 57 42 63 Q36 67 30 60"
              fill="none" stroke="${color}" stroke-width="1.5" opacity=".65"/>
      </svg>`;

    layer.appendChild(el);
    setTimeout(() => el.remove(), (duration + delay) * 1000);
  }

  for (let i = 0; i < 10; i++) createBalloon();
  setInterval(createBalloon, 2800);
}());


/* ═══════════════════════════════════════════════════════════════════════
   SPARKLES — twinkling glyphs across the hero section
   ═══════════════════════════════════════════════════════════════════════ */
(function initSparkles() {
  const layer  = document.getElementById('sparkleLayer');
  const GLYPHS = ['✦', '✧', '⋆', '✺', '✸'];
  const COLORS = ['#fde68a', '#e9d5ff', '#c084fc', '#f9a8d4', '#a5f3fc'];

  function createSparkle() {
    const el       = document.createElement('span');
    el.className   = 'sp';
    el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

    el.style.left      = (Math.random() * 96 + 2) + '%';
    el.style.top       = (Math.random() * 94 + 2) + '%';
    el.style.color     = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.fontSize  = (Math.random() * 14 + 8) + 'px';

    const duration = Math.random() * 2 + 1.5;
    el.style.animationDuration = duration + 's';
    el.style.animationDelay   = (Math.random() * 2) + 's';

    layer.appendChild(el);
    setTimeout(() => el.remove(), (duration + 2.2) * 1000);
  }

  for (let i = 0; i < 22; i++) createSparkle();
  setInterval(createSparkle, 550);
}());


/* ═══════════════════════════════════════════════════════════════════════
   SCROLL REVEAL — fade/slide sections into view using IntersectionObserver
   ═══════════════════════════════════════════════════════════════════════ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}());


/* ═══════════════════════════════════════════════════════════════════════
   FLOATING HEARTS — spawn on hero click and from the cake
   ═══════════════════════════════════════════════════════════════════════ */

/** Spawn a single floating emoji at an absolute viewport coordinate. */
function spawnHeartAt(x, y) {
  const EMOJIS = ['💜', '✨', '💫', '🌟', '⭐', '🌸'];
  const el = document.createElement('div');
  el.className   = 'fheart';
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  el.style.left  = x + 'px';
  el.style.top   = y + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3600);
}

/** Convenience: spawn a heart near the centre of the cake. */
function spawnHeart() {
  const cakeWrap = document.getElementById('cakeWrap');
  const rect     = cakeWrap.getBoundingClientRect();
  spawnHeartAt(
    rect.left + rect.width  / 2 + (Math.random() - 0.5) * 80,
    rect.top  + rect.height / 2
  );
}

// Clicking anywhere in the hero section spawns hearts at the cursor
document.getElementById('hero').addEventListener('click', e => {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => spawnHeartAt(e.clientX, e.clientY), i * 80);
  }
});
