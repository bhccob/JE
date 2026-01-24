document.addEventListener('DOMContentLoaded', function() {
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

    // Subscription panel functionality
    const subscribeBtn = document.querySelector('.btn-subscribe');
    const subscriptionPanel = document.getElementById('subscriptionPanel');
    const subscriptionOverlay = document.getElementById('subscriptionOverlay');
    const closePanel = document.getElementById('closePanel');
    const subscriptionForm = document.getElementById('subscriptionForm');

    function openSubscriptionPanel() {
        subscriptionPanel.classList.add('active');
        subscriptionOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSubscriptionPanel() {
        subscriptionPanel.classList.remove('active');
        subscriptionOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openSubscriptionPanel();
        });
    }

    if (closePanel) {
        closePanel.addEventListener('click', closeSubscriptionPanel);
    }

    if (subscriptionOverlay) {
        subscriptionOverlay.addEventListener('click', closeSubscriptionPanel);
    }

    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('subscribeName').value;
            const email = document.getElementById('subscribeEmail').value;
            const notifications = document.getElementById('emailNotifications').checked;
            
            console.log('Subscription submitted:', { name, email, notifications });
            alert('Thank you for subscribing!');
            closeSubscriptionPanel();
            subscriptionForm.reset();
        });
    }
});
