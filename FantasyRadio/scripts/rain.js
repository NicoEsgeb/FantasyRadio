/* ============================================================= */
/*                          RAIN PARTICLES                       */
/* ============================================================= */
class Rain {
    constructor() {
        this.reset();
    }

    /* Reset particle position and properties */
    reset() {
        this.x = Math.random() * window.canvas.width;  // Random horizontal position
        this.y = Math.random() * -window.canvas.height; // Start above viewport
        this.speed = Math.random() * 5 + 3;           // Fall speed between 3-8
        this.length = Math.random() * 25 + 10;        // Line length between 10-35
        this.opacity = Math.random() * 0.3 + 0.3;     // Opacity between 0.3-0.6
    }

    /* Update particle position */
    update() {
        this.y += this.speed;
        if (this.y > window.canvas.height) this.reset();
    }

    /* Draw rain line */
    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.strokeStyle = `rgba(174, 194, 224, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}