class Cactus extends DrawableObject {
  width = 120;
  height = 130;
  y = 295;

  constructor(x) {
    super();
    this.x = x;
    this.loadImage("img/10_cactus/prickly-pear-outlined.png");
  }

  touches(hitbox) {
    // Transparente Ränder des Bildes zählen nicht als Stacheln.
    const left = this.x + 12;
    const right = this.x + this.width - 12;
    return hitbox.x < right && hitbox.x + hitbox.width > left &&
      hitbox.y < this.y + this.height && hitbox.y + hitbox.height > this.y + 5;
  }
}
