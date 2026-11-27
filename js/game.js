let canvas;
let world;
let keyboard = new Keyboard();
const gameSounds = [];
const muteStorageKey = "polloLocoMuted";
let isMuted = loadMuteSetting();
let musicFading = false;
let pausedSounds = [];

function loadMuteSetting() {
  try {
    return localStorage.getItem(muteStorageKey) === "true";
  } catch {
    return false;
  }
}

function saveMuteSetting() {
  try {
    localStorage.setItem(muteStorageKey, String(isMuted));
  } catch {
    // Bei gesperrtem Speicher gilt die Einstellung für diese Seite.
  }
}

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
  saveMuteSetting();
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
  if (!world || pausedAt !== null || world.character.isDead() || world.bossEggCollectedAt !== null) {
    return;
  }
  // Der Browser erlaubt Musik erst nach einer Eingabe.
  if (!isMuted && backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {});
  }
}

function fadeBackgroundMusic() {
  if (musicFading) {
    return;
  }
  musicFading = true;
  // Alle 50 Millisekunden wird die Musik etwas leiser.
  const fadeTimer = setGameInterval(() => {
    backgroundMusic.volume = Math.max(0, backgroundMusic.volume - 0.0025);
    if (backgroundMusic.volume === 0) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
      clearInterval(fadeTimer);
    }
  }, 50);
}

window.addEventListener("pointerdown", (event) => {
  if (event.target.id !== "mute-button") {
    startBackgroundMusic();
  }
});

function init() {
  canvas = document.getElementById("canvas");
  document.getElementById("mute-button").setAttribute("aria-pressed", String(isMuted));
}

function restartGame(event) {
  stopGame();
  setGameScreen(true);
  keyboard = new Keyboard();
  world = new World(canvas, keyboard);
  if (event.detail > 0) {
    event.currentTarget.blur();
  }
  startBackgroundMusic();
}

function stopGame() {
  if (!world) {
    return;
  }
  world.stopped = true;
  cancelAnimationFrame(world.animationFrame);
  clearGameTimers();
  pausedSounds = [];
  for (const sound of gameSounds) {
    sound.pause();
    sound.currentTime = 0;
  }
  // Nur die Hintergrundmusik wird für die neue Runde wiederverwendet.
  gameSounds.length = 0;
  gameSounds.push(backgroundMusic);
  musicFading = false;
  backgroundMusic.volume = 0.05;
  world = null;
}

function setGameScreen(isPlaying) {
  canvas.hidden = !isPlaying;
  document.getElementById("home-screen").hidden = isPlaying;
  document.getElementById("home-button").hidden = !isPlaying;
}

function updatePlayButton(round) {
  const button = document.getElementById("restart-button");
  let label = "Spiel pausieren";
  if (round.character.isDead() || round.bossEggCollectedAt !== null) {
    label = "Spiel neu starten";
  } else if (pausedAt !== null) {
    label = "Weiterspielen";
  }
  if (button.getAttribute("aria-label") !== label) {
    button.setAttribute("aria-label", label);
  }
}

function toggleGamePause(event) {
  if (!world || world.character.isDead() || world.bossEggCollectedAt !== null) {
    restartGame(event);
    return;
  }
  if (event.detail > 0) event.currentTarget.blur();
  if (pausedAt === null) {
    pausedAt = Date.now();
    Object.assign(keyboard, new Keyboard());
    cancelAnimationFrame(world.animationFrame);
    pausedSounds = gameSounds.filter((sound) => !sound.paused);
    for (const sound of pausedSounds) sound.pause();
    updatePlayButton(world);
  } else {
    pausedTime += Date.now() - pausedAt;
    pausedAt = null;
    for (const sound of pausedSounds) sound.play().catch(() => {});
    pausedSounds = [];
    startBackgroundMusic();
    world.draw();
  }
}

function showHome() {
  stopGame();
  setGameScreen(false);
  const playButton = document.getElementById("restart-button");
  playButton.setAttribute("aria-label", "Spiel starten");
  playButton.focus();
}

function closeHelpOnBackdrop(event) {
  if (event.target !== event.currentTarget) {
    return;
  }
  const bounds = event.currentTarget.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) {
    event.currentTarget.close();
  }
}

window.addEventListener("keydown", (event) => {
  if (event.target.tagName === "BUTTON" && (event.code === "Space" || event.code === "Enter")) {
    return;
  }
  if (!world || pausedAt !== null) return;
  startBackgroundMusic();

  // Jeder Tastendruck startet die Wartezeit für Idle und Sleep neu.
  if (world) {
    world.character.lastAction = gameTime();
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
