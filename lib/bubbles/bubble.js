class Bubble {
  constructor(radius, initialVelocityY, accelarationFactor, currX, currY, currDX, currDY, color) {
    this.radius = radius;
    this.initialVelocityY = initialVelocityY;
    this.accelarationFactor = accelarationFactor;
    this.currX = currX;
    this.currY = currY;
    this.currDX = currDX;
    this.currDY = currDY;
    this.color = color;
  }

  drawBubble(ctx) {
    ctx.beginPath();
    ctx.arc(this.currX, this.currY, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#17ffd3';
    ctx.fill();
    ctx.closePath();
  }

  moveToNextPos(ctx, canvas) {
    this.currDY += this.accelarationFactor;

    if (this.currX + this.currDX > canvas.width - this.radius || this.currX + this.currDX < this.radius) {
      this.currDX = -this.currDX;
    }

    if (this.currY + this.currDY > canvas.height - this.radius || this.currY + this.currDY < this.radius) {
      if (this.currDY > 0) {
        this.currDY = -this.initialVelocityY;
      } else {
        this.currDY = this.initialVelocityY;
      }
    }

    this.currX += this.currDX;
    this.currY += this.currDY;

    this.drawBubble(ctx);
  }

  distanceBetween(x1, y1, x2, y2) {
    let a = Math.abs(x1 - x2);
    let b = Math.abs(y1 - y2);

    return Math.sqrt(a * a + b * b);
  }

  checkHorizontalCollision(x, y) {
    // check that the line's height is greater than (remember the axis
    // are inversed) the center of the bubble height
    // check if the line's horizontal distance from the bubble's center is
    // less than the radius

    return (Math.abs(x - this.currX) < this.radius) && (y < this.currY);
  }

  checkEdgeCollision(x, y) {
    return this.distanceBetween(x, y, this.currX, this.currY) < this.radius;
  }

  checkCollision(x, y) {
    return  this.checkEdgeCollision(x, y) || this.checkHorizontalCollision(x, y);
  }
};

export default Bubble;
