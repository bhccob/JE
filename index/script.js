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

    /* ── Navbar language picker ── */
    const TRANSLATIONS = {
        en: {
            'nav-inventory': 'Inventory', 'nav-discover': 'Discover', 'nav-hours': 'Location \u0026 Hours',
            'nav-faq': 'FAQ', 'nav-support': 'Support', 'nav-lang': 'Language', 'nav-new-customer': 'New Customer',
            'dd-solar-h': 'Solar Products', 'dd-solar-link': 'View Solar',
            'dd-led-h': 'LED Products', 'dd-led-link': 'View LED',
            'dd-res-h': 'Resources', 'dd-events': 'Events', 'dd-news': 'News',
            'dd-why-h': 'Why Us', 'dd-why-link': 'Why Choose Us', 'dd-reviews': 'Customer Reviews',
            'dd-company-h': 'Company', 'dd-about': 'Our Story', 'dd-careers': 'Careers',
            'hero-title': 'Power Your Future',
            'hero-sub': 'Powering a Sustainable Future with Solar \u0026 LED Lighting.',
            'btn-inventory': 'View Inventory', 'btn-quote': 'Quote', 'btn-learn': 'Learn More', 'btn-contact': 'Contact Us',
            'card-res': 'Residential Solution', 'card-res-desc': 'High-efficiency panels designed for modern homes',
            'card-com': 'Commercial Solution', 'card-com-desc': 'Scalable solutions for businesses of all sizes',
            'card-led': 'LED Solution', 'card-led-desc': 'Energy-efficient LED lighting solutions for every need',
            'card-hyb': 'LED \u0026 Solar Hybrid Solution', 'card-hyb-desc': 'Combined LED and solar solutions for maximum efficiency',
            'str-eyebrow': 'What Sets Us Apart', 'str-heading': "Where We're Strong",
            'str-exp': 'Experience', 'str-exp-desc': 'Years of expertise in solar energy and LED solutions, delivering proven results across Aruba.',
            'str-know': 'Knowledge', 'str-know-desc': 'Deep understanding of renewable energy technology and industry-leading best practices.',
            'str-range': 'Wide Product Range', 'str-range-desc': 'Extensive selection of solar panels, inverters, batteries, and LED lighting solutions.',
            'str-trans': 'Transparency', 'str-trans-desc': 'Clear pricing, honest communication, and straightforward processes every step of the way.',
            'sol-com-h': 'Commercial Solutions', 'sol-com-desc': 'Scalable solar and LED systems designed for businesses, warehouses, and industrial facilities. Maximize efficiency and reduce operational costs.',
            'sol-res-h': 'Residential Solutions', 'sol-res-desc': 'Custom solar panel installations and LED lighting solutions for your home. Save money while contributing to a sustainable future.',
            'cta-h': 'How can we help you?', 'cta-sub': 'Get in touch with a product expert or account manager'
        },
        es: {
            'nav-inventory': 'Inventario', 'nav-discover': 'Descubrir', 'nav-hours': 'Ubicaci\u00f3n y Horarios',
            'nav-faq': 'FAQ', 'nav-support': 'Soporte', 'nav-lang': 'Idioma', 'nav-new-customer': 'Nuevo Cliente',
            'dd-solar-h': 'Productos Solares', 'dd-solar-link': 'Ver Solar',
            'dd-led-h': 'Productos LED', 'dd-led-link': 'Ver LED',
            'dd-res-h': 'Recursos', 'dd-events': 'Eventos', 'dd-news': 'Noticias',
            'dd-why-h': 'Por Qu\u00e9 Nosotros', 'dd-why-link': '\u00bfPor qu\u00e9 Elegirnos?', 'dd-reviews': 'Opiniones de Clientes',
            'dd-company-h': 'Empresa', 'dd-about': 'Nuestra Historia', 'dd-careers': 'Empleos',
            'hero-title': 'Impulsa Tu Futuro',
            'hero-sub': 'Impulsando un Futuro Sostenible con Energ\u00eda Solar e Iluminaci\u00f3n LED.',
            'btn-inventory': 'Ver Inventario', 'btn-quote': 'Cotizaci\u00f3n', 'btn-learn': 'M\u00e1s Informaci\u00f3n', 'btn-contact': 'Cont\u00e1ctenos',
            'card-res': 'Soluci\u00f3n Residencial', 'card-res-desc': 'Paneles de alta eficiencia dise\u00f1ados para hogares modernos',
            'card-com': 'Soluci\u00f3n Comercial', 'card-com-desc': 'Soluciones escalables para empresas de todos los tama\u00f1os',
            'card-led': 'Soluci\u00f3n LED', 'card-led-desc': 'Soluciones de iluminaci\u00f3n LED eficientes para cada necesidad',
            'card-hyb': 'Soluci\u00f3n H\u00edbrida LED y Solar', 'card-hyb-desc': 'Soluciones combinadas de LED y solar para m\u00e1xima eficiencia',
            'str-eyebrow': 'Lo Que Nos Distingue', 'str-heading': 'Nuestras Fortalezas',
            'str-exp': 'Experiencia', 'str-exp-desc': 'A\u00f1os de experiencia en energ\u00eda solar y soluciones LED, brindando resultados comprobados en toda Aruba.',
            'str-know': 'Conocimiento', 'str-know-desc': 'Comprensi\u00f3n profunda de la tecnolog\u00eda de energ\u00edas renovables y las mejores pr\u00e1cticas de la industria.',
            'str-range': 'Gran Variedad de Productos', 'str-range-desc': 'Amplia selecci\u00f3n de paneles solares, inversores, bater\u00edas y soluciones de iluminaci\u00f3n LED.',
            'str-trans': 'Transparencia', 'str-trans-desc': 'Precios claros, comunicaci\u00f3n honesta y procesos sencillos en cada paso del camino.',
            'sol-com-h': 'Soluciones Comerciales', 'sol-com-desc': 'Sistemas solares y LED escalables para empresas, almacenes e instalaciones industriales. Maximice la eficiencia y reduzca costos operativos.',
            'sol-res-h': 'Soluciones Residenciales', 'sol-res-desc': 'Instalaciones personalizadas de paneles solares e iluminaci\u00f3n LED para su hogar. Ahorre dinero y contribuya a un futuro sostenible.',
            'cta-h': '\u00bfC\u00f3mo podemos ayudarte?', 'cta-sub': 'Cont\u00e1ctenos con un experto en productos o gerente de cuenta'
        },
        zh: {
            'nav-inventory': '\u5e93\u5b58', 'nav-discover': '\u63a2\u7d22', 'nav-hours': '\u5730\u70b9\u4e0e\u8425\u4e1a\u65f6\u95f4',
            'nav-faq': '\u5e38\u89c1\u95ee\u9898', 'nav-support': '\u652f\u6301', 'nav-lang': '\u8bed\u8a00', 'nav-new-customer': '\u65b0\u5ba2\u6237',
            'dd-solar-h': '\u592a\u9633\u80fd\u4ea7\u54c1', 'dd-solar-link': '\u67e5\u770b\u592a\u9633\u80fd',
            'dd-led-h': 'LED\u4ea7\u54c1', 'dd-led-link': '\u67e5\u770bLED',
            'dd-res-h': '\u8d44\u6e90', 'dd-events': '\u6d3b\u52a8', 'dd-news': '\u65b0\u95fb',
            'dd-why-h': '\u4e3a\u4f55\u9009\u62e9\u6211\u4eec', 'dd-why-link': '\u4e3a\u4f55\u9009\u62e9\u6211\u4eec', 'dd-reviews': '\u5ba2\u6237\u8bc4\u4ef7',
            'dd-company-h': '\u516c\u53f8', 'dd-about': '\u6211\u4eec\u7684\u6545\u4e8b', 'dd-careers': '\u62db\u8058',
            'hero-title': '\u9a71\u52a8\u60a8\u7684\u672a\u6765',
            'hero-sub': '\u4ee5\u592a\u9633\u80fd\u4e0eAndLED\u7167\u660e\u63a8\u52a8\u53ef\u6301\u7eed\u53d1\u5c55\u7684\u672a\u6765\u3002',
            'btn-inventory': '\u67e5\u770b\u5e93\u5b58', 'btn-quote': '\u62a5\u4ef7', 'btn-learn': '\u4e86\u89e3\u66f4\u591a', 'btn-contact': '\u8054\u7cfb\u6211\u4eec',
            'card-res': '\u4f4f\u5b85\u89e3\u51b3\u65b9\u6848', 'card-res-desc': '\u4e3a\u73b0\u4ee3\u4f4f\u5b85\u8bbe\u8ba1\u7684\u9ad8\u6548\u80fd\u592a\u9633\u80fd\u677f',
            'card-com': '\u5546\u4e1a\u89e3\u51b3\u65b9\u6848', 'card-com-desc': '\u9002\u5408\u5404\u79cd\u89c4\u6a21\u4f01\u4e1a\u7684\u53ef\u6269\u5c55\u89e3\u51b3\u65b9\u6848',
            'card-led': 'LED\u7167\u660e\u65b9\u6848', 'card-led-desc': '\u6ee1\u8db3\u5404\u79cd\u9700\u6c42\u7684\u8282\u80fdLED\u7167\u660e\u89e3\u51b3\u65b9\u6848',
            'card-hyb': 'LED\u4e0e\u592a\u9633\u80fd\u6df7\u5408\u65b9\u6848', 'card-hyb-desc': '\u7ed3\u5408LED\u4e0e\u592a\u9633\u80fd\u7684\u9ad8\u6548\u89e3\u51b3\u65b9\u6848',
            'str-eyebrow': '\u6211\u4eec\u7684\u4f18\u52bf\u6240\u5728', 'str-heading': '\u6211\u4eec\u7684\u5f3a\u9879',
            'str-exp': '\u7ecf\u9a8c', 'str-exp-desc': '\u591a\u5e74\u7684\u592a\u9633\u80fd\u4e0eLED\u89e3\u51b3\u65b9\u6848\u4e13\u4e1a\u7ecf\u9a8c\uff0c\u5728\u963f\u9c81\u5df4\u5168\u5c9b\u63d0\u4f9b\u53ef\u9760\u6210\u679c\u3002',
            'str-know': '\u77e5\u8bc6', 'str-know-desc': '\u5bf9\u53ef\u518d\u751f\u80fd\u6e90\u6280\u672f\u548c\u884c\u4e1a\u6700\u4f73\u5b9e\u8df5\u6709\u6df1\u523b\u7406\u89e3\u3002',
            'str-range': '\u4e30\u5bcc\u7684\u4ea7\u54c1\u7cfb\u5217', 'str-range-desc': '\u63d0\u4f9b\u592a\u9633\u80fd\u677f\u3001\u9006\u53d8\u5668\u3001\u7535\u6c60\u53caLED\u7167\u660e\u89e3\u51b3\u65b9\u6848\u7684\u5e7f\u6cdb\u9009\u62e9\u3002',
            'str-trans': '\u900f\u660e\u5ea6', 'str-trans-desc': '\u6e05\u6670\u7684\u5b9a\u4ef7\u3001\u8bda\u5b9e\u7684\u6c9f\u901a\u548c\u6bcf\u4e00\u6b65\u7b80\u660e\u7684\u6d41\u7a0b\u3002',
            'sol-com-h': '\u5546\u4e1a\u89e3\u51b3\u65b9\u6848', 'sol-com-desc': '\u4e3a\u4f01\u4e1a\u3001\u4ed3\u5e93\u548c\u5de5\u4e1a\u8bbe\u65bd\u8bbe\u8ba1\u7684\u53ef\u6269\u5c55\u592a\u9633\u80fd\u4e0eLED\u7cfb\u7edf\uff0c\u6700\u5927\u5316\u6548\u7387\u5e76\u964d\u4f4e\u8fd0\u8425\u6210\u672c\u3002',
            'sol-res-h': '\u4f4f\u5b85\u89e3\u51b3\u65b9\u6848', 'sol-res-desc': '\u4e3a\u60a8\u7684\u5bb6\u5b9a\u5236\u592a\u9633\u80fd\u677f\u5b89\u88c5\u548cLED\u7167\u660e\u89e3\u51b3\u65b9\u6848\uff0c\u7701\u9177\u540c\u65f6\u4e3a\u53ef\u6301\u7eed\u672a\u6765\u505a\u8d21\u732e\u3002',
            'cta-h': '\u6211\u4eec\u80fd\u5982\u4f55\u5e2e\u52a9\u60a8\uff1f', 'cta-sub': '\u8054\u7cfb\u4ea7\u54c1\u4e13\u5bb6\u6216\u5ba2\u6237\u7ecf\u7406'
        }
    };

    function applyLang(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const t = TRANSLATIONS[lang];
            if (t && t[key] !== undefined) el.textContent = t[key];
        });
        document.querySelectorAll('.lang-opt').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
        localStorage.setItem('je_lang', lang);
    }

    const navLangBtn = document.getElementById('navLangBtn');
    const navLangDropdown = document.getElementById('navLangDropdown');
    if (navLangBtn && navLangDropdown) {
        navLangBtn.addEventListener('click', e => {
            e.stopPropagation();
            navLangDropdown.classList.toggle('open');
        });
        document.addEventListener('click', e => {
            if (!navLangBtn.contains(e.target)) navLangDropdown.classList.remove('open');
        });
        navLangDropdown.querySelectorAll('.lang-opt').forEach(btn => {
            btn.addEventListener('click', () => {
                applyLang(btn.dataset.lang);
                navLangDropdown.classList.remove('open');
            });
        });
    }
    // Restore saved language
    const savedLang = localStorage.getItem('je_lang');
    if (savedLang && savedLang !== 'en') applyLang(savedLang);

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
