class ThrowableObject extends MovableObject {
  constructor(x, y) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );
    this.height = 100;
    this.width = 100;
    this.throw(x, y);
  }

  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = 15; // Flacherer Wurf durch weniger Aufwärtsgeschwindigkeit.
    this.applyGravity();
    setInterval(() => {
      this.x += 13; // Mehr Strecke nach rechts pro Schritt.
    }, 25);
  }
}
