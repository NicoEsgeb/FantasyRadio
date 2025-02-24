// clock.js

document.addEventListener("DOMContentLoaded", function() {
    const clockElement = document.getElementById("clock");

    function updateClock() {
        const now = new Date();
        // Format hours, minutes, and seconds with leading zeros
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        // Display the time in HH:MM:SS format
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateClock(); // Initial call
    setInterval(updateClock, 1000); // Update every second
});