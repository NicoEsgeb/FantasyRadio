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


// background.js
// ---------------------------------------------------
// ---------------- PARALLAX BACKGROUND --------------
// ---------------------------------------------------

// Globals: sprite sheet + frame metadata
let spriteSheet;
let bgFrames = [];

function preloadBackgroundImages() {
    spriteSheet = loadImage('assets/backgroundAssets/layers26UltraLowTest.webp');

    const totalFrames = 26;
    const cellW = 60, cellH = 36;
    for (let i = 0; i < totalFrames; i++) {
        const col = i % 5;
        const row = floor(i / 5);
        const sx = col * cellW + 0.5;
        const sy = row * cellH + 0.5;
        bgFrames.push({ sx, sy, sw: cellW - 1, sh: cellH - 1 });
    }
}

class Background {
    constructor() {
        this.sprite      = spriteSheet;
        this.frames      = bgFrames;
        this.baseWidth   = 1800;
        this.yOffset     = 200;
        this.layerWidth  = 1200;
        this.layerHeight = 720;

        //----- Constants for different layers -----------------------------------
        //--todo: ADD AND TEST A BLURRY CONSTANT ------------------
        const speeds    = [0.8,0.75,0.45,0.24,0.22,0.2,0.18,0.12,0.11,0.09,0.086,0.054,0.053,0.05,0.032,0.03,0.008,0.008,0.007,0.0065,0.006,0.004,0.004,0.004,0.004,0.00000001];
        const sizeFacts = [1,1,0.7,0.54,0.5,0.47,0.45,0.33,0.32,0.31,0.3,0.13,0.11,0.09,0.07,0.06,0.07,0.023,0.02,0.018,0.016,0.015,0.015,0.01,0.01,0];
        const yFacts    = [1.5,1.4,1,0.89,0.87,0.84,0.81,0.75,0.75,0.70,0.68,0.62,0.60,0.58,0.54,0.52,0.34,0.23,0.18,0.16,0.15,0.04,0.04,0.04,0.04,0];
        const anchors   = [
            {x:600,y:520},{x:600,y:525},{x:650,y:500},{x:600,y:435},{x:600,y:460},
            {x:534,y:459},{x:600,y:458},{x:600,y:386},{x:170,y:450},{x:723,y:370},
            {x:600,y:430},{x:615,y:320},{x:870,y:350},{x:296,y:380},{x:600,y:320},
            {x:170,y:380},{x:296,y:312},{x:600,y:370},{x:615,y:290},{x:870,y:285},
            {x:296,y:340},{x:600,y:230},{x:200,y:220},{x:870,y:150},{x:870,y:320},
            {x:870,y:70}
        ];
        const logicals = [
            1200,1200,1200,2200,1200,2200,2200,2200,1200,2200,
            1200,2200,2200,1200,2200,1200,2200,2200,2200,1200,
            2200,2200,2200,1200,1200,1200
        ];

        //------Layers that always tile-------------------------------------
        const tileIndices = [0,1,2,4,6,8,10,13,15,17,20,24,25];
        const tilesArr = Array(this.frames.length).fill(false);
        tileIndices.forEach(i => tilesArr[i] = true);

        //------Build an array of layer objects-----------------------------
        this.layers = this.frames.map((meta,i) => ({
            meta,
            speed:        speeds[i],
            sizeFactor:   sizeFacts[i],
            yFactor:      yFacts[i],
            anchor:       anchors[i],
            logicalWidth: logicals[i],
            tile:         tilesArr[i],
            xOffset:      random(0, 1200)
        }));

        //--------Offscreen cache-----------------
        this.cache         = createGraphics(width, height);
        this.cache.noSmooth();
        this.cacheInterval = 30;   // ms
        this.lastCacheTime = 0;
        this.lastDrawZoom  = NaN;
    }

    update(floorSpeed, zoom) {
        //----NBo updates when pausingg-=----------
        if (floorSpeed === 0) return;

        const scaleF = width / this.baseWidth;
        for (let L of this.layers) {
            const sizeScale = 1 + (zoom - 1) * L.sizeFactor;
            let x = L.xOffset - floorSpeed * L.speed * sizeScale;

            // ---- Thw wrappingg --------------------------------------
            const finalW = L.logicalWidth * scaleF * sizeScale;
            const half   = finalW / 2;
            if (x < -half)      x += finalW;
            else if (x >  half) x -= finalW;

            L.xOffset = x;
        }
    }

    redrawCache(zoom) {
        this.cache.clear();
        const scaleF = width / this.baseWidth;

        // draw back‑to‑front
        for (let i = this.layers.length - 1; i >= 0; i--) {
            const L = this.layers[i];
            const sizeScale = 1 + (zoom - 1) * L.sizeFactor;
            const overall   = scaleF * sizeScale;

            //---- Anchor + Y offset --------------------------------
            const ax = L.anchor.x * scaleF + L.xOffset;
            const ay = L.anchor.y * scaleF + this.yOffset
                + L.yFactor * (1 - zoom) * 100;

            this.cache.push();
            this.cache.translate(ax, ay);
            this.cache.scale(overall);
            this.cache.translate(-this.layerWidth / 2, -this.layerHeight / 2);

            //-----Tilling with the copies (2 seems fine)---------------
            const gap     = (zoom < 1 && !L.tile)
                ? this.layerWidth * (1 - sizeScale)
                : 0;
            const spacing = L.logicalWidth + gap;
            const copies  = (zoom < 1 && !L.tile)
                ? 1
                : Math.ceil((width / overall) / L.logicalWidth) + 2;

            for (let dx = -copies; dx <= copies; dx++) {
                this.cache.image(
                    this.sprite,
                    dx * spacing, 0,
                    this.layerWidth, this.layerHeight,
                    L.meta.sx, L.meta.sy, L.meta.sw, L.meta.sh
                );
            }
            this.cache.pop();
        }
    }

    draw(zoom, floorSpeed) {
        //----- Pausing... keeping the zoom -----------------
        if (floorSpeed === 0 && zoom === this.lastDrawZoom) {
            image(this.cache, 0, 0, width, height);
            return;
        }

        //------ Redrawing the cache ----------------------------
        if (millis() - this.lastCacheTime > this.cacheInterval) {
            this.redrawCache(zoom);
            this.lastCacheTime = millis();
        }

        this.lastDrawZoom = zoom;
        image(this.cache, 0, 0, width, height);
    }
}