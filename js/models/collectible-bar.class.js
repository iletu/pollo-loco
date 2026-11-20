class CollectibleBar extends DrawableObject {
  constructor(y, label, icon, color, total) {
    super();
    this.x = 15;
    this.y = y;
    this.width = 175;
    this.height = 25;
    this.label = label;
    this.color = color;
    // total ist die Anzahl im Level, amount der aktuelle Zählerstand.
    this.total = total;
    this.amount = 0;
    this.loadImage(icon);
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#39251e";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Beispiel: 4 von 8 Chilis füllen die Leiste zur Hälfte.
    ctx.fillStyle = this.color;
    const fillWidth = (this.width - 4) * this.amount / this.total;
    ctx.fillRect(this.x + 2, this.y + 2, fillWidth, this.height - 4);

    ctx.drawImage(this.img, this.x + 5, this.y + 2, 19, 21);
    ctx.font = "bold 14px sans-serif";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#39251e";
    ctx.fillStyle = "#fff";
    const text = `${this.label}: ${this.amount} / ${this.total}`;
    ctx.strokeText(text, this.x + 29, this.y + 17);
    ctx.fillText(text, this.x + 29, this.y + 17);
    ctx.restore();
  }
}
