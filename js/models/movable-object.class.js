class MovableObject extends DrawableObject {
  speed = 0.08;

  otherDirection = false;

  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  hurtDuration = 1000;

  groundY = 155;

  applyGravity() {
    return setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;

        // Die Spielfigur hält am Boden an.
        if (this.y >= this.groundY && !this.isAboveGround()) {
          this.y = this.groundY;
          this.speedY = 0;
        }
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < this.groundY;
  }

  // Prüft, ob sich die beiden Rechtecke überlappen.
  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.height
    );
  }

  hit(damage = 5) {
    this.energy -= damage;
    this.lastHit = Date.now();
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    return Date.now() - this.lastHit < this.hurtDuration;
  }

  isDead() {
    return this.energy == 0;
  }

  moveRight() {
    console.log("Moving right");
  }

  moveLeft() {
    return setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }

  playAnimation(images) {
    // Walk animation
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
}
