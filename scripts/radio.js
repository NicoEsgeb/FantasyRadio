/* ============================================================= */
/*                        RADIO MENU CLASS                       */
/* ============================================================= */
class RadioMenu {
    constructor(menuId, closeBtnId, listId) {
        // Get main DOM elements for the radio menu
        this.menu = document.getElementById(menuId);
        this.closeBtn = document.getElementById(closeBtnId);
        this.listContainer = document.getElementById(listId);

        // Get the audio element (for standard streams) and the iframe container (for YouTube streams)
        this.audioPlayer = document.getElementById("radio-audio");
        this.iframeContainer = document.getElementById("radio-iframe-container");

        // Attach event to close the menu
        this.closeBtn.addEventListener("click", () => {
            this.hide();
        });

        // Attach event listener to the volume slider (controls overall radio volume)
        const volumeSlider = document.getElementById("volume-slider");
        volumeSlider.addEventListener("input", function() {
            const vol = parseInt(volumeSlider.value);
            // For YouTube streams, use the YouTube API method to set volume
            if (window.currentStationType === "youtube" && window.currentPlayer) {
                window.currentPlayer.setVolume(vol);
            } else {
                // For standard audio, the volume property ranges from 0.0 to 1.0
                document.getElementById("radio-audio").volume = vol / 100;
            }
        });
    }

    /* ============================================================= */
    /*                    POPULATE STATION LIST                      */
    /* ============================================================= */
    populate(stations) {
        // Clear previous list
        this.listContainer.innerHTML = "";

        stations.forEach(station => {
            // Create a container div for each station entry with flex layout
            let container = document.createElement("div");
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.style.justifyContent = "space-between";
            container.style.marginBottom = "8px"; // spacing between entries

            // Create the main station button
            let btn = document.createElement("button");
            btn.textContent = station.name;
            btn.style.flexGrow = "1"; // let the button take available space

            // When the station button is clicked:
            btn.addEventListener("click", () => {
                // Stop any current stream
                this.audioPlayer.pause();
                this.audioPlayer.currentTime = 0;
                this.audioPlayer.src = "";
                this.iframeContainer.innerHTML = "";

                // If there is an existing YouTube player, destroy it
                if (window.currentPlayer && typeof window.currentPlayer.destroy === "function") {
                    window.currentPlayer.destroy();
                    window.currentPlayer = null;
                }

                // Store the current station type globally
                window.currentStationType = station.type || "audio";
                if (station.type === "youtube") {
                    window.currentYouTubeStream = station.stream;
                } else {
                    window.currentYouTubeStream = null;
                }

                // If no stream is provided, do nothing further
                if (!station.stream) {
                    this.highlightButton(null);
                    return;
                }

                /* ----- Load the new stream based on its type ----- */
                if (station.type === "youtube") {
                    // For YouTube streams, hide the audio element
                    this.audioPlayer.style.display = "none";
                    // Create a container for the YouTube player
                    this.iframeContainer.innerHTML = '<div id="youtube-player"></div>';
                    // Extract the video ID from the embed URL using our helper function
                    const videoId = getYouTubeVideoID(station.stream);
                    // Create the YouTube player (hidden, as we only need audio)
                    window.currentPlayer = new YT.Player('youtube-player', {
                        height: '0',  // Hide video
                        width: '0',
                        videoId: videoId,
                        playerVars: {
                            autoplay: 1,
                            controls: 0,
                            modestbranding: 1,
                            rel: 0
                        },
                        events: {
                            'onReady': (event) => {
                                // Set the volume based on the volume slider value
                                const vol = parseInt(document.getElementById("volume-slider").value);
                                event.target.setVolume(vol);
                                event.target.playVideo();
                            }
                        }
                    });
                    this.iframeContainer.style.display = "block";
                } else {
                    // For standard streams, hide the iframe and use the audio element
                    this.iframeContainer.style.display = "none";
                    this.audioPlayer.style.display = "block";
                    this.audioPlayer.src = station.stream;
                    this.audioPlayer.play();
                }

                // Set global flags: a radio is selected and music is playing
                window.radioSelected = true;
                window.isPlaying = true;
                // Update the custom play button text
                document.getElementById("custom-play").textContent = "Pause";

                // Highlight the active station button
                this.highlightButton(btn);

                // Update the current radio info with our custom info text;
                // If station.info is not provided, use station.name as fallback.
                document.getElementById("current-radio-info").textContent = station.info || station.name;
            });

            // Append the station button to the container
            container.appendChild(btn);

            // If the station is a YouTube station, add a tiny glowing circle link at the right
            if (station.type === "youtube") {
                let link = document.createElement("a");
                link.href = station.stream;
                link.target = "_blank";
                // Use a Unicode circle as the icon
                link.textContent = "◉";
                // Add the "radio-link" class for glowing styling (defined in radio.css)
                link.className = "radio-link";
                // Prevent the link click from triggering the main button click
                link.addEventListener("click", function(e) {
                    e.stopPropagation();
                });
                container.appendChild(link);
            }

            // Append the entire container to the radio list
            this.listContainer.appendChild(container);

            // Optional: Check if this station should be highlighted on menu load
            if (window.radioSelected) {
                if (station.type === "youtube" && station.stream === window.currentYouTubeStream) {
                    this.highlightButton(btn);
                }
                if (station.type !== "youtube" && this.audioPlayer.src && station.stream === this.audioPlayer.src) {
                    this.highlightButton(btn);
                }
            }
        });
        // Removed main volume slider from radio menu per request.
    }

    /* ============================================================= */
    /*                HIGHLIGHT ACTIVE STATION BUTTON              */
    /* ============================================================= */
    highlightButton(selectedBtn) {
        const buttons = this.listContainer.querySelectorAll("button");
        buttons.forEach(btn => btn.classList.remove("active"));
        if (selectedBtn) {
            selectedBtn.classList.add("active");
        }
    }

    /* ============================================================= */
    /*                   SHOW & HIDE RADIO MENU                      */
    /* ============================================================= */
    show(stations) {
        this.populate(stations);
        this.menu.classList.add("show");
    }
    hide() {
        this.menu.classList.remove("show");
    }
}

/* ============================================================= */
/*         HELPER FUNCTION TO EXTRACT YOUTUBE VIDEO ID           */
/* ============================================================= */
function getYouTubeVideoID(url) {
    // Expect URL like "https://www.youtube.com/embed/VIDEO_ID?..."
    const parts = url.split('/embed/');
    if (parts.length > 1) {
        const idPart = parts[1].split('?')[0];
        return idPart;
    }
    return '';
}

/* ============================================================= */
/*           MAKE RADIO MENU INSTANCE GLOBALLY AVAILABLE         */
/* ============================================================= */
window.radioMenu = new RadioMenu("radio-menu", "close-radio-menu", "radio-list");