// Orchestrates the canvas overlay: tracks the cursor, runs the active tool
// (wand or whip) in a rAF loop, and reacts to main-process events.
(function () {
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");

  let dpr = window.devicePixelRatio || 1;
  function resize() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  const cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  // mousemove events are forwarded through the click-through window.
  window.addEventListener("mousemove", (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
  });

  const wand = new window.Wand();
  const whip = new window.Whip();

  let mode = "wand";
  let enabled = true;
  let redFlash = 0; // 0..1, decays; punishment screen-edge flash

  if (window.cte) {
    window.cte.onMode((m) => (mode = m));
    window.cte.onEnabled((on) => (enabled = on));
    window.cte.onTrigger((kind) => {
      if (kind === "reward") {
        wand.burst(cursor.x, cursor.y);
      } else {
        whip.crack();
        redFlash = 1;
      }
      if (window.cte.animationDone) window.cte.animationDone();
    });
  }

  function drawRedFlash() {
    if (redFlash <= 0) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.7);
    grad.addColorStop(0, "rgba(255,0,0,0)");
    grad.addColorStop(1, `rgba(180,0,0,${0.5 * redFlash})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    redFlash = Math.max(0, redFlash - 0.03);
  }

  function loop() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (enabled) {
      if (mode === "wand") {
        wand.update(cursor);
        wand.draw(ctx);
      } else {
        whip.update(cursor);
        whip.draw(ctx);
        drawRedFlash();
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
})();
