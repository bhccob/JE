// FAQ Accordion functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Toggle current FAQ
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Category filter functionality
document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.dataset.category;
        
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Filter FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
            item.classList.remove('active');
        });
    });
});

// Search functionality
const searchInput = document.getElementById('faqSearch');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Reset category filter
    if (searchTerm) {
        document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    }
});
