class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x;
    backgroundEndX;

    constructor(enemies, clouds, backgroundObjects, levelEndX) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.level_end_x = levelEndX;
        this.backgroundEndX = 0;
        for (const background of backgroundObjects) {
            const rightEdge = background.x + background.width;
            if (rightEdge > this.backgroundEndX) {
                this.backgroundEndX = rightEdge;
            }
        }
    }
}
