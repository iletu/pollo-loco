class Endboss extends MovableObject {
    height = 350;
    width = 250;
    y = 100;
    IMAGE_HURT = 'img/4_enemie_boss_chicken/4_hurt/G21.png';

    IMAGES_WALKING = [
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
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages([this.IMAGE_HURT]);

        this.x = x;
        this.animate();
    };

    animate() {
        this.animationInterval = setInterval(() => {
            if (!this.isHurt()) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    hit() {
        // Der Endboss hat 100 Energie. Eine Chili zieht 20 ab.
        super.hit(20);
        this.shrink();
        if (this.isDead()) {
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
