class World {
  character = new Character();
  level = level1;

  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  previousPlayerBottom;
  statusBar = new HealthHearts("img/7_statusbars/3_icons/pepe-portrait.png");
  endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
  bossBar = new HealthHearts("img/7_statusbars/3_icons/boss-portrait.png");
  thrownChilis = [];
  lastThrow = 0;
  bossEgg = null;
  bossEggCollectedAt = null;
  celebrationDuration = 1450;
  defeatFlashDuration = 360;
  defeatFlock = null;
  cacti = [
    new Cactus(900),
    new Cactus(1750),
    new Cactus(2850),
    new Cactus(3650),
    new Cactus(4400),
  ];
  bossEggX;
  eggSound = createGameSound("audio/sounds/collectibles/collectSound.wav");
  bossEggSound = createGameSound("audio/sounds/collectibles/bossEggAppear.wav");
  victorySound = createGameSound("audio/sounds/game/victory.wav");
  chiliSound = createGameSound("audio/sounds/collectibles/bottleCollectSound.wav");
  chiliThrowSound = createGameSound("audio/sounds/throwable/chiliThrow.wav");
  bossApproachSound = createGameSound("audio/sounds/endboss/endbossApproach-game.wav");
  bossHitSound = createGameSound("audio/sounds/chicken/chickenDead2.mp3");
  chickenHitSound = createGameSound("audio/sounds/chicken/chickenDead.mp3");
  chickenCluckSound = createGameSound("audio/sounds/chicken/chickenCluck.m4a");
  lastChickenCluck = 0;
  bossApproachPlayed = false;
  nextEggSoundAt = 0;

  goldenEggs = [
    new GoldenEgg(250, 270),
    new GoldenEgg(285, 205),
    new GoldenEgg(320, 270),
    new GoldenEgg(700, 205),
    new GoldenEgg(850, 270),
    new GoldenEgg(1580, 245),
    new GoldenEgg(1615, 175),
    new GoldenEgg(1650, 245),
    new GoldenEgg(2050, 270),
    new GoldenEgg(2430, 190),
    new GoldenEgg(2670, 245),
    new GoldenEgg(2740, 195),
    new GoldenEgg(3160, 250),
    new GoldenEgg(3450, 270),
    new GoldenEgg(3890, 210),
    new GoldenEgg(4200, 225),
    new GoldenEgg(4235, 165),
    new GoldenEgg(4270, 225),
    new GoldenEgg(4620, 245),
    new GoldenEgg(5080, 270),
  ];
  // Jede Chili bekommt ihre Position im Level als x und y.
  chilis = [
    new Chili(220, 335),
    new Chili(480, 265),
    new Chili(625, 200),
    new Chili(925, 335),
    new Chili(1350, 245),
    new Chili(1930, 220),
    new Chili(2290, 335),
    new Chili(2790, 335),
    new Chili(3230, 265),
    new Chili(3660, 190),
    new Chili(4400, 220),
    new Chili(4780, 335),
  ];

  eggCounter = new CollectibleCounter(
    "img/8_golden_egg/golden_egg_1.png",
    this.goldenEggs.length,
  );
  chiliCounter = new CollectibleCounter(
    "img/6_chili/chili.png",
    this.chilis.length,
  );

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.eggSound.volume = 0.35;
    this.bossEggSound.volume = 0.30;
    this.victorySound.volume = 0.35;
    this.chiliSound.volume = 0.35;
    this.chiliThrowSound.volume = 0.25;
    this.bossApproachSound.volume = 0.55;
    this.bossHitSound.volume = 0.65;
    this.chickenHitSound.volume = 0.55;
    this.chickenCluckSound.volume = 0.20;
    this.bossBar.x = this.canvas.width - this.bossBar.width - 10;
    // Beide Zähler folgen direkt auf Pepes Herzleiste.
    this.eggCounter.x = this.statusBar.x + this.statusBar.width + 12;
    this.chiliCounter.x = this.eggCounter.x + this.eggCounter.width + 11;

    this.setWorld();
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
      this.checkChickenSounds();
    }, 200);
  }

  checkChickenSounds() {
    // Die Aufnahme dauert gut zwei Sekunden und soll ganz ausspielen.
    if (this.character.isDead() || Date.now() - this.lastChickenCluck < 2400) {
      return;
    }

    // Nur lebende Hühner in Pepes Nähe gackern hörbar.
    const nearbyChicken = this.level.enemies.some((enemy) =>
      enemy instanceof Chicken && !enemy.isDead() &&
      Math.abs(enemy.x - this.character.x) < 240
    );
    if (nearbyChicken) {
      this.lastChickenCluck = Date.now();
      this.character.playSound(this.chickenCluckSound);
    }
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      this.throwChili();
    }
  }

  throwChili() {
    // Ohne Vorrat, im Tod oder innerhalb der Wartezeit wird kein Wurf gestartet.
    if (this.chiliCounter.amount === 0 || this.character.isDead() || this.bossEggCollectedAt !== null ||
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
    this.chiliCounter.amount--;
    this.lastThrow = Date.now();
    this.character.playSound(this.chiliThrowSound);
  }

  checkCollisions() {
    if (this.character.isDead() || this.bossEggCollectedAt !== null) {
      return;
    }
    // Für Gegnerkontakt zählt Pepes roter Rahmen.
    const hitbox = this.character.getHitbox(this.character.otherDirection);
    this.cacti.forEach((cactus) => {
      if (cactus.touches(hitbox) && !this.character.isHurt()) {
        this.character.hit(10);
        this.statusBar.setPercentage(this.character.energy);
      }
    });
    if (this.character.isDead()) {
      return;
    }
    const feet = this.character.getFootHitbox();
    const bottom = feet.y + feet.height;
    const previousBottom = this.previousPlayerBottom ?? bottom;
    this.previousPlayerBottom = bottom;
    if (this.checkStomp(feet, previousBottom, bottom)) {
      return;
    }
    this.level.enemies.forEach((enemy) => {
      if (!enemy.isDead() && enemy.isColliding(hitbox) && !this.character.isHurt()) {
        this.character.hit(10);
        this.statusBar.setPercentage(this.character.energy);
        console.log("Collision with Character, energy ", this.character.energy);
      }
    });
  }

  checkStomp(hitbox, previousBottom, bottom) {
    // Pepes Füße müssen beim Fallen die Oberkante eines Huhns überqueren.
    if (bottom <= previousBottom) {
      return false;
    }
    const chicken = this.level.enemies.find((enemy) =>
      enemy instanceof Chicken && !enemy.isDead() &&
      previousBottom <= enemy.y && bottom >= enemy.y &&
      hitbox.x < enemy.x + enemy.width && hitbox.x + hitbox.width > enemy.x
    );
    if (!chicken) {
      return false;
    }
    chicken.hit();
    this.character.speedY = 12;
    this.character.playSound(this.chickenHitSound);
    return true;
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
        if (enemy instanceof Endboss) {
          this.character.playSound(this.bossHitSound);
          if (enemy.isDead()) {
            this.spawnBossEgg(enemy);
          }
        } else if (enemy instanceof Chicken) {
          this.character.playSound(this.chickenHitSound);
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
    this.character.playSound(this.bossEggSound);
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
      this.character.setLoopSound(null);
      this.bossEggSound.pause();
      this.character.playSound(this.victorySound);
    }
  }

  collectGoldenEggs() {
    // Bei filter() bleibt ein Ei nur mit true in der Liste.
    this.goldenEggs = this.goldenEggs.filter((egg) => {
      if (this.character.canCollect(egg)) {
        egg.stopAnimation();
        this.playEggSound();
        return false;
      }
      return true;
    });
    // Gesammelte Eier sind alle Eier minus die übrigen im Level.
    this.eggCounter.amount = this.eggCounter.total - this.goldenEggs.length;
  }

  playEggSound() {
    // Bei mehreren Eiern liegen die Töne kurz auseinander.
    const now = Date.now();
    const delay = Math.max(0, this.nextEggSoundAt - now);
    this.nextEggSoundAt = now + delay + 120;
    if (delay === 0) {
      this.character.playSound(this.eggSound);
    } else {
      setTimeout(() => this.character.playSound(this.eggSound), delay);
    }
  }

  collectChilis() {
    this.chilis = this.chilis.filter((chili) => {
      if (this.character.canCollect(chili)) {
        this.chiliCounter.amount++;
        this.character.playSound(this.chiliSound);
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
    this.addObjectsToMap(this.cacti);
    this.addObjectsToMap(this.goldenEggs);
    this.addObjectsToMap(this.chilis);
    if (this.bossEgg) {
      this.addToMap(this.bossEgg);
    }

    this.drawCharacter();
    if (this.character.isDead()) {
      this.drawDefeatFlock();
    }
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
    this.addToMap(this.eggCounter);
    this.addToMap(this.chiliCounter);
    this.drawBossBar();
    if (this.character.isDead() &&
        this.getRetreatX() + this.camera_x + this.character.width <= 0) {
      this.drawEndMessage("Try Again!");
    } else if (!this.character.isDead() &&
        this.bossEggCollectedAt !== null && !this.isCelebrating()) {
      this.drawEndMessage("You Win!");
    }

    // Draw() wird immer wieder aufgerufen
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  drawBossBar() {
    // Die Leiste ist sichtbar, sobald der Boss ins Bild kommt.
    if (this.endboss && this.endboss.x + this.camera_x < this.canvas.width) {
      // Der Begrüßungston erklingt nur beim ersten Auftauchen.
      if (!this.bossApproachPlayed && !this.endboss.isDead()) {
        this.bossApproachPlayed = true;
        this.character.playSound(this.bossApproachSound);
      }
      this.bossBar.setPercentage(this.endboss.energy);
      this.addToMap(this.bossBar);
    }
  }

  drawCharacter() {
    if (this.character.isDead()) {
      this.drawDefeatedCharacter();
      return;
    }

    if (!this.isCelebrating()) {
      if (this.bossEggCollectedAt !== null) {
        this.drawVictoryExit();
      } else {
        this.addToMap(this.character);
      }
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

  drawDefeatedCharacter() {
    const pepe = this.character;
    const elapsed = Date.now() - pepe.lastHit;
    if (elapsed >= this.defeatFlashDuration) {
      this.drawRetreat(elapsed - this.defeatFlashDuration);
      return;
    }

    // Jedes Trefferbild ist kurz sichtbar und wird dann ausgeblendet.
    const frameDuration = this.defeatFlashDuration / pepe.IMAGES_HURT.length;
    if (elapsed % frameDuration < frameDuration / 2) {
      const frame = Math.floor(elapsed / frameDuration);
      const image = pepe.imageCache[pepe.IMAGES_HURT[frame]];
      if (pepe.otherDirection) {
        this.flipImage(pepe);
      }
      this.ctx.drawImage(image, pepe.x, pepe.y, pepe.width, pepe.height);
      if (pepe.otherDirection) {
        this.flipImageBack(pepe);
      }
    }
  }

  drawDefeatFlock() {
    if (this.defeatFlock === null) {
      this.defeatFlock = [];
      for (let i = 0; i < 8; i++) {
        let chicken;
        if (i % 2 === 0) {
          chicken = new Chicken(0);
        } else {
          chicken = new SmallChicken(0, 100, 2);
        }
        // Diese Schar bewegt sich über die Zeit der Niederlagenanimation.
        clearInterval(chicken.movementInterval);
        clearInterval(chicken.animationInterval);
        this.defeatFlock.push(chicken);
      }
    }

    const runningTime = Math.max(0, Date.now() - this.character.lastHit - this.defeatFlashDuration);
    const rightScreenEdge = this.canvas.width - this.camera_x;
    for (let i = 0; i < this.defeatFlock.length; i++) {
      const chicken = this.defeatFlock[i];
      chicken.x = rightScreenEdge + i * 35 - runningTime * 0.46;
      const frame = Math.floor(runningTime / 90) % chicken.IMAGES_WALKING.length;
      chicken.img = chicken.imageCache[chicken.IMAGES_WALKING[frame]];
      if (chicken.x + chicken.width + this.camera_x > 0) {
        this.addToMap(chicken);
      }
    }
  }

  getRetreatX() {
    const runningTime = Math.max(0, Date.now() - this.character.lastHit - this.defeatFlashDuration);
    return this.character.x - runningTime * 0.48;
  }

  drawRetreat(runningTime) {
    const pepe = this.character;
    const x = this.getRetreatX();
    if (x + this.camera_x + pepe.width <= 0) {
      pepe.setLoopSound(null);
      return;
    }

    this.drawRunningPepe(x, runningTime, true);
  }

  drawVictoryExit() {
    const pepe = this.character;
    // Der Schriftzug steht schon kurz da, bevor Pepe losläuft.
    const runningTime = Date.now() - this.bossEggCollectedAt - this.celebrationDuration - 300;
    const x = pepe.x + Math.max(0, runningTime) * 0.48;
    if (x + this.camera_x >= this.canvas.width) {
      pepe.setLoopSound(null);
      return;
    }
    this.drawRunningPepe(x, runningTime);
  }

  drawRunningPepe(x, runningTime, facingLeft = false) {
    const pepe = this.character;
    pepe.setLoopSound(runningTime >= 0 ? pepe.sounds.running : null);
    const frame = Math.floor(Math.max(0, runningTime) / 65) % pepe.IMAGES_WALKING.length;
    const image = pepe.imageCache[pepe.IMAGES_WALKING[frame]];
    this.ctx.save();
    if (facingLeft) {
      this.ctx.translate(x + pepe.width, 0);
      this.ctx.scale(-1, 1);
      x = 0;
    }
    this.ctx.drawImage(image, x, pepe.y, pepe.width, pepe.height);
    this.ctx.restore();
  }

  drawEndMessage(label) {
    this.ctx.save();
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    this.ctx.font = "bold 66px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    // Das Schild bleibt niedriger als die Schrift.
    const panelWidth = this.ctx.measureText(label).width + 24;
    this.ctx.beginPath();
    this.ctx.roundRect(centerX - panelWidth / 2, centerY - 24, panelWidth, 48, 14);
    this.ctx.fillStyle = this.statusBar.BACKGROUND_COLOR;
    this.ctx.fill();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = this.statusBar.BORDER_COLOR;
    this.ctx.stroke();

    this.ctx.lineWidth = 8;
    this.ctx.strokeStyle = this.statusBar.BACKGROUND_COLOR;
    this.ctx.fillStyle = "#ffd573";
    this.ctx.strokeText(label, centerX, centerY);
    this.ctx.fillText(label, centerX, centerY);
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
