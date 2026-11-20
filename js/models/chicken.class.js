class Chicken extends MovableObject {
    y = 355;
    height = 70;
    width = 70;
    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.IMAGE_DEAD]);

        this.x = 250 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();
    }

    animate() {
        this.movementInterval = this.moveLeft();

        this.animationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 200);
    }

    hit() {
        // Ein Chili-Treffer stoppt das Huhn sofort.
        this.energy = 0;
        this.lastHit = Date.now();
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
        this.img = this.imageCache[this.IMAGE_DEAD];
    }

    isVisible() {
        if (!this.isDead()) {
            return true;
        }
        // Das Huhn blinkt dreimal und bleibt danach unsichtbar.
        const timeSinceHit = Date.now() - this.lastHit;
        return timeSinceHit < 480 && timeSinceHit % 160 < 80;
    }
}
