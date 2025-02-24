// ----------------- MouseTrail Class -----------------
class MouseTrail {
    constructor() {
        this.points = [];
        this.lifetime = 400; // in ms
        this.radius = 13;
    }

    addPoint(x, y) {
        this.points.push({ x, y, time: Date.now() });
    }

    update() {
        const now = Date.now();
        this.points = this.points.filter(pt => now - pt.time < this.lifetime);
    }

    draw(ctx) {
        const now = Date.now();
        this.update();

        if (this.points.length < 2) return; // Need at least two points to draw a line

        ctx.save();
        ctx.filter = 'blur(2px)';

        // Draw connecting line
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.strokeStyle = "rgba(100,200,255,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw dots along the trail
        for (let pt of this.points) {
            let age = now - pt.time;
            let factor = 1 - age / this.lifetime;
            let r = this.radius * (1 + factor * 0.1);
            let gradient = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r);
            gradient.addColorStop(0, `rgba(100,200,255,${0.4 * factor})`);
            gradient.addColorStop(1, 'rgba(100,200,255,0)');
            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

