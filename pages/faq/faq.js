const faqItems = Array.from(document.querySelectorAll('.faq-item'));
const faqQuestions = Array.from(document.querySelectorAll('.faq-question'));
const categoryTabs = Array.from(document.querySelectorAll('.category-tab'));
const searchInput = document.getElementById('faqSearch');
const noResults = document.getElementById('faqNoResults');

let activeCategory = 'all';

function matchesCategory(item) {
    return activeCategory === 'all' || item.dataset.category === activeCategory;
}

function matchesSearch(item, searchTerm) {
    if (!searchTerm) {
        return true;
    }

    const question = item.querySelector('.faq-question h3')?.textContent.toLowerCase() || '';
    const answer = item.querySelector('.faq-answer p')?.textContent.toLowerCase() || '';

    return question.includes(searchTerm) || answer.includes(searchTerm);
}

function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    faqItems.forEach((item) => {
        const shouldShow = matchesCategory(item) && matchesSearch(item, searchTerm);

        item.style.display = shouldShow ? 'block' : 'none';

        if (!shouldShow) {
            item.classList.remove('active');
            return;
        }

        visibleCount += 1;
    });

    if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');

        faqItems.forEach((item) => {
            item.classList.remove('active');
        });

        if (!isActive && faqItem.style.display !== 'none') {
            faqItem.classList.add('active');
        }
    });
});

categoryTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        activeCategory = tab.dataset.category;

        categoryTabs.forEach((item) => item.classList.remove('active'));
        tab.classList.add('active');

        applyFilters();
    });
});

if (searchInput) {
    searchInput.addEventListener('input', () => {
        applyFilters();
    });
}

applyFilters();
