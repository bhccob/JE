// Products carousel scroll functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.products-carousel');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
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
});
