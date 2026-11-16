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
        this.backgroundEndX = backgroundObjects.reduce(
            (rightEdge, object) => Math.max(rightEdge, object.x + object.width),
            0
        );
    }
}
