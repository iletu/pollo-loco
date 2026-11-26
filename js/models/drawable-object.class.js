class DrawableObject {
  x = 50;
  y = 275;

  height = 150;
  width = 100;

  img;
  imageCache = {};
  currentImage = 0;

  // loadImage (img/test.png);
  loadImage(path) {
    this.img = new Image(); // this.img = document.getElementById('img') <img id="image" src>
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
