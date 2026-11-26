class Character extends MovableObject {
  height = 280;
  width = 150;
  offset = { top: 105, right: 44, bottom: 15, left: 22 };
  hurtDuration = 500; // Pause zwischen zwei Treffern in Millisekunden.
  // y = 155;
  y = 50;
  speed = 8;
  jumpSpeed = 25;
  jumpState = "idle";
  jumpFrame = 0;

  lastAction = Date.now(); // Merkt sich die Zeit der letzten Aktion.
  lastRestAnimation = 0; // Zeitpunkt des letzten Idle- oder Sleep-Bildwechsels.

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  // J-31 bis J-33 am Boden, J-34 bis J-36 in der Luft, J-37 bis J-39 bei der Landung.
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
  ];
  IMAGES_SLEEP = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];
  world;
  sounds = {
    running: createGameSound("audio/sounds/character/characterRun.mp3"),
    jumping: createGameSound("audio/sounds/character/characterJump.wav"),
    hurt: createGameSound("audio/sounds/character/characterDamage.mp3"),
    snoring: createGameSound("audio/sounds/character/characterSnoring.mp3"),
  };
  activeLoop = null;

  constructor() {
    super();
    this.sounds.running.loop = true;
    this.sounds.running.volume = 0.09;
    this.sounds.jumping.volume = 0.13;
    this.sounds.hurt.volume = 0.10;
    this.sounds.snoring.loop = true;
    this.sounds.snoring.volume = 0.10;
    this.loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_SLEEP);
    this.applyGravity();

    this.animate();
  }

  animate() {
    const animationInterval = 50;
    setInterval(() => {
      // Nach Sieg oder Niederlage übernimmt die Abschlussanimation.
      if (this.isDead() || this.world.bossEggCollectedAt !== null) {
        return;
      }
      const keyboard = this.world.keyboard;
      const endX = this.world.getPlayerEndX();

      if (keyboard.RIGHT && this.x < endX) {
        this.x = Math.min(this.x + this.speed, endX);
        this.otherDirection = false;
      }

      if (keyboard.LEFT && this.x > 0) {
        this.x = Math.max(this.x - this.speed, 0);
        this.otherDirection = true;
      }

      if (
        (keyboard.SPACE || keyboard.UP) &&
        !this.isAboveGround() &&
        this.speedY === 0 &&
        this.jumpState === "idle"
      ) {
        this.jump();
      }
      this.updateCamera();
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        return;
      }
      if (this.world.bossEggCollectedAt !== null) {
        return;
      }

      // Trefferbilder haben Vorrang vor der normalen Bewegung.
      const hurtFrame = Math.floor(
        (Date.now() - this.lastHit) / animationInterval,
      );
      if (hurtFrame < this.IMAGES_HURT.length) {
        this.img = this.imageCache[this.IMAGES_HURT[hurtFrame]];
      } else if (this.isAboveGround()) {
        this.setLoopSound(null);
        this.animateJump();
      } else {
        this.animateOnGround();
      }
    }, animationInterval);
  }

  animateJump() {
    // speedY ist beim Aufstieg positiv und beim Fallen negativ.
    const halfJumpSpeed = this.jumpSpeed / 2;
    if (this.speedY > halfJumpSpeed) {
      this.img = this.imageCache[this.IMAGES_JUMPING[3]]; // J-34: Aufstieg
    } else if (this.speedY <= -halfJumpSpeed) {
      this.img = this.imageCache[this.IMAGES_JUMPING[5]]; // J-36: Abstieg
    } else {
      this.img = this.imageCache[this.IMAGES_JUMPING[4]]; // J-35: oben
    }
  }

  animateOnGround() {
    // Der Absprung ist bereit. Beim nächsten Physikschritt hebt Pepe ab.
    if (this.speedY > 0) {
      return;
    }

    // Pepe steht wieder am Boden. Jetzt beginnt die Landung.
    if (this.jumpState === "jumping") {
      this.jumpState = "landing";
      this.jumpFrame = 6; // J-37: erstes Landebild
    }

    if (
      this.jumpState === "landing" &&
      this.jumpFrame < this.IMAGES_JUMPING.length
    ) {
      this.img = this.imageCache[this.IMAGES_JUMPING[this.jumpFrame]];
      this.jumpFrame++;
      this.lastAction = Date.now(); // Die Ruhezeit beginnt nach der Landung.
      return;
    }

    this.jumpState = "idle";
    const keyboard = this.world.keyboard;

    if (keyboard.RIGHT || keyboard.LEFT) {
      this.setLoopSound(this.sounds.running);
      this.playAnimation(this.IMAGES_WALKING);
      this.lastAction = Date.now(); // Wartezeit beim Laufen zurücksetzen.
    } else {
      let timePassed = Date.now() - this.lastAction;
      let animationPassed = Date.now() - this.lastRestAnimation;

      if (timePassed >= 15000) {
        this.setLoopSound(this.sounds.snoring);
        if (animationPassed >= 250) {
          this.playAnimation(this.IMAGES_SLEEP);
          this.lastRestAnimation = Date.now();
        }
      } else {
        this.setLoopSound(null);
        if (timePassed >= 5000) {
          if (animationPassed >= 150) {
            this.playAnimation(this.IMAGES_IDLE);
            this.lastRestAnimation = Date.now();
          }
        } else {
          this.img = this.imageCache[this.IMAGES_WALKING[0]];
        }
      }
    }
  }

  updateCamera() {
    const canvas = this.world.canvas;
    const level = this.world.level;
    // Die Kamera folgt Pepe ab 35 % der Bildschirmbreite.
    const followX = canvas.width * 0.35 - this.width / 2;
    const cameraEndX = Math.min(0, canvas.width - level.backgroundEndX);
    const panDistance = 600;
    const panStartX = level.level_end_x - panDistance;
    let cameraX = followX - this.x;

    // Auf den letzten 600 Pixeln schwenkt die Kamera bis zum Feldrand.
    if (this.x > panStartX) {
      const progress = (this.x - panStartX) / panDistance;
      const missingDistance = followX - level.level_end_x - cameraEndX;
      if (missingDistance > 0) {
        cameraX = cameraX - missingDistance * progress;
      }
    }

    if (cameraX > 0) {
      cameraX = 0;
    }
    if (cameraX < cameraEndX) {
      cameraX = cameraEndX;
    }
    this.world.camera_x = cameraX;
  }

  getCollectArea(mirrored = false) {
    const left = mirrored ? this.offset.right : this.offset.left;
    const right = mirrored ? this.offset.left : this.offset.right;
    const bodyCenterX = this.x + (left + this.width - right) / 2;
    const collectWidth = 78;
    const collectTop = this.offset.top + 14;
    return {
      x: bodyCenterX - collectWidth / 2,
      y: this.y + collectTop,
      width: collectWidth,
      height: this.height - collectTop - this.offset.bottom,
    };
  }

  canCollect(item) {
    const area = this.getCollectArea(this.otherDirection);
    const itemCenterX = item.x + item.width / 2;
    const itemCenterY = item.y + item.height / 2;

    // Die Mitte des Gegenstands muss im Sammelbereich liegen.
    return itemCenterX >= area.x && itemCenterX <= area.x + area.width &&
      itemCenterY >= area.y && itemCenterY <= area.y + area.height;
  }

  getHitbox(mirrored = false) {
    const left = mirrored ? this.offset.right : this.offset.left;
    return {
      x: this.x + left,
      y: this.y + this.offset.top,
      width: this.width - this.offset.left - this.offset.right,
      height: this.height - this.offset.top - this.offset.bottom,
    };
  }

  getFootHitbox() {
    // Der schmale Bereich umfasst die Schuhe in Pepes fallender Sprungpose.
    const footWidth = this.width * 0.27;
    let left = this.width * 0.49;
    if (this.otherDirection) {
      left = this.width - left - footWidth;
    }
    return {
      x: this.x + left,
      y: this.y + this.height - this.offset.bottom - 10,
      width: footWidth,
      height: 10,
    };
  }

  drawFrame(ctx) {
    super.drawFrame(ctx);
    // Beim Zeichnen ist die Blickrichtung bereits gespiegelt.
    const hitbox = this.getHitbox();
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    ctx.restore();
  }

  jump() {
    this.setLoopSound(null);
    this.playSound(this.sounds.jumping);
    this.jumpState = "jumping";
    this.currentImage = 0;
    // Der nächste Physikschritt bewegt Pepe direkt nach oben.
    this.speedY = this.jumpSpeed;
    this.animateJump();
  }

  hit(damage) {
    super.hit(damage);
    this.setLoopSound(null);
    this.playSound(this.sounds.hurt);
  }

  playSound(sound) {
    sound.currentTime = 0;
    // Der Browser kann Ton vor der ersten Eingabe blockieren.
    sound.play().catch(() => {});
  }

  setLoopSound(sound) {
    // Die Schleife nur beim Wechsel der Animation starten oder stoppen.
    if (this.activeLoop === sound) {
      return;
    }
    if (this.activeLoop) {
      this.activeLoop.pause();
    }
    this.activeLoop = sound;
    if (sound) {
      this.playSound(sound);
    }
  }
}
