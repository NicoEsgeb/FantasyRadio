class Visualizer {
    constructor(canvasElement, audioElement, options = {}) {
        if (!canvasElement || !audioElement) return;

        this.config = {
            scale: 1.0,
            position: 'bottom',
            waveIntensity: 1.0,
            glowStrength: 1.0,
            lineThickness: 1.0,
            hueSpeed: 0.2,
            colorSaturation: 70,
            waveOpacity: 0.8,
            pauseGlowIntensity: 1.0,  // New parameter for pause glow
            ...options
        };

        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.audio = audioElement;
        this.phase = 0;
        this.hueShift = 0;

        // Canvas styling
        this.canvas.style.background = 'transparent';
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = '0';
        this.canvas.style.right = '0';
        this.setPosition(this.config.position);

        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }

    setPosition(position) {
        const positions = {
            'top': { top: '0', bottom: 'auto' },
            'middle': {
                top: '50%',
                bottom: 'auto',
                transform: 'translateY(-50%)'
            },
            'bottom': { top: 'auto', bottom: '0' }
        };
        Object.assign(this.canvas.style, positions[position] || positions['bottom']);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight * 0.3 * this.config.scale;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.phase += 0.03;
        this.hueShift += this.config.hueSpeed;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const midY = this.canvas.height / 2;

        if (!window.isPlaying) {
            // Enhanced pause mode visualization
            const pulse = Math.sin(Date.now() * 0.005) * 20 * this.config.scale;
            const baseSize = 50 * this.config.scale;

            // Main glowing core
            this.ctx.beginPath();
            this.ctx.fillStyle = `hsla(180, 95%, 70%, ${0.5 * this.config.pauseGlowIntensity})`;
            this.ctx.arc(this.canvas.width/2, midY, baseSize + pulse, 0, Math.PI * 2);
            this.ctx.filter = `blur(${15 * this.config.scale}px) brightness(1.5)`;
            this.ctx.fill();

            // Outer glow layer
            this.ctx.beginPath();
            this.ctx.fillStyle = `hsla(180, 80%, 60%, ${0.3 * this.config.pauseGlowIntensity})`;
            this.ctx.arc(this.canvas.width/2, midY, baseSize + pulse * 1.5, 0, Math.PI * 2);
            this.ctx.filter = `blur(${30 * this.config.scale}px)`;
            this.ctx.fill();

            // Solid center core
            this.ctx.beginPath();
            this.ctx.fillStyle = `hsla(180, 100%, 80%, 0.9)`;
            this.ctx.arc(this.canvas.width/2, midY, baseSize * 0.3, 0, Math.PI * 2);
            this.ctx.filter = 'none';
            this.ctx.fill();

            // Reset filter
            this.ctx.filter = 'none';
            return;
        }

        const time = Date.now() * 0.002;
        const waveCount = 3;
        const baseHue = 180 + Math.sin(this.hueShift * 0.5) * 30;

        for (let wave = 0; wave < waveCount; wave++) {
            this.ctx.beginPath();

            for (let x = 0; x <= this.canvas.width; x += 10) {
                const y = midY +
                    Math.sin(time * (1 + wave/2) + x * 0.02) *
                    15 * this.config.waveIntensity * Math.sin(this.phase) +
                    Math.cos(time * 0.7 + x * 0.015 * wave) * 10;

                if (x === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }

            const hue = Math.min(220, baseHue + wave * 15);
            const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
            gradient.addColorStop(0, `hsla(
                ${hue}, 
                ${this.config.colorSaturation}%, 
                60%, 
                ${this.config.waveOpacity}
            )`);
            gradient.addColorStop(1, `hsla(
                ${Math.min(220, hue + 30)}, 
                ${this.config.colorSaturation}%, 
                60%, 
                ${this.config.waveOpacity}
            )`);

            this.ctx.shadowColor = `hsla(
                ${hue}, 
                ${this.config.colorSaturation}%, 
                70%, 
                0.4
            )`;
            this.ctx.shadowBlur = 30 * this.config.glowStrength;

            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = (8 - wave * 1.5) * this.config.lineThickness * this.config.scale;
            this.ctx.stroke();

            // Fill below wave
            this.ctx.lineTo(this.canvas.width, this.canvas.height);
            this.ctx.lineTo(0, this.canvas.height);
            this.ctx.closePath();
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = 0.3;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }

        // Background glow
        const beamGradient = this.ctx.createRadialGradient(
            this.canvas.width/2, midY, 0,
            this.canvas.width/2, midY, 300 * this.config.scale
        );
        beamGradient.addColorStop(0, `hsla(
            ${baseHue}, 
            ${this.config.colorSaturation}%, 
            70%, 
            ${this.config.waveOpacity * 0.5}
        )`);
        beamGradient.addColorStop(1, `hsla(
            ${baseHue + 30}, 
            ${this.config.colorSaturation}%, 
            70%, 
            0
        )`);

        this.ctx.fillStyle = beamGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.shadowBlur = 0;
    }
}

window.Visualizer = Visualizer;