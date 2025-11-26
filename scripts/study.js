document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("study-tools-btn");
    const drawer = document.getElementById("study-drawer");
    if (!toggleBtn || !drawer) return;

    const closeBtn = document.getElementById("study-close");
    const modeLabel = document.getElementById("study-mode-label");
    const timeEl = document.getElementById("study-time");
    const progressEl = document.getElementById("study-progress");
    const statusEl = document.getElementById("study-status");
    const cycleEl = document.getElementById("study-cycle");
    const modeButtons = Array.from(document.querySelectorAll(".study-mode-btn"));
    const startBtn = document.getElementById("study-start");
    const resetBtn = document.getElementById("study-reset");
    const presetButtons = Array.from(document.querySelectorAll(".preset-chip"));
    const autoNextToggle = document.getElementById("study-auto-next");
    const chimeToggle = document.getElementById("study-chime");
    const noteArea = document.getElementById("study-note");
    const ritualInputs = Array.from(document.querySelectorAll(".ritual input[type='checkbox']"));

    const sliders = [
        { input: document.getElementById("focus-length"), valueEl: document.getElementById("focus-value"), key: "focus", suffix: "m" },
        { input: document.getElementById("short-length"), valueEl: document.getElementById("short-value"), key: "short", suffix: "m" },
        { input: document.getElementById("long-length"), valueEl: document.getElementById("long-value"), key: "long", suffix: "m" }
    ];
    const longFrequencyInput = document.getElementById("long-frequency");
    const longFrequencyValue = document.getElementById("long-frequency-value");

    const storageKey = "study-tools-settings";
    const defaultSettings = {
        focus: 25,
        short: 5,
        long: 15,
        longFrequency: 4,
        autoNext: true,
        chime: true,
        note: "",
        rituals: { hydrate: false, stretch: false, plan: false }
    };

    let settings = loadSettings();
    let timerId = null;
    let audioCtx = null;
    const state = {
        mode: "focus",
        duration: settings.focus * 60,
        timeLeft: settings.focus * 60,
        cycle: 1,
        completedFocus: 0,
        running: false
    };

    function loadSettings() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey));
            return { ...defaultSettings, ...saved, rituals: { ...defaultSettings.rituals, ...(saved?.rituals || {}) } };
        } catch (e) {
            console.warn("Study tools settings unavailable", e);
            return { ...defaultSettings };
        }
    }

    function saveSettings() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(settings));
        } catch (e) {
            console.warn("Unable to persist study tools settings", e);
        }
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.max(0, seconds % 60);
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    function getMinutesForMode(mode) {
        if (mode === "short") return settings.short;
        if (mode === "long") return settings.long;
        return settings.focus;
    }

    function modeLabelText(mode) {
        if (mode === "short") return "Short break";
        if (mode === "long") return "Long break";
        return "Focus";
    }

    function updateCycleLabel() {
        cycleEl.textContent = `Cycle ${state.cycle}`;
    }

    function updateStatus(text) {
        statusEl.textContent = text;
    }

    function updateProgress() {
        if (!state.duration) return;
        const progress = Math.min(1, Math.max(0, (state.duration - state.timeLeft) / state.duration));
        progressEl.style.width = `${progress * 100}%`;
    }

    function updateDisplay() {
        timeEl.textContent = formatTime(state.timeLeft);
        updateProgress();
    }

    function updateModeButtons() {
        modeButtons.forEach(btn => {
            const isActive = btn.dataset.mode === state.mode;
            btn.classList.toggle("active", isActive);
        });
    }

    function pauseTimer(setStatus = true) {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        state.running = false;
        const resumeText = state.timeLeft < state.duration ? "Resume" : "Start";
        startBtn.textContent = resumeText;
        if (setStatus) {
            updateStatus(resumeText === "Resume" ? "Paused" : "Ready");
        }
    }

    function setMode(mode, opts = {}) {
        if (!opts.skipPause) pauseTimer(false);
        if (opts.resetCycle) {
            state.cycle = 1;
            state.completedFocus = 0;
        }
        if (opts.advanceCycle) {
            state.cycle += 1;
        }
        state.mode = mode;
        state.duration = getMinutesForMode(mode) * 60;
        state.timeLeft = state.duration;

        modeLabel.textContent = modeLabelText(mode);
        updateModeButtons();
        updateCycleLabel();
        updateDisplay();
        startBtn.textContent = "Start";
        updateStatus(opts.statusText || "Ready");
    }

    function playChime() {
        if (!settings.chime) return;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.1);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 1.2);
        } catch (e) {
            console.warn("Chime unavailable", e);
        }
    }

    function finishBlock() {
        pauseTimer(false);
        playChime();
        let nextMode = "focus";
        if (state.mode === "focus") {
            state.completedFocus += 1;
            const longBreakDue = state.completedFocus % settings.longFrequency === 0;
            nextMode = longBreakDue ? "long" : "short";
            updateStatus("Focus wrapped");
        } else {
            nextMode = "focus";
            updateStatus("Break complete");
        }
        setMode(nextMode, { advanceCycle: true, statusText: nextMode === "focus" ? "Ready to focus" : "Take a breath", skipPause: true });
        if (settings.autoNext) {
            startTimer();
        }
    }

    function tick() {
        state.timeLeft -= 1;
        if (state.timeLeft <= 0) {
            state.timeLeft = 0;
            updateDisplay();
            finishBlock();
            return;
        }
        updateDisplay();
    }

    function startTimer() {
        if (state.running) return;
        state.running = true;
        startBtn.textContent = "Pause";
        updateStatus("In progress");
        timerId = setInterval(tick, 1000);
    }

    function resetTimer() {
        pauseTimer(false);
        setMode("focus", { resetCycle: true, statusText: "Ready" });
    }

    function applySettingsToUI() {
        sliders.forEach(({ input, valueEl, key, suffix }) => {
            if (!input || !valueEl) return;
            input.value = settings[key];
            valueEl.textContent = `${settings[key]}${suffix}`;
        });
        longFrequencyInput.value = settings.longFrequency;
        longFrequencyValue.textContent = `${settings.longFrequency} cycles`;
        autoNextToggle.checked = settings.autoNext;
        chimeToggle.checked = settings.chime;
        noteArea.value = settings.note || "";
        ritualInputs.forEach(input => {
            const ritualKey = input.dataset.ritual;
            input.checked = Boolean(settings.rituals[ritualKey]);
            input.parentElement.classList.toggle("checked", input.checked);
        });
    }

    function handleSliderChange(slider) {
        const val = parseInt(slider.input.value, 10);
        settings[slider.key] = val;
        slider.valueEl.textContent = `${val}${slider.suffix}`;
        saveSettings();
        if (state.mode === slider.key) {
            setMode(state.mode, { statusText: "Updated" });
        }
    }

    function handlePreset(button) {
        const f = parseInt(button.dataset.focus, 10);
        const s = parseInt(button.dataset.short, 10);
        const l = parseInt(button.dataset.long, 10);
        settings.focus = f;
        settings.short = s;
        settings.long = l;
        saveSettings();
        applySettingsToUI();
        setMode("focus", { statusText: "Preset loaded", resetCycle: true });
    }

    toggleBtn.addEventListener("click", () => {
        drawer.classList.toggle("open");
        toggleBtn.setAttribute("aria-pressed", drawer.classList.contains("open"));
    });

    closeBtn.addEventListener("click", () => {
        drawer.classList.remove("open");
        toggleBtn.setAttribute("aria-pressed", "false");
    });

    startBtn.addEventListener("click", () => {
        if (state.running) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    resetBtn.addEventListener("click", resetTimer);

    modeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const mode = btn.dataset.mode;
            setMode(mode, { statusText: "Ready" });
        });
    });

    presetButtons.forEach(btn => {
        btn.addEventListener("click", () => handlePreset(btn));
    });

    sliders.forEach(slider => {
        slider.input.addEventListener("input", () => handleSliderChange(slider));
    });

    longFrequencyInput.addEventListener("input", () => {
        const val = parseInt(longFrequencyInput.value, 10);
        settings.longFrequency = val;
        longFrequencyValue.textContent = `${val} cycles`;
        saveSettings();
    });

    autoNextToggle.addEventListener("change", () => {
        settings.autoNext = autoNextToggle.checked;
        saveSettings();
    });

    chimeToggle.addEventListener("change", () => {
        settings.chime = chimeToggle.checked;
        saveSettings();
    });

    noteArea.addEventListener("input", () => {
        settings.note = noteArea.value;
        saveSettings();
    });

    ritualInputs.forEach(input => {
        input.addEventListener("change", () => {
            const ritualKey = input.dataset.ritual;
            settings.rituals[ritualKey] = input.checked;
            input.parentElement.classList.toggle("checked", input.checked);
            saveSettings();
        });
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            drawer.classList.remove("open");
            toggleBtn.setAttribute("aria-pressed", "false");
        }
    });

    applySettingsToUI();
    setMode("focus", { resetCycle: true, statusText: "Ready" });
});
