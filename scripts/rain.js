/* ============================================================= */
/*                          RAIN PARTICLES                       */
/* ============================================================= */
class Rain {
    constructor() {
        this.reset(true);
    }

    /* Reset particle position and properties */
    reset(randomY = false) {
        const canvas = window.canvas;
        const depth = Math.random() * 0.65 + 0.35; // 0.35 (far) - 1 (near)
        this.depth = depth;
        this.length = (20 + Math.random() * 24) * depth;
        this.lineWidth = 0.7 + depth * 1.05;
        this.opacity = 0.2 + depth * 0.55;
        this.windInfluence = 0.7 + Math.random() * 0.9;
        this.fallSpeed = (800 + Math.random() * 900) * (0.65 + depth * 0.6); // px/s
        this.gravity = 1200 + Math.random() * 900; // px/s^2
        this.x = Math.random() * canvas.width;
        this.y = randomY ? Math.random() * canvas.height : Math.random() * -canvas.height;
    }

    /* Update particle position */
    update(dt, windX) {
        this.fallSpeed += this.gravity * dt * 0.25;
        this.x += windX * this.windInfluence * dt;
        this.y += this.fallSpeed * dt;

        if (
            this.y - this.length > window.canvas.height ||
            this.x < -80 ||
            this.x > window.canvas.width + 80
        ) {
            this.reset();
        }
    }

    /* Draw rain line */
    draw(ctx, windX) {
        const slope = windX / (this.fallSpeed + 1e-3);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + slope * this.length, this.y + this.length);
        ctx.strokeStyle = `rgba(200, 220, 255, ${this.opacity})`;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = "round";
        ctx.stroke();
    }
}
