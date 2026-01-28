const pompom = document.getElementById("pompom");
const bounceSound = document.getElementById("bounce-sound");
const growBtn = document.getElementById("grow-btn");

/* =====================
   POSICIÓN
===================== */
let x = window.innerWidth / 2;
let y = 100;
let vx = 0;
let vy = 0;

/* =====================
   TAMAÑO
===================== */
let scale = 1;
const maxScale = 2.5;

/* =====================
   ROTACIÓN
===================== */
let angle = 0;
let angularV = 0;
const angularFriction = 0.98;

/* =====================
   FÍSICA
===================== */
const gravity = 0.8;
const bounce = 0.7;
const friction = 0.99;

/* =====================
   DRAG
===================== */
let dragging = false;
let offsetX = 0;
let offsetY = 0;

/* =====================
   SONIDO
===================== */
function playBounce(force) {
  bounceSound.currentTime = 0;
  bounceSound.volume = Math.min(0.2 + force * 0.03, 1);
  bounceSound.playbackRate = Math.min(0.8 + force * 0.05, 1.6);
  bounceSound.play();
}

/* =====================
   BOTÓN GORDO
===================== */
growBtn.addEventListener("click", () => {
  scale += 0.2;
  if (scale > maxScale) scale = 1;
});

/* =====================
   ANTI DRAG FANTASMA
===================== */
pompom.addEventListener("dragstart", e => e.preventDefault());

pompom.addEventListener("mousedown", (e) => {
  dragging = true;
  pompom.style.cursor = "grabbing";
  offsetX = e.clientX - x;
  offsetY = e.clientY - y;
  vx = vy = angularV = 0;
});

document.addEventListener("mouseup", () => {
  dragging = false;
  pompom.style.cursor = "grab";
});

document.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  const newX = e.clientX - offsetX;
  const newY = e.clientY - offsetY;
  vx = newX - x;
  vy = newY - y;
  angularV = vx * 0.5;
  x = newX;
  y = newY;
});

/* =====================
   LOOP
===================== */
function update() {
  if (!dragging) {
    vy += gravity;
    x += vx;
    y += vy;

    vx *= friction;
    angularV *= angularFriction;
    angle += angularV;

    const w = pompom.offsetWidth;
    const h = pompom.offsetHeight;

    const floor = window.innerHeight - h;
    const wallR = window.innerWidth - w;

    if (y > floor) {
      y = floor;
      vy *= -bounce;
      playBounce(Math.abs(vy));
    }
    if (x < 0 || x > wallR) {
      vx *= -bounce;
      angularV *= -1;
      playBounce(Math.abs(vx));
    }
  }

  pompom.style.left = x + "px";
  pompom.style.top = y + "px";

  /* 🔑 CLAVE: rotación + tamaño juntos */
  pompom.style.transform = `rotate(${angle}deg) scale(${scale})`;

  requestAnimationFrame(update);
}

update();
