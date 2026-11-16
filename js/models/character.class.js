class Character extends MovableObject {
  height = 280;
  width = 150;
  // y = 155;
  y = 50;
  speed = 8;
  jumpSpeed = 25;

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

  world;

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.applyGravity();

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
        this.speedY === 0
      ) {
        this.jump();
      }
      // Pepe kann bis zur Mitte laufen und dann geht die Kamera mit
      const centerX = (this.world.canvas.width - this.width) / 2;
      this.world.camera_x = Math.min(0, centerX - this.x);
    }, 1000 / 60);

    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        const jumpProgress =
          (this.jumpSpeed - this.speedY) / (2 * this.jumpSpeed);
        const lastFrame = this.IMAGES_JUMPING.length - 1;
        const frame = Math.max(
          0,
          Math.min(Math.round(jumpProgress * lastFrame), lastFrame),
        );

        this.img = this.imageCache[this.IMAGES_JUMPING[frame]];
      } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.img = this.imageCache[this.IMAGES_WALKING[0]];
      }
    }, 50);
  }

  jump() {
    this.currentImage = 0;
    this.speedY = this.jumpSpeed;
  }
}
