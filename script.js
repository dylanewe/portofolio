/* ═══════════════════════════════════════════════
   DONUT MODULE
   Andy Sloane's donut.c algorithm, ported to JS.
   Renders a spinning ASCII torus as a fixed background.
═══════════════════════════════════════════════ */
(function () {
  'use strict';

  const donutEl = document.getElementById('donut');
  const LUMINANCE = '.,-~:;=!*#$@';
  const TARGET_FPS = 16;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;

  let A = 0; // rotation angle around X axis
  let B = 0; // rotation angle around Z axis
  let W, H;  // grid dimensions in characters
  let rafId;
  let lastTime = 0;

  // Measure actual rendered character size so the grid fills the viewport
  // correctly on any screen size or font size (mobile, tablet, desktop).
  function measureChar() {
    var probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;line-height:1;font-family:inherit;font-size:inherit;';
    probe.textContent = 'X';
    donutEl.appendChild(probe);
    var w = probe.offsetWidth  || 8;
    var h = probe.offsetHeight || 14;
    donutEl.removeChild(probe);
    return { w: Math.max(w, 1), h: Math.max(h, 1) };
  }

  function computeDimensions() {
    var ch = measureChar();
    W = Math.max(20, Math.floor(window.innerWidth  / ch.w));
    H = Math.max(10, Math.floor(window.innerHeight / ch.h));
  }

  function renderDonut() {
    const output = new Array(W * H).fill(' ');
    const zbuf   = new Float32Array(W * H); // initialized to 0

    const R1 = 1;
    const R2 = 2;
    const K2 = 5;
    // K1 chosen so the donut fills roughly 60% of the viewport height
    const K1 = H * K2 * 5 / (8 * (R1 + R2));

    const cosA = Math.cos(A), sinA = Math.sin(A);
    const cosB = Math.cos(B), sinB = Math.sin(B);

    for (let theta = 0; theta < 6.2832; theta += 0.07) {
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);

      for (let phi = 0; phi < 6.2832; phi += 0.02) {
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        // 3D coordinates of this point on the torus surface
        const circleX = R2 + R1 * cosTheta;
        const circleY = R1 * sinTheta;

        // Apply rotation A (around X) and B (around Z)
        const x = circleX * (cosB * cosPhi + sinA * sinB * sinPhi) - circleY * cosA * sinB;
        const y = circleX * (sinB * cosPhi - sinA * cosB * sinPhi) + circleY * cosA * cosB;
        const z = K2 + cosA * circleX * sinPhi + circleY * sinA;

        const ooz = 1 / z; // one over z — perspective divide

        // Project to 2D screen coordinates
        // 0.55 corrects for the non-square aspect ratio of monospace characters
        const xp = Math.floor(W / 2 + K1 * ooz * x);
        const yp = Math.floor(H / 2 - K1 * ooz * y * 0.55);

        if (xp < 0 || xp >= W || yp < 0 || yp >= H) continue;

        // Luminance: dot product of surface normal with light direction (0,1,-1)
        const L =
          cosPhi * cosTheta * sinB
          - cosA  * cosTheta * sinPhi
          - sinA  * sinTheta
          + cosB  * (cosA * sinTheta - cosTheta * sinA * sinPhi);

        const idx = xp + yp * W;
        if (L > 0 && ooz > zbuf[idx]) {
          zbuf[idx] = ooz;
          // Map luminance 0..1 to character index 0..11
          output[idx] = LUMINANCE[Math.min(Math.floor(L * 8), LUMINANCE.length - 1)];
        }
      }
    }

    // Build complete string in one pass and assign once — faster than DOM manipulation
    const rows = new Array(H);
    for (let row = 0; row < H; row++) {
      rows[row] = output.slice(row * W, row * W + W).join('');
    }
    donutEl.textContent = rows.join('\n');

    A += 0.04;
    B += 0.02;
  }

  function loop(timestamp) {
    rafId = requestAnimationFrame(loop);
    if (timestamp - lastTime < FRAME_INTERVAL) return;
    lastTime = timestamp;
    renderDonut();
  }

  // Pause animation when tab is not visible (saves CPU/battery)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      lastTime = 0;
      rafId = requestAnimationFrame(loop);
    }
  });

  // Recompute grid size on resize (debounced)
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      computeDimensions();
    }, 300);
  });

  // Init
  computeDimensions();
  rafId = requestAnimationFrame(loop);

}());


/* ═══════════════════════════════════════════════
   SCROLL MODULE
   Fade sections in as they enter the viewport.
═══════════════════════════════════════════════ */
(function () {
  'use strict';

  // Hero is already in the viewport on load — make it visible immediately
  var hero = document.getElementById('hero');
  if (hero) {
    // Small delay so the transition fires visibly rather than being skipped
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        hero.classList.add('visible');
      });
    });
  }

  // All other sections and the footer fade in on scroll
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after first trigger — no need to watch once visible
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('section:not(#hero), footer').forEach(function (el) {
    observer.observe(el);
  });

}());
