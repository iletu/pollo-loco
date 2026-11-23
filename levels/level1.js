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

const level1 = new Level([
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Endboss(levelEndX + 350)
],

    [
        new Cloud()
    ],

    backgroundObjects,
    levelEndX
);
