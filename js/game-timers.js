// Alle Timer gehören zur aktuellen Spielrunde.
const gameIntervals = [];
const gameTimeouts = new Set();
let pausedAt = null;
let pausedTime = 0;

function gameTime() {
  return (pausedAt === null ? Date.now() : pausedAt) - pausedTime;
}

function setGameInterval(callback, delay) {
  const timer = setInterval(() => {
    if (pausedAt === null) {
      callback();
    }
  }, delay);
  gameIntervals.push(timer);
  return timer;
}

function setGameTimeout(callback, delay) {
  const dueAt = gameTime() + delay;
  function schedule(wait) {
    const timer = setTimeout(() => {
      gameTimeouts.delete(timer);
      const remaining = dueAt - gameTime();
      if (pausedAt !== null || remaining > 0) {
        schedule(Math.max(50, remaining));
      } else {
        callback();
      }
    }, wait);
    gameTimeouts.add(timer);
  }
  schedule(delay);
}

function clearGameTimers() {
  for (const timer of gameIntervals) {
    clearInterval(timer);
  }
  for (const timer of gameTimeouts) {
    clearTimeout(timer);
  }
  gameIntervals.length = 0;
  gameTimeouts.clear();
  pausedAt = null;
  pausedTime = 0;
}
