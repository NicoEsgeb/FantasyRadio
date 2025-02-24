class Firefly {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2.5 + 1;
        this.alpha = Math.random() * 0.5 + 0.5;
        // Initial organic speeds (used via noise offsets)
        this.noiseOffsetX = Math.random() * 1000;
        this.noiseOffsetY = Math.random() * 1000;
        this.glowFactor = Math.random() * 0.2 + 0.8;
        this.hue = Math.random() < 0.5 ? 180 : 50;
        // Random orbit direction: -1 for clockwise, 1 for anticlockwise.
        this.orbitDirection = Math.random() < 0.5 ? -1 : 1;
    }

    update() {
        // Organic floating motion (using noise)
        this.noiseOffsetX += 0.002;
        this.noiseOffsetY += 0.002;
        this.x += Math.cos(this.noiseOffsetX) * 0.5;
        this.y += Math.sin(this.noiseOffsetY) * 0.5;

        // Gentle attraction to mouse (if not too close)
        if (mouse.x && mouse.y) {
            let dx = this.x - mouse.x;
            let dy = this.y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius && distance > 10) {
                let angle = Math.atan2(dy, dx);
                let force = (mouse.radius - distance) / mouse.radius;
                this.x -= Math.cos(angle) * force * 0.5;
                this.y -= Math.sin(angle) * force * 0.5;
            }
        }

        // Bonfire interaction: if near an active bonfire, apply orbital forces
        for (let bonfire of bonfires) {
            let dx = this.x - bonfire.x;
            let dy = this.y - bonfire.y;
            let d = Math.sqrt(dx * dx + dy * dy);
            if (d < 150) {
                // Calculate a factor that grows as the firefly gets closer to the bonfire
                let factor = (150 - d) / 150;
                // Gravitational (radial) force pulling toward the bonfire:
                let kGrav = 0.05 * factor; // Increase for a stronger pull
                let forceGravX = -dx * kGrav;
                let forceGravY = -dy * kGrav;
                // Tangential force: compute the perpendicular vector (-dy/d, dx/d)
                // Multiply by a coefficient to get a fast, swirling orbit.
                let kTang = 0.1 * factor; // Base tangential coefficient
                let forceTangX = (-dy / d) * kTang * this.orbitDirection;
                let forceTangY = (dx / d) * kTang * this.orbitDirection;

                // Total force is the sum of radial and tangential forces.
                // Multiply tangential force further for a more pronounced orbit effect.
                this.x += forceGravX + forceTangX * 2.5;
                this.y += forceGravY + forceTangY * 2.5;
            }
        }

        // Wrap around screen edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Normal glow pulsation (adjust as needed)
        this.glowFactor = 0.8 + Math.sin(Date.now() * 0.002 + this.noiseOffsetX) * 0.2;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        let glowColor = `hsla(${this.hue}, 100%, 60%, ${this.alpha * this.glowFactor})`;
        ctx.fillStyle = glowColor;
        ctx.shadowBlur = 15;
        ctx.shadowColor = glowColor;
        ctx.fill();
    }
}