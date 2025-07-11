// ------------------------- YouTube Iframe API Integration -------------------------
// We no longer use a separate "ytPlayer" variable.
// Instead, the RadioMenu creates a new YouTube player and stores it in window.currentPlayer.
// The API script (loaded in index.html) will call onYouTubeIframeAPIReady,
// but we won't use this to create the player initially.
function onYouTubeIframeAPIReady() {
    // This callback can be used if you want a default player.
    // Our code creates a new player when a YouTube radio station is selected.
}

function extractVideoID(url) {
    const parts = url.split("/embed/");
    if (parts.length > 1) {
        return parts[1].split('?')[0];
    }
    return url;
}
// ------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", function() {

    /* ============================================================= */
    /*                  AMBIENCE ASSET CONFIGURATION                 */
    /* ============================================================= */
    const ambiences = {
        1: {
            background: "assets/images/stage1_1792x1024.png",
            audio: "assets/audio/stage1_playlist.mp3",
            radios: [
                {
                    name: "Healing forest",
                    info: "Healing Forest Radio – Calm & Soothing",
                    stream: "https://www.youtube.com/embed/hLMLCPX4zyA?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Journey ahead",
                    info: "Journey Ahead Radio – A Serene Escape",
                    stream: "https://www.youtube.com/embed/vK5VwVyxkbI?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Fantasy Tavern",
                    info: "Fantasy Tavern Radio – Magical Melodies",
                    stream: "https://www.youtube.com/embed/0p6UidTS7Ao?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "A hero's Journey",
                    info: "A Hero's Journey – Epic & Soothing",
                    stream: "https://www.youtube.com/embed/RUyrgVKP6vo?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Celtic",
                    info: "Celtic Radio – Enchanting Echoes",
                    stream: "https://www.youtube.com/embed/naWrbS4EUnY?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Medieval Lofi",
                    info: "Medieval Lofi Radio - Beats to Scribe Manuscripts",
                    stream: "https://www.youtube.com/embed/IxPANmjPaek?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                }
            ],
            soundEffects: [
                { name: "Fire", sound: "fire" },
                { name: "Rain", sound: "rain" },
                { name: "Forest Surroundings", sound: "surroundings" }
            ],
            message: "Lay down your burdens, traveler. The trees will keep watch."
        },
        2: {
            background: "assets/images/stage2.png",
            audio: "assets/audio/stage2_playlist.mp3",
            radios: [
                {
                    name: "You Shall Pass",
                    info: "You Shall Pass Radio - Gandalf's Study Ambient Music",
                    stream: "https://www.youtube.com/embed/12IcBLhhxbY?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Witcher's Journey",
                    info: "Witcher's Journey Radio - Daydreaming of Persephone",
                    stream: "https://www.youtube.com/embed/cldfWgydN2Y?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Relaxing Celtic",
                    info: "Relaxing Celtic Music Radio - Celtic Spirit",
                    stream: "https://www.youtube.com/embed/B1Lp7RA4fqY?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Epic Music",
                    info: "Epic Music Radio - Epic Music VN",
                    stream: "https://www.youtube.com/embed/7uNNF6RGwM0?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Ori and the Will of the Wisps",
                    info: "Ori WoW (Not Radio) - Icelandic Overgrowth",
                    stream: "https://www.youtube.com/embed/I7830FvhQi4?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Song of the North",
                    info: "Song of the North (Not Radio) - BrunuhVille",
                    stream: "https://www.youtube.com/embed/gRuggMzH3Gw?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                }
            ],
            soundEffects: [
                { name: "Fire", sound: "fire" },
                { name: "Thunderstorm", sound: "thunderstorm" },
                { name: "Calm Forest", sound: "Deep Forest" }
            ],
            message: "Ruins watch in silence… take a moment."
        },
        3: {
            background: "assets/images/stage3.png",
            audio: "assets/audio/stage3_playlist.mp3",
            radios: [
                {
                    name: "Future Chill",
                    info: "Future Chill – Smooth futuristic vibes",
                    stream: "https://www.youtube.com/embed/sQ28KTOUgVM?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Deep Focus",
                    info: "Deep Focus – Concentrate and relax",
                    stream: "https://www.youtube.com/embed/GB6wLooVFEI?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Night Flow",
                    info: "Night Flow – Calm night tunes",
                    stream: "https://www.youtube.com/embed/qMgtHxt0XbU?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Chill Synth",
                    info: "Chill Synth – Synthwave serenity",
                    stream: "https://www.youtube.com/embed/UedTcufyrHc?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Retrowave",
                    info: "Retrowave Mix | Night Drive 80s",
                    stream: "https://www.youtube.com/embed/eliQooIjZX0?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Synthwave",
                    info: "Synthwave – Dreamy electronic",
                    stream: "https://www.youtube.com/embed/4xDzrJKXOOY?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                }
            ],
            soundEffects: [
                { name: "Fire", sound: "fire" },
                { name: "Rain", sound: "rain" },
                { name: "City Terrace", sound: "cityTerrace" }
            ],
            message: "Bright lights, dim souls… take a moment to breathe."
        },
        4: {
            background: "assets/images/stage4.png",
            audio: "assets/audio/stage4_playlist.mp3",
            radios: [
                {
                    name: "Dark Ambient Radio",
                    info: "Dark Ambient - Lofi Girl",
                    stream: "https://www.youtube.com/embed/S_MOd40zlYU?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Low Mist",
                    info: "Low Mist Var.2 – dhe Perissann",
                    stream: "https://www.youtube.com/embed/91fkcTxXkLI?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Blade Runner Radio",
                    info: "Blade Runner Radio - Ambient Music",
                    stream: "https://www.youtube.com/embed/RrkrdYm3HPQ?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Cyber Jazz/Blues",
                    info: "Cyber Jazz/Blues Radio - Ambient Music",
                    stream: "https://www.youtube.com/embed/et5HueFNjkI?autoplay=1&controls=0&modestbranding=1&rel=0x",
                    type: "youtube"
                },
                {
                    name: "It's ok, calm down",
                    info: "It's ok, calm down – liminal sorrow",
                    stream: "https://www.youtube.com/embed/AzP6YmaQNdI?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Sad Lofi",
                    info: "Sad Lofi – Lofi Girl",
                    stream: "https://www.youtube.com/embed/P6Segk8cr-c?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                }
            ],
            soundEffects: [
                { name: "Fire", sound: "fire" },
                { name: "Rain", sound: "rain" },
                { name: "Hollow", sound: "hollow" }
            ],
            message: "The world is broken, but this fire is yours—rest."
        },
        5: {
            background: "assets/images/stage5.png",
            audio: "assets/audio/stage5_playlist.mp3",
            radios: [
                {
                    name: "Japanese Lofi Radio",
                    info: "Japanese Lofi Radio – lofi geek",
                    stream: "https://www.youtube.com/embed/yr9ZxQaWkqs?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Raining in Japan",
                    info: "Raining in Japan Radio – Pluviophile Lofi",
                    stream: "https://www.youtube.com/embed/Vg13S-zzol0?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Poke Nostalgia",
                    info: "Poke Nostalgia Radio – Twinleaf Lullaby",
                    stream: "https://www.youtube.com/embed/5h5NiM39kFs?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Pokemon Lofi Beats",
                    info: "Pokemon Lofi Beats Radio – Studio Matcha Us",
                    stream: "https://www.youtube.com/embed/j5TAqVqZF6A?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Samurai Meditation",
                    info: "Samurai Meditation Radio – Emotional Music",
                    stream: "https://www.youtube.com/embed/TfYBaIsVzhs?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                },
                {
                    name: "Rainy Night in Ramen Store",
                    info: "Rainy Night Radio – Pluviophile Lofi",
                    stream: "https://www.youtube.com/embed/G-3Qmm1fXXg?autoplay=1&controls=0&modestbranding=1&rel=0",
                    type: "youtube"
                }
            ],
            soundEffects: [
                { name: "Fire", sound: "fire" },
                { name: "Rain", sound: "rain" },
                { name: "Calm Night", sound: "night" }
            ],
            message: "Stay by the fire. The world can wait."
        }
    };

    /* ============================================================= */
    /*              GLOBAL AMBIENCE & ELEMENTS SETUP                 */
    /* ============================================================= */
    let currentAmbience = ambiences[1];
    const ambienceBackground = document.querySelector(".stage-background");
    const radioAudio = document.getElementById("radio-audio");
    const ambienceButtons = document.querySelectorAll(".stage-btn");
    const starsContainer = document.querySelector(".stars-container");
    const seeRadiosBtn = document.getElementById("see-radios-btn");
    const customPlayBtn = document.getElementById("custom-play");

    // Global flags for radio selection and playing state.
    window.currentStationType = "audio";
    window.currentYouTubeStream = null;
    window.isPlaying = false;
    customPlayBtn.textContent = "Play";

    /* ============================================================= */
    /*       INSTANTIATE SOUND EFFECTS MANAGER GLOBALLY              */
    /* ============================================================= */
    let soundEffectsManager = new SoundEffects({ basePath: "assets/sounds/" });

    /* ============================================================= */
    /*          UPDATE SOUND EFFECTS MENU DYNAMICALLY                */
    /* ============================================================= */
    function updateSoundEffectsMenu(ambienceData) {
        const menu = document.getElementById("sound-effects-menu");
        menu.innerHTML = "";
        if (ambienceData.soundEffects && ambienceData.soundEffects.length > 0) {
            ambienceData.soundEffects.forEach(effect => {
                const effectDiv = document.createElement("div");
                effectDiv.className = "sound-effect";
                const btn = document.createElement("button");
                btn.className = "sound-btn";
                btn.setAttribute("data-sound", effect.sound);
                btn.textContent = effect.name;
                const volumeInput = document.createElement("input");
                volumeInput.className = "sound-volume";
                volumeInput.setAttribute("data-sound", effect.sound);
                volumeInput.setAttribute("type", "range");
                volumeInput.setAttribute("min", "0");
                volumeInput.setAttribute("max", "1");
                volumeInput.setAttribute("step", "0.01");
                volumeInput.value = "0.5";
                effectDiv.appendChild(btn);
                effectDiv.appendChild(volumeInput);
                menu.appendChild(effectDiv);
            });
        }
        addSoundEffectListeners();
    }

    /* ============================================================= */
    /*         ATTACH SOUND EFFECTS EVENT LISTENERS FUNCTION         */
    /* ============================================================= */
    function addSoundEffectListeners() {
        const soundButtons = document.querySelectorAll(".sound-btn");
        const volumeInputs = document.querySelectorAll(".sound-volume");
        soundButtons.forEach(btn => {
            btn.addEventListener("click", function() {
                const soundName = this.getAttribute("data-sound");
                const volumeInput = document.querySelector(`.sound-volume[data-sound="${soundName}"]`);
                const volume = volumeInput ? parseFloat(volumeInput.value) : 0.5;
                soundEffectsManager.toggle(soundName, volume);
                this.classList.toggle("active");
            });
        });
        volumeInputs.forEach(input => {
            input.addEventListener("input", function() {
                const soundName = this.getAttribute("data-sound");
                const volume = parseFloat(this.value);
                soundEffectsManager.setVolume(soundName, volume);
            });
        });
    }

    /* ============================================================= */
    /*                    LOAD AMBIENCE FUNCTION                     */
    /* ============================================================= */
    function loadAmbience(ambienceNum) {
        const ambienceData = ambiences[ambienceNum];
        if (ambienceData) {
            currentAmbience = ambienceData;
            ambienceBackground.style.backgroundImage = `url('${ambienceData.background}')`;
            document.getElementById("ambience-message").textContent = ambienceData.message;
            if (!window.radioSelected) {
                radioAudio.src = ambienceData.audio;
            }
            if (window.isPlaying) {
                radioAudio.play();
                customPlayBtn.textContent = "Pause";
            } else {
                radioAudio.pause();
                customPlayBtn.textContent = "Play";
            }
            if (!window.radioSelected) {
                window.currentStationType = "audio";
                window.currentYouTubeStream = null;
            }
            soundEffectsManager.pauseAll();
            updateSoundEffectsMenu(ambienceData);
            if (document.getElementById("radio-menu").classList.contains("show")) {
                window.radioMenu.populate(ambienceData.radios);
            }
        }
        starsContainer.style.display = (ambienceNum === "1" || ambienceNum === 1) ? "block" : "none";
    }
    loadAmbience("1");

    /* ============================================================= */
    /*           AMBIENCE BUTTONS EVENT LISTENERS SETUP              */
    /* ============================================================= */
    ambienceButtons.forEach(function(btn) {
        btn.addEventListener("click", function() {
            const ambienceNum = this.getAttribute("data-ambience");
            loadAmbience(ambienceNum);
        });
    });

    /* ============================================================= */
    /*           FIREFLIES, BONFIRES, RAIN & MOUSE TRAIL SETUP       */
    /* ============================================================= */
    const canvas = document.getElementById("fireflies-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.pointerEvents = 'none';
    window.canvas = canvas;
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    let fireflies = [];
    let bonfires = [];
    let rainParticles = [];
    const mouseTrail = new MouseTrail({ lifetime: 400, radius: 13 });
    let mouse = { x: null, y: null, radius: 13 };
    window.mouse = mouse;
    window.bonfires = bonfires;
    window.addEventListener("mousemove", event => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouseTrail.addPoint(event.clientX, event.clientY);
    });
    document.addEventListener("click", (event) => {
        if (event.target.closest(".interactive")) return;
        bonfires.push(new Bonfire(event.clientX, event.clientY));
    });
    for (let i = 0; i < 70; i++) {
        fireflies.push(new Firefly());
    }
    for (let i = 0; i < 100; i++) {
        rainParticles.push(new Rain());
    }

    /* ============================================================= */
    /*                      ANIMATION LOOP                           */
    /* ============================================================= */
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (mouse.x && mouse.y) {
            mouseTrail.draw(ctx);
        }
        // Draw rain only if the "Rain" or "Thunderstorm" button is active.
        const rainButton = document.querySelector(".sound-btn[data-sound='rain']");
        const thunderButton = document.querySelector(".sound-btn[data-sound='thunderstorm']");
        if (
            (rainButton && rainButton.classList.contains("active")) ||
            (thunderButton && thunderButton.classList.contains("active"))
        ) {
            for (let rain of rainParticles) {
                rain.update();
                rain.draw(ctx);
            }
        }
        for (let i = bonfires.length - 1; i >= 0; i--) {
            bonfires[i].update();
            bonfires[i].draw(ctx);
            if (bonfires[i].expired()) {
                bonfires.splice(i, 1);
            }
        }
        for (let firefly of fireflies) {
            firefly.update();
            firefly.draw(ctx);
        }
        requestAnimationFrame(animate);
    }
    animate();

    /* ============================================================= */
    /*           RADIO MENU TOGGLE & INTERACTION SETUP               */
    /* ============================================================= */
    seeRadiosBtn.addEventListener("click", () => {
        window.radioMenu.show(currentAmbience.radios);
    });

    /* ============================================================= */
    /*         CUSTOM PLAY/PAUSE BUTTON FUNCTIONALITY                */
    /* ============================================================= */
    customPlayBtn.addEventListener("click", () => {
        if (!window.radioSelected) {
            alert("Please select a radio station first.");
            return;
        }
        if (window.currentStationType === "youtube") {
            if (window.currentPlayer) {
                if (customPlayBtn.textContent === "Pause") {
                    window.currentPlayer.pauseVideo();
                    customPlayBtn.textContent = "Play";
                    window.isPlaying = false;
                } else {
                    window.currentPlayer.playVideo();
                    customPlayBtn.textContent = "Pause";
                    window.isPlaying = true;
                }
            } else {
                alert("YouTube player not ready yet.");
            }
        } else {
            if (radioAudio.paused) {
                radioAudio.play();
                customPlayBtn.textContent = "Pause";
                window.isPlaying = true;
            } else {
                radioAudio.pause();
                customPlayBtn.textContent = "Play";
                window.isPlaying = false;
            }
        }
    });

    /* ============================================================= */
    /*       RADIO VOLUME CONTROL (Using YouTube API or Audio)       */
    /* ============================================================= */
    const radioVolumeSlider = document.getElementById("volume-slider");
    radioVolumeSlider.addEventListener("input", function() {
        const vol = parseInt(this.value);
        if (window.currentStationType === "youtube" && window.currentPlayer && window.currentPlayer.setVolume) {
            window.currentPlayer.setVolume(vol);
        } else {
            radioAudio.volume = vol / 100;
        }
    });

    /* ============================================================= */
    /*                 INITIALIZE AUDIO VISUALIZER                   */
    /* ============================================================= */
    const visualizerCanvas = document.getElementById("visualizer-canvas");
    new Visualizer(visualizerCanvas, document.getElementById("radio-audio"));
});