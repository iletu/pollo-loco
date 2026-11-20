class ThrownChili extends Chili {
  width = 58;
  height = 58;

  IMAGES_ROTATION = [
    "img/6_chili/rotation/chili-0.png",
    "img/6_chili/rotation/chili-1.png",
    "img/6_chili/rotation/chili-2.png",
    "img/6_chili/rotation/chili-3.png",
    "img/6_chili/rotation/chili-4.png",
    "img/6_chili/rotation/chili-5.png",
    "img/6_chili/rotation/chili-6.png",
    "img/6_chili/rotation/chili-7.png",
  ];

  constructor(x, y, otherDirection, canvasHeight) {
    // Die größeren Drehbilder haben Platz um die Chili herum.
    super(x - 8, y - 9.5);
    this.loadImages(this.IMAGES_ROTATION);
    this.playAnimation(this.IMAGES_ROTATION);
    this.otherDirection = otherDirection;
    this.speedY = 15;
    // Beim Wurf nach links wird x kleiner.
    const step = otherDirection ? -13 : 13;
    const gravityInterval = this.applyGravity();
    let movementSteps = 0;

    const movementInterval = setInterval(() => {
      this.x += step;
      movementSteps++;
      // Nach vier Bewegungsschritten kommt das nächste Drehbild.
      if (movementSteps === 4) {
        this.playAnimation(this.IMAGES_ROTATION);
        movementSteps = 0;
      }
      // Unterhalb des Canvas endet der Wurf.
      if (this.y >= canvasHeight) {
        clearInterval(gravityInterval);
        clearInterval(movementInterval);
      }
    }, 25);
  }

  isAboveGround() {
    // Die geworfene Chili fällt auch unterhalb des Bodens weiter.
    return true;
  }
}
