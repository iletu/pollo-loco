class CollectibleCounter extends DrawableObject {
  constructor(icon, total) {
    super();
    this.y = 25;
    this.width = 82;
    this.height = 26;
    this.total = total;
    this.amount = 0;
    this.loadImage(icon);
  }

  draw(ctx) {
    ctx.save();

    // Ein braunes Schild hinter Symbol und Anzahl.
    const background = ctx.createLinearGradient(0, this.y, 0, this.y + this.height);
    background.addColorStop(0, "#704022");
    background.addColorStop(1, "#392014");
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 11);
    ctx.fillStyle = background;
    ctx.fill();
    ctx.strokeStyle = "#b47742";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.drawImage(this.img, this.x - 3, this.y - 6, 38, 38);
    ctx.font = "bold 15px sans-serif";
    ctx.fillStyle = "#fff0d1";
    ctx.textBaseline = "middle";
    ctx.fillText(`× ${String(this.amount).padStart(2, "0")}`, this.x + 34, this.y + this.height / 2);
    ctx.restore();
  }
}
