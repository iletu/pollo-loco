class World {
  character = new Character();
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
  bossBar = new StatusBar([0, 20, 40, 60, 80, 100].map((percentage) =>
    `img/7_statusbars/2_statusbar_endboss/orange/orange${percentage}.png`
  ));
  thrownChilis = [];
  lastThrow = 0;
  bossEgg = null;
  bossEggCollectedAt = null;
  celebrationDuration = 1450;
  bossEggX;

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
    44, "img/8_golden_egg/golden_egg_1.png",
    this.goldenEggs.length,
  );
  chiliBar = new CollectibleBar(
    74, "img/6_chili/chili.png",
    this.chilis.length,
  );

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.bossBar.x = this.canvas.width - this.bossBar.width - 10;
    // Der Balken sitzt im Boss-PNG höher, deshalb zeichnen wir es 6 Pixel tiefer.
    this.bossBar.y = this.statusBar.y + 6;

    this.setWorld();
    // this.character.animate();
    this.draw();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    // Kürzere Abstände helfen, kurze Berührungen zu erkennen.
    setInterval(() => {
      this.checkCollisions();
    }, 50);

    setInterval(() => {
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
    if (this.chiliBar.amount === 0 || this.character.isDead() || this.isCelebrating() ||
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
    if (this.isCelebrating()) {
      return;
    }
    // check collision
    this.level.enemies.forEach((enemy) => {
      if (!enemy.isDead() && this.character.isColliding(enemy) && !this.character.isHurt()) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        console.log("Collision with Character, energy ", this.character.energy);
      }
    });
  }

  checkChiliHits() {
    this.thrownChilis = this.thrownChilis.filter((chili) => {
      if (chili.y >= this.canvas.height) {
        chili.stop();
        return false;
      }

      // Pro Chili zählt nur der erste Treffer auf einen lebenden Gegner.
      const enemy = this.level.enemies.find((enemy) =>
        !enemy.isDead() && chili.isColliding(enemy)
      );
      if (enemy) {
        enemy.hit();
        if (enemy instanceof Endboss && enemy.isDead()) {
          this.spawnBossEgg(enemy);
        }
        chili.stop();
        return false;
      }
      return true;
    });
  }

  spawnBossEgg(boss) {
    const eggWidth = 100;
    const eggHeight = 120;
    // Das Ei erscheint mittig über der Stelle des Bosses.
    this.bossEggX = boss.x + (boss.width - eggWidth) / 2;
    // Etwas höher zeichnen, damit das Ei auf Höhe von Pepes Füßen sitzt.
    const eggY = boss.y + boss.height - eggHeight - 20;
    this.bossEgg = new GoldenEgg(this.bossEggX, eggY);
    this.bossEgg.width = eggWidth;
    this.bossEgg.height = eggHeight;
  }

  getPlayerEndX() {
    // Erst nach dem Sieg darf Pepe zum großen Ei weiterlaufen.
    return this.bossEggX ?? this.level.level_end_x;
  }

  collectBossEgg() {
    if (this.bossEgg && this.character.isColliding(this.bossEgg)) {
      this.bossEgg.stopAnimation();
      this.bossEgg = null;
      this.bossEggCollectedAt = Date.now();
      this.character.lastAction = this.bossEggCollectedAt;
    }
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
      this.collectBossEgg();
    }
    // Fliegende Chilis bei jedem Bild auf Treffer prüfen.
    this.checkChiliHits();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.goldenEggs);
    this.addObjectsToMap(this.chilis);
    if (this.bossEgg) {
      this.addToMap(this.bossEgg);
    }

    this.drawCharacter();
    const visibleEnemies = this.level.enemies.filter((enemy) => {
      if (enemy instanceof Chicken) {
        return enemy.isVisible();
      }
      return !enemy.isDead();
    });
    this.addObjectsToMap(visibleEnemies);
    this.addObjectsToMap(this.level.clouds);

    this.addObjectsToMap(this.thrownChilis);

    // Die Statusleisten bleiben beim Scrollen an derselben Bildschirmposition.
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.eggBar);
    this.addToMap(this.chiliBar);
    this.drawBossBar();

    // Draw() wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });

    // this.ctx.drawImage(this.enemies.img, this.enemies.x, this.enemies.y, this.enemies.width, this.enemies.height);
  }

  drawBossBar() {
    // Die Leiste ist sichtbar, sobald der Boss ins Bild kommt.
    if (this.endboss && this.endboss.x + this.camera_x < this.canvas.width) {
      this.bossBar.setPercentage(this.endboss.energy);
      this.addToMap(this.bossBar);
    }
  }

  drawCharacter() {
    if (!this.isCelebrating()) {
      this.addToMap(this.character);
      return;
    }

    const elapsed = Date.now() - this.bossEggCollectedAt;
    // Erst anheben, kurz schweben und dann wieder absenken.
    const rise = Math.min(elapsed / 350, 1);
    const descent = Math.min((this.celebrationDuration - elapsed) / 400, 1);
    const lift = 78 * Math.min(rise, descent);
    const pepe = this.character;
    const pose = pepe.imageCache[pepe.IMAGES_JUMPING[5]];

    this.ctx.save();
    // Die Aura erscheint erst, wenn Pepe oben schwebt.
    if (elapsed >= 350) {
      this.ctx.shadowColor = "#ffd700";
      this.ctx.shadowBlur = 30 * descent;
    }
    this.ctx.drawImage(pose, pepe.x, pepe.y - lift, pepe.width, pepe.height);
    this.ctx.restore();
  }

  isCelebrating() {
    return this.bossEggCollectedAt !== null &&
      Date.now() - this.bossEggCollectedAt < this.celebrationDuration;
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
