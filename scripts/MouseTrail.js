// Lightweight mouse trail optimized for high FPS.
class MouseTrail {
    constructor(options = {}) {
        this.lifetime = options.lifetime || 180; // ms
        this.radius = options.radius || 5;
        this.spacing = options.spacing || 6;
        this.maxPoints = options.maxPoints || 60;
        this.color = options.color || "rgba(160, 210, 255, 1)";

        // Pre-allocated ring buffer.
        this.xs = new Float32Array(this.maxPoints);
        this.ys = new Float32Array(this.maxPoints);
        this.ts = new Float64Array(this.maxPoints);
        this.count = 0;
        this.start = 0;

        // Cache RGB for quick alpha tweaks.
        this.rgb = MouseTrail.parseColor(this.color);
    }

    _idx(i) {
        return (this.start + i) % this.maxPoints;
    }

    _push(x, y, t) {
        const idx = this._idx(this.count);
        this.xs[idx] = x;
        this.ys[idx] = y;
        this.ts[idx] = t;
        if (this.count < this.maxPoints) {
            this.count++;
        } else {
            this.start = (this.start + 1) % this.maxPoints;
        }
    }

    addPoint(x, y, now = performance.now()) {
        if (!this.count) {
            this._push(x, y, now);
            return;
        }

        const lastIdx = this._idx(this.count - 1);
        const dx = x - this.xs[lastIdx];
        const dy = y - this.ys[lastIdx];
        const dist = Math.hypot(dx, dy);

        // Snap tiny movements into the existing head to avoid extra points.
        if (dist < this.spacing * 0.35) {
            this.xs[lastIdx] = x;
            this.ys[lastIdx] = y;
            this.ts[lastIdx] = now;
            return;
        }

        // If the cursor jumps far, sprinkle minimal fill points.
        if (dist > this.spacing * 1.5) {
            const steps = Math.min(2, Math.floor(dist / this.spacing));
            const inv = 1 / (steps + 1);
            for (let i = 1; i <= steps; i++) {
                const t = inv * i;
                this._push(
                    this.xs[lastIdx] + dx * t,
                    this.ys[lastIdx] + dy * t,
                    now
                );
            }
        }

        this._push(x, y, now);
    }

    update(now = performance.now()) {
        while (this.count && now - this.ts[this.start] > this.lifetime) {
            this.start = (this.start + 1) % this.maxPoints;
            this.count--;
        }
    }

    static parseColor(color) {
        const match = color.match(/\d+(\.\d+)?/g);
        if (!match || match.length < 3) return [160, 210, 255];
        return match.slice(0, 3).map(Number);
    }

    _color(alpha) {
        const [r, g, b] = this.rgb;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    draw(ctx, now = performance.now()) {
        this.update(now);
        if (this.count < 2) return;

        const pts = [];
        for (let i = 0; i < this.count; i++) {
            const idx = this._idx(i);
            const age = (now - this.ts[idx]) / this.lifetime;
            if (age >= 1) continue;
            pts.push({ x: this.xs[idx], y: this.ys[idx] });
        }
        if (pts.length < 2) return;

        const tail = pts[0];
        const head = pts[pts.length - 1];
        const gradient = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
        gradient.addColorStop(0, this._color(0));
        gradient.addColorStop(0.18, this._color(0.35));
        gradient.addColorStop(1, this._color(0.9));

        const drawPath = (width, strokeStyle) => {
            ctx.lineWidth = width;
            ctx.strokeStyle = strokeStyle;
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length - 1; i++) {
                const midX = (pts[i].x + pts[i + 1].x) * 0.5;
                const midY = (pts[i].y + pts[i + 1].y) * 0.5;
                ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
            }
            ctx.lineTo(head.x, head.y);
            ctx.stroke();
        };

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        drawPath(this.radius * 2.6, gradient);
        drawPath(this.radius * 1.15, this._color(0.82));

        ctx.restore();
    }
}
