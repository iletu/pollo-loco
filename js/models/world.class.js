class World {
  character = new Character();
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObjects = [];
  lastThrow = 0;

  goldenEggs = [
    new GoldenEgg(250, 270),
    new GoldenEgg(285, 200),
    new GoldenEgg(320, 270),
    new GoldenEgg(700, 200),
    new GoldenEgg(850, 270),
    new GoldenEgg(1000, 270),
    new GoldenEgg(1035, 200),
    new GoldenEgg(1070, 270),
    new GoldenEgg(1300, 200),
    new GoldenEgg(1600, 270),
    new GoldenEgg(1900, 270),
    new GoldenEgg(1935, 200),
    new GoldenEgg(1970, 270),
    new GoldenEgg(2200, 270),
  ];
  totalGoldenEggs = this.goldenEggs.length;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.setWorld();
    // this.character.animate();
    this.draw();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D && Date.now() - this.lastThrow >= 200) {
      this.throwBottle();
    }
  }

  throwBottle() {
    let bottle = new ThrowableObject(this.character.x, this.character.y);
    this.throwableObjects.push(bottle);
    this.lastThrow = Date.now();
  }

  checkCollisions() {
    // check collision
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !this.character.isHurt()) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        console.log("Collision with Character, energy ", this.character.energy);
      }
    });
  }

  collectGoldenEggs() {
    this.goldenEggs = this.goldenEggs.filter((egg) => {
      if (this.character.isColliding(egg)) {
        egg.stopAnimation();
        return false;
      }
      return true;
    });
  }

  drawEggCounter() {
    const collectedEggs = this.totalGoldenEggs - this.goldenEggs.length;
    const label = `Goldene Eier: ${collectedEggs} / ${this.totalGoldenEggs}`;
    this.ctx.save();
    this.ctx.font = "bold 18px sans-serif";
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = "#302013";
    this.ctx.fillStyle = "#ffe077";
    this.ctx.strokeText(label, 15, 62);
    this.ctx.fillText(label, 15, 62);
    this.ctx.restore();
  }

  draw() {
    this.collectGoldenEggs();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.goldenEggs);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);

    this.addObjectsToMap(this.throwableObjects);

    // Die Statusleiste bleibt beim Scrollen an derselben Bildschirmposition.
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.drawEggCounter();

    // Draw() wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });

    // this.ctx.drawImage(this.enemies.img, this.enemies.x, this.enemies.y, this.enemies.width, this.enemies.height);
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
