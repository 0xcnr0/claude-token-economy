// Desktop pet renderer: a little animal you pet with the mouse.
// Quick click = treat (+1). Press-and-drag = move the window. Right-click = scold.
// State (animal, treats, rank, mood) comes from the main process.

const petWrap = document.getElementById("petWrap");
const petEl = document.getElementById("pet");
const moodEl = document.getElementById("mood");
const treatsEl = document.getElementById("treats");
const rankEl = document.getElementById("rank");
const redflash = document.getElementById("redflash");

let state = { emoji: "🐶", treat: "🦴", balance: 0, rank: "Good Pup", tone: "neutral" };

function render() {
  petEl.textContent = state.emoji;
  treatsEl.textContent = `${state.balance > 0 ? "+" : ""}${state.balance} ${state.treat}`;
  rankEl.textContent = state.rank;
  petWrap.classList.toggle("show-mood", state.tone === "celebratory" || state.tone === "proud");
  moodEl.textContent = "✨";
}

if (window.cte && window.cte.onPetState) {
  window.cte.onPetState((s) => {
    state = { ...state, ...s };
    render();
  });
}
render();

// --- particles (hearts on treat, sweat on scold) ---
function spawnParticles(chars, count) {
  const rect = petWrap.getBoundingClientRect();
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.textContent = chars[Math.floor(Math.random() * chars.length)];
    p.style.left = `${rect.left + rect.width / 2 - 9}px`;
    p.style.top = `${rect.top + rect.height / 2 - 9}px`;
    document.body.appendChild(p);
    const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
    const dist = 26 + Math.random() * 34;
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist - 10;
    p.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(1.3)`, opacity: 0 },
      ],
      { duration: 600 + Math.random() * 400, easing: "cubic-bezier(.2,.7,.3,1)" },
    ).onfinish = () => p.remove();
  }
}

function reactHappy() {
  petWrap.classList.remove("happy");
  void petWrap.offsetWidth;
  petWrap.classList.add("happy");
  spawnParticles(["❤️", "✨", "💛"], 6);
}
function reactSad() {
  petWrap.classList.remove("sad");
  void petWrap.offsetWidth;
  petWrap.classList.add("sad");
  spawnParticles(["💢", "💧"], 4);
  redflash.classList.add("on");
  setTimeout(() => redflash.classList.remove("on"), 220);
}

// --- treat / scold ---
let lastPat = 0;
function pat() {
  const now = Date.now();
  if (now - lastPat < 300) return;
  lastPat = now;
  reactHappy();
  window.cte?.petPat?.();
}
function scold() {
  reactSad();
  window.cte?.petScold?.();
}

// Right-click = scold (suppress native menu).
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  scold();
});

// --- press-and-drag to move, quick click to pat ---
// Dragging works from anywhere in the window (including the pet). A real drag
// suppresses the click so you don't accidentally treat while repositioning.
let down = false, startX = 0, startY = 0, moved = false, suppressClick = false;

document.addEventListener("mousedown", (e) => {
  if (e.button !== 0) return; // left button only
  down = true;
  moved = false;
  startX = e.screenX;
  startY = e.screenY;
  window.cte?.petDragStart?.();
});
document.addEventListener("mousemove", (e) => {
  if (!down) return;
  const dx = e.screenX - startX;
  const dy = e.screenY - startY;
  if (!moved && Math.hypot(dx, dy) > 4) {
    moved = true;
    document.body.style.cursor = "grabbing";
  }
  if (moved) window.cte?.petDragMove?.(dx, dy);
});
document.addEventListener("mouseup", () => {
  if (!down) return;
  down = false;
  document.body.style.cursor = "";
  if (moved) {
    suppressClick = true;
    setTimeout(() => (suppressClick = false), 60);
  }
});

// Quick click on the pet = a pat (unless it was actually a drag).
petWrap.addEventListener("click", () => {
  if (suppressClick) return;
  pat();
});

// Main process can also trigger reactions (e.g. global hotkeys).
if (window.cte && window.cte.onPetReact) {
  window.cte.onPetReact((kind) => (kind === "reward" ? reactHappy() : reactSad()));
}
