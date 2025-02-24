document.addEventListener("DOMContentLoaded", function() {
    // =============================================================
    //           EXTRAS MODAL: About Nico (Existing)
    // =============================================================
    const extrasBtn = document.getElementById("extras-btn");
    const extrasModal = document.getElementById("extras-modal");
    const closeExtras = document.querySelector(".close-extras");

    extrasBtn.addEventListener("click", function() {
        extrasModal.style.display = "block";
    });

    closeExtras.addEventListener("click", function() {
        extrasModal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === extrasModal) {
            extrasModal.style.display = "none";
        }
    });

    // =============================================================
    //           ADS MODAL: Information About Ads (New)
    // =============================================================
    const adsBtn = document.getElementById("ads-btn");
    const adsModal = document.getElementById("ads-modal");
    const closeAds = document.querySelector(".close-ads");

    adsBtn.addEventListener("click", function() {
        adsModal.style.display = "block";
    });

    closeAds.addEventListener("click", function() {
        adsModal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === adsModal) {
            adsModal.style.display = "none";
        }
    });
});