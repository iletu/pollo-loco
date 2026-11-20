class CollectibleBar extends StatusBar {
  constructor(y, icon, total) {
    super();
    this.y = y;
    // total ist die Anzahl im Level, amount der aktuelle Zählerstand.
    this.total = total;
    this.amount = 0;
    this.loadImages([icon]);
    this.icon = this.imageCache[icon];
  }

  draw(ctx) {
    // Wie bei der Energie wählen wir eines der sechs fertigen Balkenbilder.
    this.setPercentage(this.amount / this.total * 100);
    const barX = this.x + 24;
    const barY = this.y + 8;
    // Das Herz liegt links im PNG. Wir zeichnen nur den Balken daneben.
    ctx.drawImage(this.img, 110, 76, 485, 60, barX, barY, this.width - 24, 18);

    ctx.drawImage(this.icon, this.x + 1, this.y, 32, 32);
    ctx.save();
    ctx.font = "bold 11px sans-serif";
    ctx.fillStyle = "#302013";
    ctx.fillText(`${this.amount} / ${this.total}`, barX + 11, barY + 13);
    ctx.restore();
  }

}
