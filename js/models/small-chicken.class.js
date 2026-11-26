class SmallChicken extends Chicken {
    width = 45;
    height = 45;
    y = 380;
    constructor(x, patrolDistance, speed) {
        super(x, 'chicken_small', 120);
        this.leftEdge = x - patrolDistance;
        this.rightEdge = x + patrolDistance;
        this.baseSpeed = speed * 1.6;
        this.speed = this.baseSpeed;
        this.stepsUntilChange = 20 + Math.floor(Math.random() * 40);
    }

    startMoving() {
        return setInterval(() => {
            this.stepsUntilChange--;
            if (this.stepsUntilChange <= 0) {
                // Nach einer zufälligen Zeit ändern sich Tempo und Richtung.
                this.speed = this.baseSpeed * (0.8 + Math.random() * 0.6);
                this.otherDirection = Math.random() < 0.5;
                this.stepsUntilChange = 25 + Math.floor(Math.random() * 45);
            }

            // An beiden Enden dreht das Küken um.
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
    }
}
