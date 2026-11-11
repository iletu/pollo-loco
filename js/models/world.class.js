class World {
    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ];
    clouds = [
        new Cloud()
    ];
    backgroundObjects = [];
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        const path = 'img/5_background/layers';

        for (let i = -3; i <= 3; i++) {
            const x = i * 720;
            const imageNumber = i % 2 === 0 ? 1 : 2;

            this.backgroundObjects.push(
                new BackgroundObject(`${path}/air.png`, x),
                new BackgroundObject(`${path}/3_third_layer/${imageNumber}.png`, x),
                new BackgroundObject(`${path}/2_second_layer/${imageNumber}.png`, x),
                new BackgroundObject(`${path}/1_first_layer/${imageNumber}.png`, x)
            );
        }
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }



    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.enemies);
        this.addObjectsToMap(this.clouds);

        this.ctx.translate(-this.camera_x, 0);



        // Draw() wird immer wieder aufgerufen
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });

        // this.ctx.drawImage(this.enemies.img, this.enemies.x, this.enemies.y, this.enemies.width, this.enemies.height);
    }


    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        let drawX = mo.x;

        if (mo.otherDirection) {
            this.ctx.save();
            this.ctx.translate(mo.x + mo.width, 0);
            this.ctx.scale(-1, 1);
            drawX = 0;
        }

        this.ctx.drawImage(mo.img, drawX, mo.y, mo.width, mo.height);

        if (mo.otherDirection) {
            this.ctx.restore();
        }
    }



}