class Chili extends MovableObject {
  width = 42;
  height = 39;

  constructor(x, y) {
    super();
    this.loadImage("img/chili/chili.png");
    this.x = x;
    this.y = y;
  }
}
