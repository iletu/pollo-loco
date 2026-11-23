class HealthHearts extends DrawableObject {
  BACKGROUND_COLOR = "#492819";
  BORDER_COLOR = "#b47742";
  x = 10;
  y = 0;
  scale = 0.9;
  width = 224 * this.scale;
  percentage = 100;

  constructor(portrait) {
    super();
    this.loadImage("img/7_statusbars/3_icons/icon_health_red.png");
    this.loadImages([portrait]);
    this.portrait = this.imageCache[portrait];
  }

  setPercentage(percentage) {
    this.percentage = percentage;
  }

  draw(ctx) {
    const y = this.y + 26;
    const panelX = this.x + 32;
    // Porträt und Herzen gemeinsam um ihre Zeilenmitte verkleinern.
    const centerY = y + 12;
    ctx.save();
    ctx.translate(this.x, centerY);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-this.x, -centerY);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(panelX, y - 2, 192, 28, 11);
    ctx.fillStyle = this.BACKGROUND_COLOR;
    ctx.fill();
    ctx.strokeStyle = this.BORDER_COLOR;
    ctx.lineWidth = 3;
    ctx.stroke();

    for (let i = 0; i < 5; i++) {
      const x = panelX + 27 + i * 32;
      // Pro Herz zählen höchstens 20 Energiepunkte.
      const fill = Math.max(0, Math.min(1, (this.percentage - i * 20) / 20));

      if (fill < 1) {
        ctx.globalAlpha = 0.28;
        this.drawHeart(ctx, x, y, 1);
      }
      if (fill > 0) {
        ctx.globalAlpha = 1;
        this.drawHeart(ctx, x, y, fill);
      }
    }
    ctx.restore();
    this.drawPortrait(ctx, centerY);
    ctx.restore();
  }

  drawPortrait(ctx, centerY) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x + 25, centerY, 26, 0, Math.PI * 2);
    ctx.fillStyle = this.BACKGROUND_COLOR;
    ctx.fill();
    ctx.strokeStyle = this.BORDER_COLOR;
    ctx.lineWidth = 3;
    ctx.stroke();
    // Oben dürfen Sombrero und Hahnenkamm über den Kreis hinausragen.
    ctx.rect(this.x - 4, centerY - 30, 58, 30);
    ctx.clip();
    ctx.drawImage(this.portrait, this.x - 4, centerY - 29, 58, 60);
    ctx.restore();
  }

  drawHeart(ctx, x, y, fill) {
    // Bei einem Teilherz wird nur der gefüllte Bildausschnitt gezeichnet.
    ctx.drawImage(this.img, 0, 0, this.img.naturalWidth * fill, this.img.naturalHeight, x, y - 4, 32 * fill, 32);
  }
}
