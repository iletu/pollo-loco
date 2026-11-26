class Endboss extends MovableObject {
    height = 350;
    width = 250;
    y = 100;
    IMAGE_HURT = 'img/4_enemie_boss_chicken/4_hurt/G21.png';
    speed = 2;
    activated = false;
    stepsUntilChange = 60;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    constructor(x) {
        super();
        this.loadImage(this.IMAGES_ALERT[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages([this.IMAGE_HURT]);

        this.x = x;
        this.leftEdge = x - 500;
        this.rightEdge = x;
        this.animate();
    };

    animate() {
        this.movementInterval = setInterval(() => {
            if (!this.world || this.world.character.isDead()) {
                return;
            }
            if (this.x + this.world.camera_x < this.world.canvas.width) {
                this.activated = true;
            }
            if (!this.activated || this.isHurt() || this.isDead()) {
                return;
            }

            this.stepsUntilChange--;
            if (this.stepsUntilChange <= 0) {
                // Nach etwa 0,8 bis 1,8 Sekunden wählt der Boss ein neues Tempo.
                this.speed = 1.5 + Math.random() * 2;
                this.otherDirection = Math.random() < 0.5;
                this.stepsUntilChange = 50 + Math.floor(Math.random() * 60);
            }

            if (this.otherDirection) {
                this.x = Math.min(this.x + this.speed, this.rightEdge);
                if (this.x === this.rightEdge) {
                    this.otherDirection = false;
                }
            } else {
                this.x = Math.max(this.x - this.speed, this.leftEdge);
                if (this.x === this.leftEdge) {
                    this.otherDirection = true;
                }
            }
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (!this.isHurt()) {
                if (this.activated) {
                    this.playAnimation(this.IMAGES_WALKING);
                } else {
                    this.playAnimation(this.IMAGES_ALERT);
                }
            }
        }, 200);
    }

    hit() {
        // Der Endboss hat 100 Energie. Eine Chili zieht 20 ab.
        super.hit(20);
        this.shrink();
        if (this.isDead()) {
            clearInterval(this.movementInterval);
            clearInterval(this.animationInterval);
        } else {
            this.img = this.imageCache[this.IMAGE_HURT];
        }
    }

    shrink() {
        this.width -= 25;
        this.height -= 35;
        // Der Boss schrumpft zur Mitte hin und bleibt am Boden.
        this.x += 12.5;
        this.y += 35;
    }
}
