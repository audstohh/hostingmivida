const pompom = document.getElementById("pompom");
const bounceSound = document.getElementById("bounce-sound");
const sizeBtn = document.getElementById("size-btn");

/* =====================
   ESTADO POSICIÓN
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
   SONIDO (PITCH)
===================== */
function playBounce(force) {
  bounceSound.currentTime = 0;
  bounceSound.volume = Math.min(0.2 + force * 0.03, 1);
  bounceSound.playbackRate = Math.min(0.8 + force * 0.05, 1.6);
  bounceSound.play();
}

/* =====================
   BOTÓN TAMAÑO
===================== */
sizeBtn.addEventListener("click", () => {
  scale += 0.2;
  if (scale > maxScale) scale = 1;

  pompom.style.transform =
    `scale(${scale}) rotate(${angle}deg)`;
});

/* =====================
   ANTI DRAG FANTASMA
===================== */
pompom.addEventListener("dragstart", e => e.preventDefault());

/* =====================
   AGARRAR
===================== */
pompom.addEventListener("mousedown", (e) => {
  dragging = true;
  pompom.style.cursor = "grabbing";

  offsetX = e.clientX - x;
  offsetY = e.clientY - y;

  vx = 0;
  vy = 0;
  angularV = 0;
});

/* =====================
   SOLTAR
===================== */
document.addEventListener("mouseup", () => {
  dragging = false;
  pompom.style.cursor = "grab";
});

/* =====================
   MOVER
===================== */
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
   LOOP PRINCIPAL
===================== */
function update() {
  if (!dragging) {
    vy += gravity;

    x += vx;
    y += vy;

    vx *= friction;
    angularV *= angularFriction;
    angle += angularV;

    const w = pompom.offsetWidth * scale;
    const h = pompom.offsetHeight * scale;

    const floor = window.innerHeight - h;
    const ceiling = 0;
    const wallL = 0;
    const wallR = window.innerWidth - w;

    if (y > floor) {
      y = floor;
      vy *= -bounce;
      angularV += vx * 0.6;
      playBounce(Math.abs(vy));
    }

    if (y < ceiling) {
      y = ceiling;
      vy *= -bounce;
      playBounce(Math.abs(vy));
    }

    if (x < wallL) {
      x = wallL;
      vx *= -bounce;
      angularV *= -1;
      playBounce(Math.abs(vx));
    }

    if (x > wallR) {
      x = wallR;
      vx *= -bounce;
      angularV *= -1;
      playBounce(Math.abs(vx));
    }
  }

  pompom.style.left = x + "px";
  pompom.style.top = y + "px";
  pompom.style.transform =
    `scale(${scale}) rotate(${angle}deg)`;

  requestAnimationFrame(update);
}

update();
