class World {
    character = new Character();
    level = level1;

    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.setWorld();
        this.character.animate();
        this.draw();
    }

    setWorld() {
        this.character.world = this;
    }



    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);

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