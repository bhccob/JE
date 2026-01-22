// Filter holidays by month
function filterHolidays() {
    const selectedMonth = document.getElementById('monthFilter').value;
    const holidayCards = document.querySelectorAll('.holiday-card');
    const noHolidaysMessage = document.getElementById('noHolidaysMessage');
    let visibleCount = 0;

    holidayCards.forEach(card => {
        const cardMonth = card.getAttribute('data-month');
        
        if (selectedMonth === 'all' || cardMonth === selectedMonth) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show TBD message if no holidays are visible
    if (visibleCount === 0 && selectedMonth !== 'all') {
        noHolidaysMessage.style.display = 'block';
    } else {
        noHolidaysMessage.style.display = 'none';
    }
}
