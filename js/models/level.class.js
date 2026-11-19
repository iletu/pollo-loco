class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 2200;
    backgroundEndX;

    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.backgroundEndX = 0;
        for (const background of backgroundObjects) {
            const rightEdge = background.x + background.width;
            if (rightEdge > this.backgroundEndX) {
                this.backgroundEndX = rightEdge;
            }
        }
    }
}
