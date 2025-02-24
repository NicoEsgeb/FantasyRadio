// soundEffects.js

/* ============================================================= */
/*                    SOUND EFFECTS CLASS                      */
/* ============================================================= */
class SoundEffects {
    constructor(options = {}) {
        // Base path for audio files, default to 'assets/sounds/'
        this.basePath = options.basePath || "assets/sounds/";
        // Store audio objects by sound name for quick retrieval
        this.sounds = {};
    }

    // Retrieve or create an Audio object for a given sound
    _getSound(soundName) {
        if (!this.sounds[soundName]) {
            // Create a new Audio object with .wav extension
            const audio = new Audio(`${this.basePath}${soundName}.wav`);
            audio.loop = true; // Loop the sound indefinitely if desired
            this.sounds[soundName] = audio;
        }
        return this.sounds[soundName];
    }

    // Play the sound effect with a specified volume
    play(soundName, volume = 0.5) {
        const sound = this._getSound(soundName);
        sound.volume = volume;
        sound.play();
    }

    // Pause the sound effect
    pause(soundName) {
        const sound = this._getSound(soundName);
        sound.pause();
    }

    // Toggle playback: if paused, play; if playing, pause
    toggle(soundName, volume = 0.5) {
        const sound = this._getSound(soundName);
        if (sound.paused) {
            sound.volume = volume;
            sound.play();
        } else {
            sound.pause();
        }
    }

    // Adjust the volume of a currently loaded sound effect
    setVolume(soundName, volume) {
        const sound = this._getSound(soundName);
        sound.volume = volume;
    }

    /* ============================================================= */
    /*                PAUSE ALL SOUND EFFECTS METHOD                */
    /* ============================================================= */
    pauseAll() {
        // Iterate through each sound in our collection and pause it.
        Object.keys(this.sounds).forEach(soundName => {
            this.sounds[soundName].pause();
        });
    }
}

// If you are using ES6 modules, uncomment the export line below:
// export default SoundEffects;