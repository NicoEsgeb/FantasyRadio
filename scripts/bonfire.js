

class Ember {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.life = Math.random() * 1000 + 500;
        this.startTime = Date.now();
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -Math.random() * 1.5 - 0.5;
        this.hue = 30 + Math.random() * 30;
        this.alpha = 1;
        this.expired = false;
    }

    update() {
        let elapsed = Date.now() - this.startTime;
        if (elapsed > this.life) {
            this.expired = true;
            return;
        }
        this.x += this.vx;
        this.y += this.vy;
        this.alpha = 1 - elapsed / this.life;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        let color = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
        ctx.fillStyle = color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
        ctx.fill();
    }
}

class Bonfire {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.startTime = Date.now();
        this.duration = 3000;
        this.particles = [];
        for (let i = 0; i < 30; i++) {
            this.particles.push(new Ember(this.x, this.y));
        }
    }

    update() {
        for (let ember of this.particles) {
            ember.update();
        }
        if (Math.random() < 0.1) {
            this.particles.push(new Ember(this.x, this.y));
        }
        this.particles = this.particles.filter(p => !p.expired);
    }

    draw(ctx) {
        for (let ember of this.particles) {
            ember.draw(ctx);
        }
    }

    expired() {
        return Date.now() - this.startTime > this.duration;
    }
}