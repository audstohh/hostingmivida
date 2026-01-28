const pompom = document.getElementById("pompom");
const bounceSound = document.getElementById("bounce-sound");

/* =====================
   ESTADO POSICIÓN
===================== */
let x = window.innerWidth / 2;
let y = 100;

let vx = 0;
let vy = 0;

/* =====================
   ROTACIÓN
===================== */
let angle = 0;        // grados
let angularV = 0;     // velocidad angular

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

  const pitch = Math.min(0.8 + force * 0.05, 1.6);
  bounceSound.playbackRate = pitch;

  bounceSound.play();
}

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
  if (!dragging) return;
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

  angularV = vx * 0.5; // girar según arrastre horizontal

  x = newX;
  y = newY;
});

/* =====================
   LOOP PRINCIPAL
===================== */
function update() {
  if (!dragging) {
    /* gravedad */
    vy += gravity;

    x += vx;
    y += vy;

    vx *= friction;
    angularV *= angularFriction;

    angle += angularV;

    const floor = window.innerHeight - pompom.offsetHeight;
    const ceiling = 0;
    const wallL = 0;
    const wallR = window.innerWidth - pompom.offsetWidth;

    /* piso */
    if (y > floor) {
      y = floor;
      vy *= -bounce;
      angularV += vx * 0.6;
      playBounce(Math.abs(vy));
    }

    /* techo */
    if (y < ceiling) {
      y = ceiling;
      vy *= -bounce;
      angularV += vx * 0.4;
      playBounce(Math.abs(vy));
    }

    /* pared izquierda */
    if (x < wallL) {
      x = wallL;
      vx *= -bounce;
      angularV *= -1;
      playBounce(Math.abs(vx));
    }

    /* pared derecha */
    if (x > wallR) {
      x = wallR;
      vx *= -bounce;
      angularV *= -1;
      playBounce(Math.abs(vx));
    }
  }

  pompom.style.left = x + "px";
  pompom.style.top = y + "px";
  pompom.style.transform = `rotate(${angle}deg)`;

  requestAnimationFrame(update);
}

update();