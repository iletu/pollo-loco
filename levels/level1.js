function createLevel1() {
    const path = 'img/5_background/layers';
    const backgroundObjects = [];
    const levelEndX = 5080;

    // Vier weitere Hintergrundbilder verlängern den Weg.
    for (let i = -2; i <= 7; i++) {
        const x = i * 720;
        const imageNumber = i % 2 === 0 ? 1 : 2;

        backgroundObjects.push(
            new BackgroundObject(`${path}/air.png`, x),
            new BackgroundObject(`${path}/3_third_layer/${imageNumber}.png`, x),
            new BackgroundObject(`${path}/2_second_layer/${imageNumber}.png`, x),
            new BackgroundObject(`${path}/1_first_layer/${imageNumber}.png`, x)
        );
    }

    return new Level([
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(1530),
        new Chicken(2390),
        new Chicken(3380),
        new Chicken(4480),
        new SmallChicken(1150, 120, 1.5),
        new SmallChicken(1900, 100, 2.1),
        new SmallChicken(2550, 150, 1.7),
        new SmallChicken(3120, 85, 2.3),
        new SmallChicken(4050, 130, 1.8),
        new SmallChicken(4680, 95, 2.2),
        new Endboss(levelEndX + 350)
    ],

        [
            new Cloud()
        ],

        backgroundObjects,
        levelEndX
    );
}
