class FAQPageController {
    constructor() {
        this.faqItems = Array.from(document.querySelectorAll('.faq-item'));
        this.faqQuestions = Array.from(document.querySelectorAll('.faq-question'));
        this.categoryTabs = Array.from(document.querySelectorAll('.category-tab'));
        this.searchInput = document.getElementById('faqSearch');
        this.noResults = document.getElementById('faqNoResults');
        this.activeCategory = 'all';
    }

    init() {
        if (!this.faqItems.length) {
            return;
        }

        this.bindQuestionToggle();
        this.bindCategoryTabs();
        this.bindSearch();
        this.applyFilters();
    }

    matchesCategory(item) {
        return this.activeCategory === 'all' || item.dataset.category === this.activeCategory;
    }

    matchesSearch(item, searchTerm) {
        if (!searchTerm) {
            return true;
        }

        const question = item.querySelector('.faq-question h3')?.textContent.toLowerCase() || '';
        const answer = item.querySelector('.faq-answer p')?.textContent.toLowerCase() || '';

        return question.includes(searchTerm) || answer.includes(searchTerm);
    }

    applyFilters() {
        const searchTerm = this.searchInput?.value.trim().toLowerCase() || '';
        let visibleCount = 0;

        this.faqItems.forEach((item) => {
            const shouldShow = this.matchesCategory(item) && this.matchesSearch(item, searchTerm);

            item.style.display = shouldShow ? 'block' : 'none';

            if (!shouldShow) {
                item.classList.remove('active');
                return;
            }

            visibleCount += 1;
        });

        if (this.noResults) {
            this.noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    bindQuestionToggle() {
        this.faqQuestions.forEach((question) => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');

                this.faqItems.forEach((item) => {
                    item.classList.remove('active');
                });

                if (!isActive && faqItem.style.display !== 'none') {
                    faqItem.classList.add('active');
                }
            });
        });
    }

    bindCategoryTabs() {
        this.categoryTabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                this.activeCategory = tab.dataset.category;

                this.categoryTabs.forEach((item) => item.classList.remove('active'));
                tab.classList.add('active');

                this.applyFilters();
            });
        });
    }

    bindSearch() {
        if (!this.searchInput) {
            return;
        }

        this.searchInput.addEventListener('input', () => {
            this.applyFilters();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FAQPageController().init();
});
