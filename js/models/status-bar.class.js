class StatusBar extends DrawableObject {
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  percentage = 100;
  width = 180;
  height = 48;

  constructor(images) {
    super();
    if (images) {
      this.IMAGES = images;
    }
    this.loadImages(this.IMAGES);
    this.x = 10;
    this.y = 0;
    this.setPercentage(100);
  }

  // setPercentage(50)
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  resolveImageIndex() {
    // Rundet auf die nächste Bildstufe auf: Bei 75 % wird das 80-%-Bild angezeigt.
    return Math.ceil(this.percentage / 20);
  }
}
