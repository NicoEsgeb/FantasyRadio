document.addEventListener("DOMContentLoaded", function() {
    // =============================================================
    //           RESTED TIME TRACKER
    // =============================================================
    // Initialize the rested timer (in minutes)
    let restedTime = 0;
    const restedEl = document.getElementById("rested-time");

    // Debug log to verify the element is found
    console.log("Rested element:", restedEl);

    if (restedEl) {
        // Set the initial message immediately
        restedEl.textContent = "You have rested for 0 minutes.";

        // Update the message every minute (60000ms)
        setInterval(() => {
            restedTime++;
            restedEl.textContent = "You have rested for " + restedTime + " minute" + (restedTime > 1 ? "s" : "") + ".";
        }, 60000);
    } else {
        console.error("Element with ID 'rested-time' not found!");
    }
});