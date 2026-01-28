const music = document.getElementById("bg-music");


function iniciarMusica() {
music.volume = 0.3;
music.play();


// IMPORTANTE: se elimina inmediatamente
document.removeEventListener("click", iniciarMusica);
}


// listener PASIVO, no bloquea navegación
document.addEventListener("click", iniciarMusica, { once: true });