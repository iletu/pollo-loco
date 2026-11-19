class GoldenEgg extends MovableObject {
  width = 50;
  height = 60;
  glow = 12;
  animationInterval;

  IMAGES = [
    "img/8_golden_egg/golden_egg_1.png",
    "img/8_golden_egg/golden_egg_2.png",
  ];

  constructor(x, y) {
    super();
    this.loadImage("img/8_golden_egg/golden_egg_1.png");
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.animate();
  }

  animate() {
    // Unterschiedliche Glanzpunkte lassen das Ei funkeln.
    this.animationInterval = setInterval(() => {
      this.playAnimation(this.IMAGES);
      if (this.glow === 12) {
        this.glow = 25;
      } else {
        this.glow = 12;
      }
    }, 350);
  }

  stopAnimation() {
    clearInterval(this.animationInterval);
  }

  draw(ctx) {
    // Goldener Lichtschein, der mit dem Bildwechsel heller und dunkler wird.
    ctx.save();
    ctx.shadowColor = "#ffd700";
    ctx.shadowBlur = this.glow;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
