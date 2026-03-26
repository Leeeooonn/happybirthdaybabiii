/**
 * cake.js
 * Interactive birthday cake: blow out candles one by one.
 * Each click extinguishes the next lit flame, shows a smoke puff,
 * and spawns floating hearts. When all candles are out a confetti
 * burst is triggered and the wish message is revealed.
 *
 * Depends on: spawnHeart() and window.dispatchEvent('restartConfetti')
 *             — both provided by effects.js.
 */

const litState = [true, true, true];
let   allBlown = false;

function blowNextCandle() {
  if (allBlown) return;

  const idx = litState.indexOf(true);
  if (idx === -1) return;

  litState[idx] = false;
  const candleNum = idx + 1;

  // Hide the flame
  document.getElementById('fl' + candleNum).classList.add('out');

  // Restart the smoke-puff animation (force reflow to replay)
  const smoke = document.getElementById('sm' + candleNum);
  smoke.classList.remove('puffing');
  void smoke.offsetWidth;
  smoke.classList.add('puffing');

  // Spawn a small burst of hearts near the cake
  for (let i = 0; i < 6; i++) {
    setTimeout(() => spawnHeart(), i * 110);   // spawnHeart defined in effects.js
  }

  // All candles blown — celebrate!
  if (litState.every(v => !v)) {
    allBlown = true;
    document.getElementById('wishMsg').classList.add('show');

    window.dispatchEvent(new CustomEvent('restartConfetti'));

    for (let i = 0; i < 28; i++) {
      setTimeout(() => spawnHeart(), i * 120);
    }
  }
}
