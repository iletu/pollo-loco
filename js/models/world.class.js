class World {
  character = new Character();
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  thrownChilis = [];
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
  // Jede Chili bekommt ihre Position im Level als x und y.
  chilis = [
    new Chili(220, 350),
    new Chili(480, 350),
    new Chili(625, 250),
    new Chili(925, 350),
    new Chili(1210, 250),
    new Chili(1450, 350),
    new Chili(1760, 350),
    new Chili(2100, 350),
  ];

  eggBar = new CollectibleBar(
    46, "Goldene Eier", "img/8_golden_egg/golden_egg_1.png", "#bd8100",
    this.goldenEggs.length,
  );
  chiliBar = new CollectibleBar(
    76, "Chilis", "img/chili/chili.png", "#ad2b20",
    this.chilis.length,
  );

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
    if (this.keyboard.D) {
      this.throwChili();
    }
  }

  throwChili() {
    // Ohne Vorrat, im Tod oder innerhalb der Wartezeit wird kein Wurf gestartet.
    if (this.chiliBar.amount === 0 || this.character.isDead() ||
        Date.now() - this.lastThrow < 200) {
      return;
    }

    const chili = new ThrownChili(
      this.character.x + this.character.width / 2,
      this.character.y + 100,
      this.character.otherDirection,
      this.canvas.height,
    );
    this.thrownChilis.push(chili);
    // Ein erfolgreicher Wurf verbraucht genau eine Chili.
    this.chiliBar.amount--;
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
    // Bei filter() bleibt ein Ei nur mit true in der Liste.
    this.goldenEggs = this.goldenEggs.filter((egg) => {
      if (this.character.isColliding(egg)) {
        egg.stopAnimation();
        return false;
      }
      return true;
    });
    // Gesammelte Eier sind alle Eier minus die übrigen im Level.
    this.eggBar.amount = this.eggBar.total - this.goldenEggs.length;
  }

  collectChilis() {
    this.chilis = this.chilis.filter((chili) => {
      if (this.character.isColliding(chili)) {
        this.chiliBar.amount++;
        // Die eingesammelte Chili verschwindet aus dem Level.
        return false;
      }
      return true;
    });
  }

  draw() {
    // Pro Bild prüfen, damit Pepe auch beim Springen einsammelt.
    if (!this.character.isDead()) {
      this.collectGoldenEggs();
      this.collectChilis();
    }
    // Würfe unterhalb des Bildschirms aus der Liste entfernen.
    this.thrownChilis = this.thrownChilis.filter((chili) => chili.y < this.canvas.height);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.goldenEggs);
    this.addObjectsToMap(this.chilis);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);

    this.addObjectsToMap(this.thrownChilis);

    // Die Statusleisten bleiben beim Scrollen an derselben Bildschirmposition.
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.eggBar);
    this.addToMap(this.chiliBar);

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
