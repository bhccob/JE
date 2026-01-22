// Products carousel scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.products-carousel:not(.led-carousel)');
    const scrollLeftBtn = document.querySelector('.scroll-left:not(.led-scroll-left)');
    const scrollRightBtn = document.querySelector('.scroll-right:not(.led-scroll-right)');
    const scrollAmount = 530; // Updated for larger cards

    if (scrollLeftBtn && scrollRightBtn && carousel) {
        // Function to update button visibility
        function updateScrollButtons() {
            const scrollLeft = carousel.scrollLeft;
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;

            // Hide left button if at the start
            if (scrollLeft <= 0) {
                scrollLeftBtn.style.opacity = '0';
                scrollLeftBtn.style.pointerEvents = 'none';
            } else {
                scrollLeftBtn.style.opacity = '1';
                scrollLeftBtn.style.pointerEvents = 'auto';
            }

            // Hide right button if at the end
            if (scrollLeft >= maxScroll - 5) { // -5 for rounding tolerance
                scrollRightBtn.style.opacity = '0';
                scrollRightBtn.style.pointerEvents = 'none';
            } else {
                scrollRightBtn.style.opacity = '1';
                scrollRightBtn.style.pointerEvents = 'auto';
            }
        }

        // Initial check
        updateScrollButtons();

        // Update on scroll
        carousel.addEventListener('scroll', updateScrollButtons);

        // Scroll button click handlers
        scrollLeftBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        scrollRightBtn.addEventListener('click', () => {
            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Update on window resize
        window.addEventListener('resize', updateScrollButtons);
    }

    // LED Products carousel scroll functionality
    const ledCarousel = document.querySelector('.led-carousel');
    const ledScrollLeftBtn = document.querySelector('.led-scroll-left');
    const ledScrollRightBtn = document.querySelector('.led-scroll-right');

    if (ledScrollLeftBtn && ledScrollRightBtn && ledCarousel) {
        // Function to update button visibility for LED carousel
        function updateLEDScrollButtons() {
            const scrollLeft = ledCarousel.scrollLeft;
            const maxScroll = ledCarousel.scrollWidth - ledCarousel.clientWidth;

            // Hide left button if at the start
            if (scrollLeft <= 0) {
                ledScrollLeftBtn.style.opacity = '0';
                ledScrollLeftBtn.style.pointerEvents = 'none';
            } else {
                ledScrollLeftBtn.style.opacity = '1';
                ledScrollLeftBtn.style.pointerEvents = 'auto';
            }

            // Hide right button if at the end
            if (scrollLeft >= maxScroll - 5) { // -5 for rounding tolerance
                ledScrollRightBtn.style.opacity = '0';
                ledScrollRightBtn.style.pointerEvents = 'none';
            } else {
                ledScrollRightBtn.style.opacity = '1';
                ledScrollRightBtn.style.pointerEvents = 'auto';
            }
        }

        // Initial check
        updateLEDScrollButtons();

        // Update on scroll
        ledCarousel.addEventListener('scroll', updateLEDScrollButtons);

        // Scroll button click handlers
        ledScrollLeftBtn.addEventListener('click', () => {
            ledCarousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        ledScrollRightBtn.addEventListener('click', () => {
            ledCarousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Update on window resize
        window.addEventListener('resize', updateLEDScrollButtons);
    }

    // Team scroll functionality (about.html)
    const teamScroll = document.querySelector('.team-scroll');
    const teamScrollLeft = document.querySelector('.team-scroll-left');
    const teamScrollRight = document.querySelector('.team-scroll-right');

    if (teamScrollLeft && teamScrollRight && teamScroll) {
        const teamScrollAmount = 430;
        
        function updateTeamScrollButtons() {
            const scrollLeft = teamScroll.scrollLeft;
            const maxScroll = teamScroll.scrollWidth - teamScroll.clientWidth;

            if (scrollLeft <= 0) {
                teamScrollLeft.style.opacity = '0';
                teamScrollLeft.style.pointerEvents = 'none';
            } else {
                teamScrollLeft.style.opacity = '1';
                teamScrollLeft.style.pointerEvents = 'auto';
            }

            if (scrollLeft >= maxScroll - 5) {
                teamScrollRight.style.opacity = '0';
                teamScrollRight.style.pointerEvents = 'none';
            } else {
                teamScrollRight.style.opacity = '1';
                teamScrollRight.style.pointerEvents = 'auto';
            }
        }

        updateTeamScrollButtons();
        teamScroll.addEventListener('scroll', updateTeamScrollButtons);

        teamScrollLeft.addEventListener('click', () => {
            teamScroll.scrollBy({
                left: -teamScrollAmount,
                behavior: 'smooth'
            });
        });

        teamScrollRight.addEventListener('click', () => {
            teamScroll.scrollBy({
                left: teamScrollAmount,
                behavior: 'smooth'
            });
        });

        window.addEventListener('resize', updateTeamScrollButtons);
    }

    // Language selector modal functionality
    const languageBtn = document.getElementById('languageBtn');
    const languageModal = document.getElementById('languageModal');
    const applyBtn = document.getElementById('applyBtn');
    const flagSelect = document.getElementById('flagSelect');
    const langSelect = document.getElementById('langSelect');
    const regionSelect = document.getElementById('regionSelect');

    if (languageBtn && languageModal) {
        // Toggle modal
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            languageModal.classList.toggle('active');
        });

        // Close modal when clicking outside
        document.addEventListener('click', function(e) {
            if (!languageModal.contains(e.target) && !languageBtn.contains(e.target)) {
                languageModal.classList.remove('active');
            }
        });

        // Apply changes
        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                const selectedFlag = flagSelect.value;
                const selectedLang = langSelect.value;
                const selectedRegion = regionSelect.value;

                // Update button display
                languageBtn.querySelector('.current-flag').textContent = selectedFlag;
                languageBtn.querySelector('.current-lang').textContent = selectedLang;
                languageBtn.querySelector('.current-region').textContent = selectedRegion;

                // Close modal
                languageModal.classList.remove('active');
            });
        }
    }
});
