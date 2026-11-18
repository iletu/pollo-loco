class Character extends MovableObject {
  height = 280;
  width = 150;
  // y = 155;
  y = 50;
  speed = 8;
  jumpSpeed = 25;
  // idle = bereit, jumping = Sprung, landing = abfedern.
  jumpState = "idle";
  // Merkt sich das nächste Bild für die Landung.
  jumpFrame = 0;

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

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  world;

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    // Sobald Pepe abhebt, wechselt das Bild sofort zu einer Flugpose ohne Schatten.
    this.applyGravity(() => this.animateJump());

    this.animate();
  }

  animate() {
    const animationInterval = 50;
    setInterval(() => {
      const { keyboard, level } = this.world;

      if (keyboard.RIGHT && this.x < level.level_end_x) {
        this.x = Math.min(this.x + this.speed, level.level_end_x);
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
      // Pepe kann bis zur Mitte laufen und dann geht die Kamera mit
      this.updateCamera();
    }, 1000 / 60);

    setInterval(() => {
      // Erst der Tod, dann ein Treffer, dann die normale Bewegung.
      const hurtFrame = Math.floor(
        (Date.now() - this.lastHit) / animationInterval,
      );
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (hurtFrame < this.IMAGES_HURT.length) {
        this.img = this.imageCache[this.IMAGES_HURT[hurtFrame]];
      } else if (this.isAboveGround()) {
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
      return;
    }

    this.jumpState = "idle";
    const { keyboard } = this.world;
    if (keyboard.RIGHT || keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.img = this.imageCache[this.IMAGES_WALKING[0]];
    }
  }

  updateCamera() {
    const { canvas, level } = this.world;
    const centerX = (canvas.width - this.width) / 2;
    const cameraEndX = Math.min(0, canvas.width - level.backgroundEndX);
    const centeredEndX = Math.min(0, centerX - level.level_end_x);
    const panDistance = 600;
    const panStartX = level.level_end_x - panDistance;
    const panProgress = Math.max(0, (this.x - panStartX) / panDistance);
    const extraPan = Math.min(0, cameraEndX - centeredEndX) * panProgress;

    this.world.camera_x = Math.max(
      cameraEndX,
      Math.min(0, centerX - this.x + extraPan),
    );
  }

  jump() {
    this.jumpState = "jumping";
    this.currentImage = 0;
    // Der nächste Physikschritt bewegt Pepe direkt nach oben.
    this.speedY = this.jumpSpeed;
    this.animateJump();
  }
}
