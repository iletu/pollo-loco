let canvas;
let world;
let keyboard = new Keyboard();
const gameSounds = [];
let isMuted = false;

function createGameSound(path) {
  const sound = new Audio(path);
  sound.muted = isMuted;
  gameSounds.push(sound);
  return sound;
}

const backgroundMusic = createGameSound("audio/bg-music.mp3");
backgroundMusic.volume = 0.05;
backgroundMusic.loop = true;

function toggleMute(event) {
  isMuted = !isMuted;
  // Auch Töne, die gerade laufen, werden sofort stumm.
  gameSounds.forEach((sound) => {
    sound.muted = isMuted;
  });
  const button = document.getElementById("mute-button");
  button.setAttribute("aria-pressed", String(isMuted));
  // Nach einem Mausklick soll die Leertaste wieder Pepe springen lassen.
  if (event.detail > 0) {
    button.blur();
  }
  startBackgroundMusic();
}

function startBackgroundMusic() {
  // Der Browser erlaubt Musik erst nach einer Eingabe.
  if (!isMuted && backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {});
  }
}

window.addEventListener("pointerdown", (event) => {
  if (event.target.id !== "mute-button") {
    startBackgroundMusic();
  }
});

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);

  console.log("My Character is", world.character);
}

window.addEventListener("keydown", (event) => {
  if (event.target.id === "mute-button" && (event.code === "Space" || event.code === "Enter")) {
    return;
  }
  startBackgroundMusic();
  console.log(event.code);

  // Jeder Tastendruck startet die Wartezeit für Idle und Sleep neu.
  if (world) {
    world.character.lastAction = Date.now();
  }

  if (event.code === "ArrowRight") {
    keyboard.RIGHT = true;
  }

  if (event.code === "ArrowLeft") {
    keyboard.LEFT = true;
  }

  if (event.code === "ArrowUp") {
    keyboard.UP = true;
  }

  if (event.code === "ArrowDown") {
    keyboard.DOWN = true;
  }

  if (event.code === "Space") {
    keyboard.SPACE = true;
  }

  if (event.code === "KeyD") {
    if (!keyboard.D && world) {
      world.throwChili();
    }
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (event) => {
  console.log(event.code);

  if (event.code === "ArrowRight") {
    keyboard.RIGHT = false;
  }

  if (event.code === "ArrowLeft") {
    keyboard.LEFT = false;
  }

  if (event.code === "ArrowUp") {
    keyboard.UP = false;
  }

  if (event.code === "ArrowDown") {
    keyboard.DOWN = false;
  }

  if (event.code === "Space") {
    keyboard.SPACE = false;
  }

  if (event.code === "KeyD") {
    keyboard.D = false;
  }
});
