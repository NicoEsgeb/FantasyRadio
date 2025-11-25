class Firefly {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 1.8 + 1;
        this.alpha = 0.65 + Math.random() * 0.3;
        this.vx = (Math.random() - 0.5) * 0.05;
        this.vy = (Math.random() - 0.5) * 0.05;
        this.glowPhase = Math.random() * Math.PI * 2;
        this.glowFactor = Math.random() * 0.2 + 0.8;
        this.hue = Math.random() < 0.5 ? 180 : 50;
        this.hueColor = this.hue === 180 ? "hsl(180, 100%, 60%)" : "hsl(50, 100%, 60%)";
        this.orbitDirection = Math.random() < 0.5 ? -1 : 1;
        this.sprite = Firefly.getSprite(this.hue);

        // Wander uses a precomputed direction table to avoid per-frame trig.
        this.wanderIdx = Math.floor(Math.random() * Firefly.WANDER_TABLE_SIZE);
        this.wanderTimer = 0;
    }

    update(dt = 16) {
        const step = Math.max(8, Math.min(60, dt));

        // Wander: reuse precomputed directions, update ~every 80ms.
        this.wanderTimer -= step;
        if (this.wanderTimer <= 0) {
            this.wanderIdx = (this.wanderIdx + 1) % Firefly.WANDER_TABLE_SIZE;
            this.wanderTimer = 80 + Math.random() * 60;
        }
        const wdx = Firefly.WANDER_DIRS[this.wanderIdx * 2];
        const wdy = Firefly.WANDER_DIRS[this.wanderIdx * 2 + 1];
        const wanderMag = 0.01 * step;
        this.vx += wdx * wanderMag;
        this.vy += wdy * wanderMag;
        this.vy -= 0.00022 * step; // slow lift

        // Gentle attraction to mouse (if not too close)
        if (mouse.x && mouse.y) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let distSq = dx * dx + dy * dy;
            const range = 120;
            const rangeSq = range * range;
            if (distSq < rangeSq && distSq > 64) {
                const dist = Math.sqrt(distSq);
                const inv = 1 / (dist + 0.001);
                const strength = (1 - distSq / rangeSq) * 0.0018 * step;
                this.vx += dx * inv * strength;
                this.vy += dy * inv * strength;
            }
        }

        // Bonfire interaction: light pull + swirl towards closest bonfire.
        if (bonfires.length) {
            let closest = null;
            let minDistSq = Infinity;
            for (let b of bonfires) {
                const dx = this.x - b.x;
                const dy = this.y - b.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < minDistSq) {
                    minDistSq = d2;
                    closest = { dx, dy };
                }
            }
            const range = 180;
            const rangeSq = range * range;
            if (closest && minDistSq < rangeSq) {
                const dist = Math.sqrt(minDistSq);
                const inv = 1 / (dist + 0.001);
                const factor = (1 - minDistSq / rangeSq);
                const pull = 0.0016 * factor * step;
                const swirl = 0.0024 * factor * step * this.orbitDirection;
                const dx = closest.dx;
                const dy = closest.dy;
                this.vx += (-dx * inv) * pull + (-dy * inv) * swirl;
                this.vy += (-dy * inv) * pull + (dx * inv) * swirl;
            }
        }

        // Damping and clamp speed to keep movement smooth and cheap.
        this.vx *= 0.992;
        this.vy *= 0.992;
        const speed = Math.hypot(this.vx, this.vy);
        const maxSpeed = 0.07;
        const minSpeed = 0.012;
        if (speed > maxSpeed) {
            const s = maxSpeed / speed;
            this.vx *= s;
            this.vy *= s;
        } else if (speed < minSpeed) {
            const boost = (minSpeed - speed) * 0.35;
            this.vx += wdx * boost;
            this.vy += wdy * boost;
        }

        this.x += this.vx * step;
        this.y += this.vy * step;

        // Wrap around screen edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Normal glow pulsation (adjust as needed)
        this.glowPhase += 0.003 * step;
        this.glowFactor = 0.78 + Math.sin(this.glowPhase) * 0.22;
    }

    draw(ctx) {
        const sprite = this.sprite;
        const size = this.radius * 12;
        ctx.save();
        ctx.globalAlpha = this.alpha * this.glowFactor;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
        ctx.drawImage(sprite.canvas, this.x - size / 2, this.y - size / 2, size, size);
        ctx.restore();
    }
}

// Precompute wander directions for cheap per-frame steering.
Firefly.WANDER_TABLE_SIZE = 256;
Firefly.WANDER_DIRS = (() => {
    const arr = new Float32Array(Firefly.WANDER_TABLE_SIZE * 2);
    for (let i = 0; i < Firefly.WANDER_TABLE_SIZE; i++) {
        const angle = (i / Firefly.WANDER_TABLE_SIZE) * Math.PI * 2;
        arr[i * 2] = Math.cos(angle);
        arr[i * 2 + 1] = Math.sin(angle);
    }
    return arr;
})();

// Pre-render glow sprites so we avoid per-frame shadows and blurs.
Firefly.SPRITES = {};
Firefly.getSprite = function(hue) {
    if (Firefly.SPRITES[hue]) return Firefly.SPRITES[hue];

    const size = 48;
    const buffer = document.createElement("canvas");
    buffer.width = buffer.height = size;
    const bctx = buffer.getContext("2d");
    const g = bctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size / 2);
    g.addColorStop(0, `hsla(${hue}, 100%, 72%, 1)`);
    g.addColorStop(0.45, `hsla(${hue}, 100%, 65%, 0.65)`);
    g.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);
    bctx.fillStyle = g;
    bctx.beginPath();
    bctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    bctx.fill();

    Firefly.SPRITES[hue] = { canvas: buffer, size };
    return Firefly.SPRITES[hue];
};
