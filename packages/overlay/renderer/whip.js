// Punishment whip: a verlet-integrated rope anchored at the cursor. On trigger
// it gets a sharp impulse down the chain for a crack flourish, plus the overlay
// flashes its edges red (handled in overlay.js).
(function () {
  class Whip {
    constructor(segments = 14, segLen = 26) {
      this.segLen = segLen;
      this.nodes = [];
      for (let i = 0; i < segments; i++) {
        this.nodes.push({ x: 0, y: 0, px: 0, py: 0 });
      }
      this.crackT = 0; // >0 while a crack impulse is active
    }
    crack() {
      this.crackT = 1;
      // kick the free end sideways for a snap
      const tail = this.nodes[this.nodes.length - 1];
      tail.px = tail.x + 60;
      tail.py = tail.y - 30;
    }
    update(cursor) {
      const anchor = this.nodes[0];
      anchor.x = cursor.x;
      anchor.y = cursor.y;

      // verlet integration with gravity
      for (let i = 1; i < this.nodes.length; i++) {
        const n = this.nodes[i];
        const vx = (n.x - n.px) * 0.96;
        const vy = (n.y - n.py) * 0.96;
        n.px = n.x;
        n.py = n.y;
        n.x += vx;
        n.y += vy + 1.4; // gravity
      }
      // constraint relaxation (keep segment lengths)
      for (let iter = 0; iter < 12; iter++) {
        this.nodes[0].x = cursor.x;
        this.nodes[0].y = cursor.y;
        for (let i = 0; i < this.nodes.length - 1; i++) {
          const a = this.nodes[i];
          const b = this.nodes[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const diff = (this.segLen - dist) / dist / 2;
          const ox = dx * diff;
          const oy = dy * diff;
          if (i !== 0) {
            a.x -= ox;
            a.y -= oy;
          }
          b.x += ox;
          b.y += oy;
        }
      }
      if (this.crackT > 0) this.crackT = Math.max(0, this.crackT - 0.06);
    }
    draw(ctx) {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      // taper the whip: thick at handle, thin at tip
      for (let i = 0; i < this.nodes.length - 1; i++) {
        const a = this.nodes[i];
        const b = this.nodes[i + 1];
        const t = i / this.nodes.length;
        ctx.lineWidth = 8 * (1 - t) + 1;
        const glow = this.crackT > 0 ? 200 * this.crackT : 0;
        ctx.strokeStyle = `rgb(${40 + glow}, ${20}, ${20})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  window.Whip = Whip;
})();
