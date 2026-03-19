// Highlight today's opening hours row
const dayIds = ['row-sun','row-mon','row-tue','row-wed','row-thu','row-fri','row-sat'];
const todayRow = document.getElementById(dayIds[new Date().getDay()]);
if (todayRow && !todayRow.classList.contains('closed')) {
    todayRow.classList.add('today');
    const span = todayRow.querySelector('.h-day');
    const badge = document.createElement('span');
    badge.className = 'today-badge';
    badge.textContent = 'Today';
    span.appendChild(badge);
}
