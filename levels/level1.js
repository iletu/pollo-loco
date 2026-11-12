const path = 'img/5_background/layers';
const backgroundObjects = [];

for (let i = -2; i <= 3; i++) {
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
    new Endboss()
],

    [
        new Cloud()
    ],

    backgroundObjects
);