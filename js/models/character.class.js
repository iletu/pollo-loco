class Character extends MovableObject {
  height = 280;
  width = 150;
  // y = 155;
  y = 50;
  speed = 8;
  jumpSpeed = 25;
  jumpState = "idle";

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

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
  IMAGES_AIRBORNE = this.IMAGES_JUMPING.slice(3, 6);

  world;

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.applyGravity(() => {
      this.img = this.imageCache[this.IMAGES_AIRBORNE[0]];
    });

    this.animate();
  }

  animate() {
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
      if (this.isAboveGround()) {
        const jumpProgress =
          (this.jumpSpeed - this.speedY) / (2 * this.jumpSpeed);
        const lastFrame = this.IMAGES_AIRBORNE.length - 1;
        const frame = Math.max(
          0,
          Math.min(Math.round(jumpProgress * lastFrame), lastFrame),
        );

        this.img = this.imageCache[this.IMAGES_AIRBORNE[frame]];
        return;
      }

      if (this.speedY > 0) {
        return;
      }

      if (this.jumpState === "jumping") {
        this.img = this.imageCache[this.IMAGES_JUMPING.at(-1)];
        this.jumpState = "landing";
        return;
      }

      this.jumpState = "idle";
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.img = this.imageCache[this.IMAGES_WALKING[0]];
      }
    }, 50);
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

    this.world.camera_x = Math.max(cameraEndX, Math.min(0, centerX - this.x + extraPan));
  }

  jump() {
    this.jumpState = "jumping";
    this.currentImage = 0;
    this.speedY = this.jumpSpeed;
    this.img = this.imageCache[this.IMAGES_JUMPING[2]];
  }
}
