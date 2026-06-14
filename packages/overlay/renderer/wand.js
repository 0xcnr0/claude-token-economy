// Reward wand: a glowing tip that lerps toward the cursor, trickles passive
// sparkles, and on trigger emits a burst of gravity-affected fading stars.
// Plain browser global (no modules) — loaded via <script src>.
(function () {
  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  class Sparkle {
    constructor(x, y, burst) {
      this.x = x;
      this.y = y;
      const speed = burst ? rand(2, 8) : rand(0.3, 1.2);
      const ang = rand(0, Math.PI * 2);
      this.vx = Math.cos(ang) * speed;
      this.vy = Math.sin(ang) * speed - (burst ? rand(1, 3) : 0.5);
      this.life = 1;
      this.decay = burst ? rand(0.012, 0.03) : rand(0.02, 0.05);
      this.size = burst ? rand(2, 5) : rand(1, 2.5);
      this.hue = rand(45, 60); // gold
    }
    step() {
      this.vy += 0.12; // gravity
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.life -= this.decay;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = `hsl(${this.hue}, 100%, ${60 + this.life * 30}%)`;
      ctx.shadowColor = "gold";
      ctx.shadowBlur = 8;
      // little 4-point star
      const s = this.size;
      ctx.translate(this.x, this.y);
      ctx.beginPath();
      ctx.moveTo(0, -s * 2);
      ctx.lineTo(s * 0.5, 0);
      ctx.lineTo(s * 2, 0);
      ctx.lineTo(s * 0.5, s * 0.5);
      ctx.lineTo(0, s * 2);
      ctx.lineTo(-s * 0.5, s * 0.5);
      ctx.lineTo(-s * 2, 0);
      ctx.lineTo(-s * 0.5, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  class Wand {
    constructor() {
      this.tipX = 0;
      this.tipY = 0;
      this.sparkles = [];
      this.frame = 0;
    }
    burst(x, y) {
      for (let i = 0; i < 100; i++) this.sparkles.push(new Sparkle(x, y, true));
    }
    update(cursor) {
      this.frame++;
      // lerp the wand tip toward the cursor
      this.tipX += (cursor.x - this.tipX) * 0.25;
      this.tipY += (cursor.y - this.tipY) * 0.25;
      // passive trickle
      if (this.frame % 3 === 0) {
        this.sparkles.push(new Sparkle(this.tipX, this.tipY, false));
      }
      this.sparkles = this.sparkles.filter((s) => s.life > 0);
      for (const s of this.sparkles) s.step();
    }
    draw(ctx) {
      for (const s of this.sparkles) s.draw(ctx);
      // wand handle: a short golden stick trailing down-right from the tip
      ctx.save();
      ctx.strokeStyle = "rgba(120,80,20,0.9)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(this.tipX, this.tipY);
      ctx.lineTo(this.tipX + 26, this.tipY + 40);
      ctx.stroke();
      // glowing tip
      ctx.fillStyle = "white";
      ctx.shadowColor = "gold";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(this.tipX, this.tipY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  window.Wand = Wand;
})();
