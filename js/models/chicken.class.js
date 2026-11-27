class Chicken extends MovableObject {
    y = 355;
    height = 70;
    width = 70;
    constructor(x = 250 + Math.random() * 500, spriteFolder = 'chicken_normal', frameTime = 200) {
        super();
        const path = `img/3_enemies_chicken/${spriteFolder}`;
        this.IMAGES_WALKING = [
            `${path}/1_walk/1_w.png`,
            `${path}/1_walk/2_w.png`,
            `${path}/1_walk/3_w.png`
        ];
        this.IMAGE_DEAD = `${path}/2_dead/dead.png`;
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.IMAGE_DEAD]);

        this.x = x;
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate(frameTime);
    }

    animate(frameTime) {
        this.movementInterval = this.startMoving();

        this.animationInterval = setGameInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, frameTime);
    }

    startMoving() {
        return this.moveLeft();
    }

    hit() {
        // Ein Treffer stoppt das Huhn sofort.
        this.energy = 0;
        this.lastHit = gameTime();
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        this.img = this.imageCache[this.IMAGE_DEAD];
    }

    isVisible() {
        if (!this.isDead()) {
            return true;
        }
        // Das Huhn blinkt dreimal und bleibt danach unsichtbar.
        const timeSinceHit = gameTime() - this.lastHit;
        return timeSinceHit < 480 && timeSinceHit % 160 < 80;
    }
}
