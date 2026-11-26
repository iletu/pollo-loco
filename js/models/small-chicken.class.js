class SmallChicken extends Chicken {
    width = 45;
    height = 45;
    y = 380;
    constructor(x, patrolDistance, speed) {
        super(x, 'chicken_small', 120);
        this.leftEdge = x - patrolDistance;
        this.rightEdge = x + patrolDistance;
        this.speed = speed;
    }

    startMoving() {
        return setInterval(() => {
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
