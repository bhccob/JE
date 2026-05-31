class JontaiSiteApp {
    init() {
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        function syncNavbarState() {
            navbar.classList.toggle('navbar-scrolled', window.scrollY > 18);
        }

        syncNavbarState();
        window.addEventListener('scroll', syncNavbarState, { passive: true });
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

    /* â”€â”€ Navbar language picker â”€â”€ */
    const TRANSLATIONS = {
        en: {
            'nav-inventory': 'Solutions', 'nav-discover': 'Discover', 'nav-hours': 'Location \u0026 Hours',
            'nav-faq': 'FAQ', 'nav-support': 'Support', 'nav-lang': 'Language', 'nav-new-customer': 'New Customer',
            'dd-solar-h': 'Solar Products', 'dd-solar-link': 'View Solar',
            'dd-led-h': 'LED Products', 'dd-led-link': 'View LED',
            'dd-res-h': 'Resources', 'dd-events': 'Events', 'dd-news': 'News',
            'dd-why-h': 'Why Us', 'dd-why-link': 'Why Choose Us', 'dd-reviews': 'Customer Reviews',
            'dd-company-h': 'Company', 'dd-about': 'Our Story', 'dd-careers': 'Careers',
            'hero-title': 'Power Your Future',
            'hero-sub': 'Powering a Sustainable Future with Solar \u0026 LED Lighting.',
            'btn-inventory': 'Explore Solutions', 'btn-quote': 'Quote', 'btn-learn': 'Learn More', 'btn-contact': 'Contact Us',
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
            'cta-h': 'How can we help you?', 'cta-sub': 'Get in touch with a product expert or account manager',
            'ft-tagline': 'Powering a Sustainable Future with Solar & LED Lighting.',
            'ft-company-h': 'Company', 'ft-about': 'About Us', 'ft-news': 'News', 'ft-careers': 'Careers', 'ft-privacy': 'Privacy Policy',
            'ft-info-h': 'Information', 'ft-faq': 'FAQ', 'ft-terms': 'Terms and Conditions', 'ft-warranty': 'Warranty', 'ft-consumer': 'Consumer Rights',
            'ft-support-h': 'Support', 'ft-contact': 'Contact Us', 'ft-account': 'My Account',
            'ft-service': 'Service & Parts', 'ft-returns': 'Returns & Product Support', 'ft-access': 'Accessibility',
            'ft-newsletter-h': 'Project Updates',
            'ft-newsletter-p': 'Get concise updates on products, installations, and new releases.',
            'ft-subscribe': 'Join List',
            'cookie-title': 'Cookie Preferences',
            'cookie-text': 'We use essential storage to remember your language preference and keep the site working properly. We will only use analytics cookies if you allow them.',
            'cookie-accept': 'Accept All',
            'cookie-essential': 'Essential Only',
            'cookie-manage': 'Manage Preferences',
            'cookie-policy': 'Privacy Policy',
            'cookie-pref-title': 'Manage Cookie Preferences',
            'cookie-pref-text': 'Essential storage is always on because it supports core site functions. Analytics stays off unless you choose to allow it.',
            'cookie-essential-label': 'Essential storage',
            'cookie-essential-desc': 'Keeps language preference and core site behavior working.',
            'cookie-analytics-label': 'Analytics cookies',
            'cookie-analytics-desc': 'Helps us understand site usage when analytics tools are added.',
            'cookie-save': 'Save Preferences',
            'cookie-cancel': 'Cancel',
            // â”€â”€ Page-specific content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'legal-hero-label':'Legal',
            'ab-hero-label':'Our Story','ab-h1':'About Jontai Energy','ab-story-eyebrow':'Who We Are',
            'ab-mission-label':'Our Mission','ab-vision-label':'Our Vision',
            'ab-team-eyebrow':'The People Behind It',
            'fq-hero-label':'Support & Help','fq-h1':'Frequently Asked Questions','fq-search-ph':'Search questions…',
            'fq-tab-all':'All','fq-tab-products':'Products','fq-tab-install':'Installation','fq-tab-pricing':'Pricing','fq-tab-maint':'Maintenance',
            'ev-h1':'Events',
            'nw-hero-label':'Company Updates','nw-h1':'Jontai Energy News','nw-section-label':'Timeline',
            'ct-hero-label':'Get In Touch','ct-h1':"Let's Connect",'ct-info-eyebrow':'Reach Us Directly','ct-form-eyebrow':'Send a Message',
            'loc-h1':'Location & Hours',
            'wu-hero-label':'Our Commitment','wu-h1':'Why Choose Jontai Energy',
            'wu-intro-eyebrow':'More Than Solar Panels','wu-reasons-eyebrow':'Six Strong Reasons','wu-benefits-eyebrow':'The Jontai Advantage',
            'rv-hero-label':'Real Customers. Real Results.','rv-h1':'Customer Reviews',
            'rv-score-label':'Average Rating','rv-section-eyebrow':'What They Say','rv-h2':'Trusted by Aruba',
            'qt-hero-label':'Free No-Obligation Quote','qt-h1':'What Are You Looking For?',
            'qt-solar-eyebrow':'Solar Energy','qt-led-eyebrow':'LED Lighting',
            'qt-comb-eyebrow':'Best Value','qt-comb-h3':'Solar & LED Together',
            'ww-hero-label':'Careers at Jontai Energy','ww-h1':'Build the Future of Clean Energy',
            'ww-intro-eyebrow':'Why Jontai Energy','ww-process-eyebrow':'How It Works','ww-jobs-eyebrow':'Current Openings',
            'sv-hero-label':'Support','sv-h1':'Service & Parts',
            'rt-h1':'Returns & Product Support',
            'wa-h1':'Warranty Policy','tm-h1':'Terms & Conditions','pv-h1':'Privacy Policy',
            'ac-hero-label':'Accessibility','ac-h1':'Accessibility at Jontai Energy',
            'sc-hero-label':'Connect With Us','sc-h1':'Follow Jontai Energy',
            'cl-hero-label':"What's On",'cl-h1':'Upcoming Events','cl-eyebrow':'Calendar',
            'hr-hero-label':'Schedule','hr-h1':'Opening Hours',
            'hr-schedule-eyebrow':'Weekly Schedule','hr-schedule-h2':"When We're Open for You",
            'hr-holidays-eyebrow':'Public Holidays','hr-holidays-h2':'Holiday Hours','hr-find-eyebrow':'Find Us',
            // â”€â”€ Subscription panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'sub-h':'Subscribe to Updates','sub-p':'Stay informed about our latest products and news',
            'sub-name-label':'Name','sub-email-label':'Email',
            'sub-name-ph':'Enter your name','sub-email-ph':'Enter your email',
            'sub-toggle':'Email Notifications','sub-toggle-desc':'Receive updates about new products and trends',
            'sub-btn':'Subscribe Now',
            // â”€â”€ About â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ab-story-h2':'A Family Business Built on Clean Energy',
            'ab-stat-install':'Installations','ab-stat-customers':'Happy Customers',
            'ab-stat-energy':'Clean Energy Generated','ab-stat-years':'Years of Experience',
            'ab-team-h2':'Meet Our Leadership',
            'ab-role-cfw':'Founder & CFO','ab-role-lily':'Chief Executive Officer',
            'ab-role-chakho':'Chief Technology Officer','ab-role-chingho':'Chief Marketing Officer',
            'ab-role-bob':'Chief Information Officer',
            'ab-cta-h3':'Ready to go solar?','ab-cta-p':'Talk to our experts and get a free no-obligation quote today.','ab-cta-btn':'Get a Quote',
            // â”€â”€ Accessibility â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ac-commitment-h2':'Our Commitment',
            'ac-wheelchair-h3':'Wheelchair & Mobility Access','ac-parking-h3':'Accessible Parking',
            'ac-staff-h3':'Staff Assistance','ac-phone-h3':'Phone & WhatsApp Orders',
            'ac-resize-h3':'Text Resizing','ac-contrast-h3':'Colour Contrast',
            'ac-keyboard-h3':'Keyboard Navigation','ac-lang-h3':'Language Options',
            'ac-mobile-h3':'Mobile & Screen Reader Friendly',
            'ac-report-h3':'Report an Issue','ac-improve-h3':'Continuous Improvement',
            'ac-cta-h3':'Need help or want to give feedback?',
            // â”€â”€ Celebrations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'cl-section-h2':'Events & Celebrations',
            "cl-event1-h3":"Pagara - New Year's Eve Fireworks",
            'cl-event2-h3':'Chinese New Year Celebration',
            'cl-more-eyebrow':'Explore More','cl-more-h2':'Also at Jontai Energy',
            "cl-cta-h3":"Don't miss an event",
            // â”€â”€ Contact â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            "ct-info-h2":"We're Always Here For You",'ct-form-h2':'How Can We Help You?',
            'ct-visit-label':'Visit Us','ct-call-label':'Call Us',
            'ct-email-label':'Email Us','ct-hours-label':'Business Hours',
            // â”€â”€ Events â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ev-celebrations-h2':'Celebrations','ev-holiday-h2':'Holiday Opening Hours',
            // â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'fq-q1':'What types of solar panels do you offer?',
            'fq-q2':'What is the efficiency rating of your solar panels?',
            'fq-q3':'Do you provide LED lighting solutions?',
            'fq-q4':'How long does installation take?',
            'fq-q5':'Do you provide installation services or just products?',
            'fq-q6':'Will solar panels work on my roof type?',
            'fq-q7':'How much does a solar panel system cost?',
            'fq-q8':'Are there financing options available?',
            'fq-q9':'What incentives and rebates are available?',
            'fq-q10':'How much maintenance do solar panels require?',
            'fq-q11':'What is the lifespan of solar panels?',
            'fq-q12':'What happens if a panel gets damaged?',
            'fq-q13':'How much can I save on my electricity bill?',
            'fq-q14':'Do solar panels work on cloudy days?',
            'fq-q15':'Can I store excess energy produced?',
            'fq-cta-h3':'Still have questions?',
            // â”€â”€ Hours â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'hr-visit-h2':'Come Visit Jontai Energy','hr-contact-h3':'Have a question?',
            'hr-tbd-h3':'TBD - To Be Decided',
            // â”€â”€ Location â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'loc-map-h2':'Find Our Location','loc-hours-h2':'Opening Hours',
            // â”€â”€ News â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'nw-h2':'News','nw-item1-h3':'Website Launched',
            'nw-item2-h3':'Jontai Energy Established','nw-cta-h3':'Want to stay in the loop?',
            // â”€â”€ Privacy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'legal-toc-h2':'Table of Contents',
            'pv-who-h2':'Who We Are','pv-data-h2':'Data We Collect',
            'pv-use-h2':'How We Use Your Data','pv-legal-h2':'Legal Basis for Processing',
            'pv-share-h2':'Sharing of Data','pv-retain-h2':'Data Retention',
            'pv-rights-h2':'Your Rights','pv-security-h2':'Security',
            'pv-cookies-h2':'Cookies','pv-changes-h2':'Changes to This Policy',
            'pv-cta-h3':'Questions about your privacy?',
            // â”€â”€ Quote â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'qt-solar-h2':'Solar Quote','qt-led-h2':'LED Quote',
            // â”€â”€ Returns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'rt-policy-h2':'Returns & Consumer Support Policy',
            'rt-unopened-h3':'Unopened / Unused Products','rt-defective-h3':'Defective Products',
            'rt-wrong-h3':'Wrong Item Received','rt-opened-h3':'Opened but Unused Products',
            'rt-installed-h3':'Installed Products (Non-defective)',
            'rt-custom-h3':'Custom or Special-Order Items',
            'rt-late-h3':'Returns After 14 Days (Non-defective)',
            'rt-cta-h3':'Need to return or exchange a product?',
            // â”€â”€ Reviews â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'rv-cta-h3':'Had a great experience?','rv-about-h2':'What Sets Us Apart',
            // â”€â”€ Service â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'sv-promise-h2':'Service Commitments & Warranty Handling',
            'sv-solar-h3':'Solar Panel Repair','sv-inverter-h3':'Inverter & Battery Service',
            'sv-led-h3':'LED Fixture Repair','sv-electrical-h3':'Electrical Hardware',
            'sv-preventive-h3':'Preventive Maintenance','sv-onsite-h3':'On-Site Visits',
            'sv-cta-h3':'Ready to bring in your product?',
            // â”€â”€ Legal shared â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'tm-s1-h2':'Parties & Applicability','tm-s2-h2':'Orders & Pricing',
            'tm-s3-h2':'Payment','tm-s4-h2':'Delivery & Installation',
            'tm-s5-h2':'Returns & Cancellations','tm-s6-h2':'Liability',
            'tm-s7-h2':'Intellectual Property','tm-s8-h2':'Consumer Rights',
            'tm-s9-h2':'Disputes & Governing Law','tm-s10-h2':'Changes to These Terms',
            'tm-cta-h3':'Have a question about our terms?',
            'wa-s1-h2':'Warranty Coverage','wa-s2-h2':'Warranty Periods',
            'wa-s3-h2':'Exclusions','wa-s4-h2':'Making a Warranty Claim',
            'wa-s5-h2':'Remedies','wa-s6-h2':'Installation Warranty',
            'wa-s7-h2':'Statutory Rights','wa-s8-h2':'Contact & Support',
            'wa-cta-h3':'Need to make a warranty claim?',
            // â”€â”€ Why-us â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'wu-story-h2':'A Partner You Can Actually Trust',
            'wu-pillar-promise':'Our Promise','wu-pillar-track':'Our Track Record',
            'wu-reasons-h2':'What Sets Us Apart',
            'wu-r1-h3':'Family-Owned','wu-r2-h3':'Premium Products',
            'wu-r3-h3':'Expert Installation','wu-r4-h3':'Competitive Pricing',
            'wu-r5-h3':'Outstanding Support','wu-r6-h3':'Environmental Commitment',
            'wu-benefits-h2':'Built Around You',
            'wu-b1-h4':'Fast Installation','wu-b2-h4':'Transparent Process',
            'wu-b3-h4':'Warranty & Guarantees','wu-b4-h4':'Proven Savings',
            'wu-b5-h4':'Local Expertise','wu-b6-h4':'Trusted by Community',
            // â”€â”€ Work-with-us â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ww-intro-h2':'More Than a Job - A Mission',
            'ww-process-h2':'Our Hiring Process','ww-jobs-h2':'Open Positions',
            'ww-step1-h4':'Apply Online','ww-step2-h4':'Initial Review',
            'ww-step3-h4':'Interview','ww-step4-h4':'Welcome Aboard',
            'ww-j1-h3':'Solar Installation Technician','ww-j2-h3':'Sales Representative',
            'ww-j3-h3':'Solar Engineer','ww-j4-h3':'Customer Support Specialist',
            'ww-j5-h3':'Operations Manager',
            'ww-cta-h3':'Questions before applying?','ww-modal-h3':'Apply for Position'
        },
        es: {
            'nav-inventory': 'Soluciones', 'nav-discover': 'Descubrir', 'nav-hours': 'Ubicaci\u00f3n y Horarios',
            'nav-faq': 'FAQ', 'nav-support': 'Soporte', 'nav-lang': 'Idioma', 'nav-new-customer': 'Nuevo Cliente',
            'dd-solar-h': 'Productos Solares', 'dd-solar-link': 'Ver Solar',
            'dd-led-h': 'Productos LED', 'dd-led-link': 'Ver LED',
            'dd-res-h': 'Recursos', 'dd-events': 'Eventos', 'dd-news': 'Noticias',
            'dd-why-h': 'Por Qu\u00e9 Nosotros', 'dd-why-link': '\u00bfPor qu\u00e9 Elegirnos?', 'dd-reviews': 'Opiniones de Clientes',
            'dd-company-h': 'Empresa', 'dd-about': 'Nuestra Historia', 'dd-careers': 'Empleos',
            'hero-title': 'Impulsa Tu Futuro',
            'hero-sub': 'Impulsando un Futuro Sostenible con Energ\u00eda Solar e Iluminaci\u00f3n LED.',
            'btn-inventory': 'Ver Soluciones', 'btn-quote': 'Cotizaci\u00f3n', 'btn-learn': 'M\u00e1s Informaci\u00f3n', 'btn-contact': 'Cont\u00e1ctenos',
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
            'cta-h': '\u00bfC\u00f3mo podemos ayudarte?', 'cta-sub': 'Cont\u00e1ctenos con un experto en productos o gerente de cuenta',
            'ft-tagline': 'Impulsando un Futuro Sostenible con Energ\u00eda Solar e Iluminaci\u00f3n LED.',
            'ft-company-h': 'Empresa', 'ft-about': 'Sobre Nosotros', 'ft-news': 'Noticias', 'ft-careers': 'Empleos', 'ft-privacy': 'Pol\u00edtica de Privacidad',
            'ft-info-h': 'Informaci\u00f3n', 'ft-faq': 'Preguntas Frecuentes', 'ft-terms': 'T\u00e9rminos y Condiciones', 'ft-warranty': 'Garant\u00eda', 'ft-consumer': 'Derechos del Consumidor',
            'ft-support-h': 'Soporte', 'ft-contact': 'Cont\u00e1ctenos', 'ft-account': 'Mi Cuenta',
            'ft-service': 'Servicio y Repuestos', 'ft-returns': 'Devoluciones y Soporte', 'ft-access': 'Accesibilidad',
            'ft-newsletter-h': 'Actualizaciones de Proyectos',
            'ft-newsletter-p': 'Reciba actualizaciones breves sobre productos, instalaciones y novedades.',
            'ft-subscribe': 'Unirse',
            'cookie-title': 'Preferencias de Cookies',
            'cookie-text': 'Usamos almacenamiento esencial para recordar su idioma y mantener el sitio funcionando correctamente. Solo usaremos cookies analíticas si usted lo permite.',
            'cookie-accept': 'Aceptar Todo',
            'cookie-essential': 'Solo Esenciales',
            'cookie-manage': 'Gestionar Preferencias',
            'cookie-policy': 'Política de Privacidad',
            'cookie-pref-title': 'Gestionar Preferencias de Cookies',
            'cookie-pref-text': 'El almacenamiento esencial siempre está activo porque respalda funciones básicas del sitio. La analítica permanece desactivada a menos que usted la permita.',
            'cookie-essential-label': 'Almacenamiento esencial',
            'cookie-essential-desc': 'Mantiene la preferencia de idioma y el funcionamiento básico del sitio.',
            'cookie-analytics-label': 'Cookies analíticas',
            'cookie-analytics-desc': 'Nos ayuda a entender el uso del sitio cuando se añadan herramientas analíticas.',
            'cookie-save': 'Guardar Preferencias',
            'cookie-cancel': 'Cancelar',
            // â”€â”€ Page-specific content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'legal-hero-label':'Legal',
            'ab-hero-label':'Nuestra Historia','ab-h1':'Sobre Jontai Energy','ab-story-eyebrow':'Qui\u00e9nes Somos',
            'ab-mission-label':'Nuestra Misi\u00f3n','ab-vision-label':'Nuestra Visi\u00f3n',
            'ab-team-eyebrow':'El Equipo Detr\u00e1s',
            'fq-hero-label':'Soporte y Ayuda','fq-h1':'Preguntas Frecuentes','fq-search-ph':'Buscar preguntas…',
            'fq-tab-all':'Todos','fq-tab-products':'Productos','fq-tab-install':'Instalaci\u00f3n','fq-tab-pricing':'Precios','fq-tab-maint':'Mantenimiento',
            'ev-h1':'Eventos',
            'nw-hero-label':'Novedades de la Empresa','nw-h1':'Noticias de Jontai Energy','nw-section-label':'Cronolog\u00eda',
            'ct-hero-label':'Cont\u00e1ctenos','ct-h1':'Conect\u00e9monos','ct-info-eyebrow':'Cont\u00e1ctenos Directamente','ct-form-eyebrow':'Enviar un Mensaje',
            'loc-h1':'Ubicaci\u00f3n y Horarios',
            'wu-hero-label':'Nuestro Compromiso','wu-h1':'Por Qu\u00e9 Elegir Jontai Energy',
            'wu-intro-eyebrow':'M\u00e1s Que Paneles Solares','wu-reasons-eyebrow':'Seis S\u00f3lidas Razones','wu-benefits-eyebrow':'La Ventaja Jontai',
            'rv-hero-label':'Clientes Reales. Resultados Reales.','rv-h1':'Opiniones de Clientes',
            'rv-score-label':'Calificaci\u00f3n Promedio','rv-section-eyebrow':'Lo Que Dicen','rv-h2':'La Confianza de Aruba',
            'qt-hero-label':'Cotizaci\u00f3n Gratuita Sin Compromiso','qt-h1':'\u00bfQu\u00e9 Est\u00e1 Buscando?',
            'qt-solar-eyebrow':'Energ\u00eda Solar','qt-led-eyebrow':'Iluminaci\u00f3n LED',
            'qt-comb-eyebrow':'Mejor Valor','qt-comb-h3':'Solar y LED Juntos',
            'ww-hero-label':'Carreras en Jontai Energy','ww-h1':'Construye el Futuro de la Energ\u00eda Limpia',
            'ww-intro-eyebrow':'Por Qu\u00e9 Jontai Energy','ww-process-eyebrow':'C\u00f3mo Funciona','ww-jobs-eyebrow':'Vacantes Actuales',
            'sv-hero-label':'Soporte','sv-h1':'Servicio y Repuestos',
            'rt-h1':'Devoluciones y Soporte de Productos',
            'wa-h1':'Pol\u00edtica de Garant\u00eda','tm-h1':'T\u00e9rminos y Condiciones','pv-h1':'Pol\u00edtica de Privacidad',
            'ac-hero-label':'Accesibilidad','ac-h1':'Accesibilidad en Jontai Energy',
            'sc-hero-label':'Con\u00e9ctese Con Nosotros','sc-h1':'Sigue a Jontai Energy',
            'cl-hero-label':'Pr\u00f3ximos Eventos','cl-h1':'Eventos Pr\u00f3ximos','cl-eyebrow':'Calendario',
            'hr-hero-label':'Horario','hr-h1':'Horarios de Apertura',
            'hr-schedule-eyebrow':'Horario Semanal','hr-schedule-h2':'Cu\u00e1ndo Estamos Abiertos Para Usted',
            'hr-holidays-eyebrow':'Festivos Oficiales','hr-holidays-h2':'Horarios de Festivos','hr-find-eyebrow':'Enc\u00fantrenos',
            // â”€â”€ Subscription panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'sub-h':'Suscr\u00edbase a las Actualizaciones','sub-p':'Mant\u00e9ngase informado sobre nuestros \u00faltimos productos y noticias',
            'sub-name-label':'Nombre','sub-email-label':'Correo Electr\u00f3nico',
            'sub-name-ph':'Ingrese su nombre','sub-email-ph':'Ingrese su correo electr\u00f3nico',
            'sub-toggle':'Notificaciones por Correo','sub-toggle-desc':'Reciba actualizaciones sobre nuevos productos y tendencias',
            'sub-btn':'Suscribirse Ahora',
            // â”€â”€ About â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ab-story-h2':'Un Negocio Familiar Construido sobre Energ\u00eda Limpia',
            'ab-stat-install':'Instalaciones','ab-stat-customers':'Clientes Satisfechos',
            'ab-stat-energy':'Energ\u00eda Limpia Generada','ab-stat-years':'A\u00f1os de Experiencia',
            'ab-team-h2':'Conozca a Nuestros L\u00edderes',
            'ab-role-cfw':'Fundador y CFO','ab-role-lily':'Directora Ejecutiva',
            'ab-role-chakho':'Director de Tecnolog\u00eda','ab-role-chingho':'Director de Marketing',
            'ab-role-bob':'Director de Informaci\u00f3n',
            'ab-cta-h3':'\u00bfListo para la energ\u00eda solar?','ab-cta-p':'Hable con nuestros expertos y obtenga una cotizaci\u00f3n gratuita hoy.','ab-cta-btn':'Obtener Cotizaci\u00f3n',
            // â”€â”€ Accessibility â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ac-commitment-h2':'Nuestro Compromiso',
            'ac-wheelchair-h3':'Acceso para Sillas de Ruedas y Movilidad','ac-parking-h3':'Estacionamiento Accesible',
            'ac-staff-h3':'Asistencia del Personal','ac-phone-h3':'Pedidos por Tel\u00e9fono y WhatsApp',
            'ac-resize-h3':'Cambio de Tama\u00f1o de Texto','ac-contrast-h3':'Contraste de Color',
            'ac-keyboard-h3':'Navegaci\u00f3n por Teclado','ac-lang-h3':'Opciones de Idioma',
            'ac-mobile-h3':'Compatible con M\u00f3viles y Lectores de Pantalla',
            'ac-report-h3':'Reportar un Problema','ac-improve-h3':'Mejora Continua',
            'ac-cta-h3':'\u00bfNecesita ayuda o desea dar su opini\u00f3n?',
            // â”€â”€ Celebrations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'cl-section-h2':'Eventos y Celebraciones',
            'cl-event1-h3':'Pagara \u2014 Fuegos Artificiales de Nochevieja',
            'cl-event2-h3':'Celebraci\u00f3n del A\u00f1o Nuevo Chino',
            'cl-more-eyebrow':'Explorar M\u00e1s','cl-more-h2':'Tambi\u00e9n en Jontai Energy',
            'cl-cta-h3':'No se pierda ning\u00fan evento',
            // â”€â”€ Contact â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ct-info-h2':'Siempre Aqu\u00ed Para Usted','ct-form-h2':'\u00bfC\u00f3mo Podemos Ayudarle?',
            'ct-visit-label':'Vis\u00edtenos','ct-call-label':'Ll\u00e1menos',
            'ct-email-label':'Escr\u00edbanos','ct-hours-label':'Horario Comercial',
            // â”€â”€ Events â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ev-celebrations-h2':'Celebraciones','ev-holiday-h2':'Horarios de Festivos',
            // â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'fq-q1':'\u00bfQu\u00e9 tipos de paneles solares ofrecen?',
            'fq-q2':'\u00bfCu\u00e1l es la eficiencia de sus paneles solares?',
            'fq-q3':'\u00bfOfrecen soluciones de iluminaci\u00f3n LED?',
            'fq-q4':'\u00bfCu\u00e1nto tiempo tarda la instalaci\u00f3n?',
            'fq-q5':'\u00bfOfrecen servicio de instalaci\u00f3n o solo productos?',
            'fq-q6':'\u00bfLos paneles solares funcionar\u00e1n en mi tipo de techo?',
            'fq-q7':'\u00bfCu\u00e1nto cuesta un sistema de paneles solares?',
            'fq-q8':'\u00bfHay opciones de financiamiento disponibles?',
            'fq-q9':'\u00bfQu\u00e9 incentivos y reembolsos est\u00e1n disponibles?',
            'fq-q10':'\u00bfCu\u00e1nto mantenimiento requieren los paneles solares?',
            'fq-q11':'\u00bfCu\u00e1l es la vida \u00fatil de los paneles solares?',
            'fq-q12':'\u00bfQu\u00e9 pasa si un panel se da\u00f1a?',
            'fq-q13':'\u00bfCu\u00e1nto puedo ahorrar en mi factura el\u00e9ctrica?',
            'fq-q14':'\u00bfLos paneles solares funcionan en d\u00edas nublados?',
            'fq-q15':'\u00bfPuedo almacenar el exceso de energ\u00eda producida?',
            'fq-cta-h3':'\u00bfA\u00fan tiene preguntas?',
            // â”€â”€ Hours â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'hr-visit-h2':'Vis\u00edtenos en Jontai Energy','hr-contact-h3':'\u00bfTiene alguna pregunta?',
            'hr-tbd-h3':'Por Determinarse',
            // â”€â”€ Location â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'loc-map-h2':'Enc\u00fantrenos','loc-hours-h2':'Horario de Apertura',
            // â”€â”€ News â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'nw-h2':'Noticias','nw-item1-h3':'Sitio Web Inaugurado',
            'nw-item2-h3':'Fundaci\u00f3n de Jontai Energy','nw-cta-h3':'\u00bfDesea mantenerse informado?',
            // â”€â”€ Privacy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'legal-toc-h2':'Tabla de Contenidos',
            'pv-who-h2':'Qui\u00e9nes Somos','pv-data-h2':'Datos que Recopilamos',
            'pv-use-h2':'C\u00f3mo Usamos sus Datos','pv-legal-h2':'Base Legal del Tratamiento',
            'pv-share-h2':'Compartici\u00f3n de Datos','pv-retain-h2':'Retenci\u00f3n de Datos',
            'pv-rights-h2':'Sus Derechos','pv-security-h2':'Seguridad',
            'pv-cookies-h2':'Cookies','pv-changes-h2':'Cambios en esta Pol\u00edtica',
            'pv-cta-h3':'\u00bfPreguntas sobre su privacidad?',
            // â”€â”€ Quote â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'qt-solar-h2':'Cotizaci\u00f3n Solar','qt-led-h2':'Cotizaci\u00f3n LED',
            // â”€â”€ Returns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'rt-policy-h2':'Pol\u00edtica de Devoluciones y Soporte al Consumidor',
            'rt-unopened-h3':'Productos Sin Abrir / Sin Usar','rt-defective-h3':'Productos Defectuosos',
            'rt-wrong-h3':'Art\u00edculo Incorrecto Recibido','rt-opened-h3':'Productos Abiertos pero Sin Usar',
            'rt-installed-h3':'Productos Instalados (Sin Defectos)',
            'rt-custom-h3':'Art\u00edculos Personalizados o de Encargo Especial',
            'rt-late-h3':'Devoluciones Despu\u00e9s de 14 D\u00edas (Sin Defectos)',
            'rt-cta-h3':'\u00bfNecesita devolver o intercambiar un producto?',
            // â”€â”€ Reviews â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'rv-cta-h3':'\u00bfTuvo una gran experiencia?','rv-about-h2':'Lo que Nos Distingue',
            // â”€â”€ Service â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'sv-promise-h2':'Compromisos de Servicio y Garant\u00eda',
            'sv-solar-h3':'Reparaci\u00f3n de Paneles Solares','sv-inverter-h3':'Servicio de Inversor y Bater\u00eda',
            'sv-led-h3':'Reparaci\u00f3n de Accesorios LED','sv-electrical-h3':'Hardware El\u00e9ctrico',
            'sv-preventive-h3':'Mantenimiento Preventivo','sv-onsite-h3':'Visitas In Situ',
            'sv-cta-h3':'\u00bfListo para traer su producto?',
            // â”€â”€ Legal shared â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'tm-s1-h2':'Partes y Aplicabilidad','tm-s2-h2':'Pedidos y Precios',
            'tm-s3-h2':'Pago','tm-s4-h2':'Entrega e Instalaci\u00f3n',
            'tm-s5-h2':'Devoluciones y Cancelaciones','tm-s6-h2':'Responsabilidad',
            'tm-s7-h2':'Propiedad Intelectual','tm-s8-h2':'Derechos del Consumidor',
            'tm-s9-h2':'Disputas y Ley Aplicable','tm-s10-h2':'Cambios en Estos T\u00e9rminos',
            'tm-cta-h3':'\u00bfTiene preguntas sobre nuestros t\u00e9rminos?',
            'wa-s1-h2':'Cobertura de Garant\u00eda','wa-s2-h2':'Per\u00edodos de Garant\u00eda',
            'wa-s3-h2':'Exclusiones','wa-s4-h2':'Presentar un Reclamo de Garant\u00eda',
            'wa-s5-h2':'Remedios','wa-s6-h2':'Garant\u00eda de Instalaci\u00f3n',
            'wa-s7-h2':'Derechos Legales','wa-s8-h2':'Contacto y Soporte',
            'wa-cta-h3':'\u00bfNecesita presentar un reclamo de garant\u00eda?',
            // â”€â”€ Why-us â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'wu-story-h2':'Un Socio en el que Realmente Puede Confiar',
            'wu-pillar-promise':'Nuestra Promesa','wu-pillar-track':'Nuestro Historial',
            'wu-reasons-h2':'Lo que Nos Distingue',
            'wu-r1-h3':'Empresa Familiar','wu-r2-h3':'Productos Premium',
            'wu-r3-h3':'Instalaci\u00f3n Experta','wu-r4-h3':'Precios Competitivos',
            'wu-r5-h3':'Soporte Excepcional','wu-r6-h3':'Compromiso Ambiental',
            'wu-benefits-h2':'Construido Para Usted',
            'wu-b1-h4':'Instalaci\u00f3n R\u00e1pida','wu-b2-h4':'Proceso Transparente',
            'wu-b3-h4':'Garant\u00edas y Seguros','wu-b4-h4':'Ahorro Comprobado',
            'wu-b5-h4':'Experiencia Local','wu-b6-h4':'Confiado por la Comunidad',
            // â”€â”€ Work-with-us â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ww-intro-h2':'M\u00e1s que un Trabajo \u2014 Una Misi\u00f3n',
            'ww-process-h2':'Nuestro Proceso de Contrataci\u00f3n','ww-jobs-h2':'Vacantes Disponibles',
            'ww-step1-h4':'Aplicar en L\u00ednea','ww-step2-h4':'Revisi\u00f3n Inicial',
            'ww-step3-h4':'Entrevista','ww-step4-h4':'Bienvenido al Equipo',
            'ww-j1-h3':'T\u00e9cnico de Instalaci\u00f3n Solar','ww-j2-h3':'Representante de Ventas',
            'ww-j3-h3':'Ingeniero Solar','ww-j4-h3':'Especialista en Atenci\u00f3n al Cliente',
            'ww-j5-h3':'Gerente de Operaciones',
            'ww-cta-h3':'\u00bfPreguntas antes de aplicar?','ww-modal-h3':'Aplicar para el Puesto'
        },
        zh: {
            'nav-inventory': '\u89e3\u51b3\u65b9\u6848', 'nav-discover': '\u63a2\u7d22', 'nav-hours': '\u5730\u70b9\u4e0e\u8425\u4e1a\u65f6\u95f4',
            'nav-faq': '\u5e38\u89c1\u95ee\u9898', 'nav-support': '\u652f\u6301', 'nav-lang': '\u8bed\u8a00', 'nav-new-customer': '\u65b0\u5ba2\u6237',
            'dd-solar-h': '\u592a\u9633\u80fd\u4ea7\u54c1', 'dd-solar-link': '\u67e5\u770b\u592a\u9633\u80fd',
            'dd-led-h': 'LED\u4ea7\u54c1', 'dd-led-link': '\u67e5\u770bLED',
            'dd-res-h': '\u8d44\u6e90', 'dd-events': '\u6d3b\u52a8', 'dd-news': '\u65b0\u95fb',
            'dd-why-h': '\u4e3a\u4f55\u9009\u62e9\u6211\u4eec', 'dd-why-link': '\u4e3a\u4f55\u9009\u62e9\u6211\u4eec', 'dd-reviews': '\u5ba2\u6237\u8bc4\u4ef7',
            'dd-company-h': '\u516c\u53f8', 'dd-about': '\u6211\u4eec\u7684\u6545\u4e8b', 'dd-careers': '\u62db\u8058',
            'hero-title': '\u9a71\u52a8\u60a8\u7684\u672a\u6765',
            'hero-sub': '\u4ee5\u592a\u9633\u80fd\u4e0eAndLED\u7167\u660e\u63a8\u52a8\u53ef\u6301\u7eed\u53d1\u5c55\u7684\u672a\u6765\u3002',
            'btn-inventory': '\u67e5\u770b\u89e3\u51b3\u65b9\u6848', 'btn-quote': '\u62a5\u4ef7', 'btn-learn': '\u4e86\u89e3\u66f4\u591a', 'btn-contact': '\u8054\u7cfb\u6211\u4eec',
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
            'cta-h': '\u6211\u4eec\u80fd\u5982\u4f55\u5e2e\u52a9\u60a8\uff1f', 'cta-sub': '\u8054\u7cfb\u4ea7\u54c1\u4e13\u5bb6\u6216\u5ba2\u6237\u7ecf\u7406',
            'ft-tagline': '\u4ee5\u592a\u9633\u80fd\u4e0eLED\u7167\u660e\u63a8\u52a8\u53ef\u6301\u7eed\u53d1\u5c55\u7684\u672a\u6765\u3002',
            'ft-company-h': '\u516c\u53f8', 'ft-about': '\u5173\u4e8e\u6211\u4eec', 'ft-news': '\u65b0\u95fb', 'ft-careers': '\u62db\u8058', 'ft-privacy': '\u9690\u79c1\u653f\u7b56',
            'ft-info-h': '\u4fe1\u606f', 'ft-faq': '\u5e38\u89c1\u95ee\u9898', 'ft-terms': '\u6761\u6b3e\u4e0e\u6761\u4ef6', 'ft-warranty': '\u4fdd\u4fee', 'ft-consumer': '\u6d88\u8d39\u8005\u6743\u76ca',
            'ft-support-h': '\u652f\u6301', 'ft-contact': '\u8054\u7cfb\u6211\u4eec', 'ft-account': '\u6211\u7684\u8d26\u6237',
            'ft-service': '\u670d\u52a1\u4e0e\u96f6\u4ef6', 'ft-returns': '\u9000\u8d27\u4e0e\u4ea7\u54c1\u652f\u6301', 'ft-access': '\u65e0\u969c\u788d',
            'ft-newsletter-h': '\u9879\u76ee\u66f4\u65b0',
            'ft-newsletter-p': '\u83b7\u53d6\u6709\u5173\u4ea7\u54c1\u3001\u5b89\u88c5\u548c\u65b0\u53d1\u5e03\u7684\u7b80\u8981\u66f4\u65b0\u3002',
            'ft-subscribe': '\u52a0\u5165\u5217\u8868',
            'cookie-title': '\u7f51\u7ad9 Cookie \u504f\u597d',
            'cookie-text': '\u6211\u4eec\u4f7f\u7528\u5fc5\u8981\u7684\u5b58\u50a8\u6765\u8bb0\u4f4f\u60a8\u7684\u8bed\u8a00\u504f\u597d\uff0c\u5e76\u4fdd\u6301\u7f51\u7ad9\u6b63\u5e38\u8fd0\u884c\u3002\u53ea\u6709\u5728\u60a8\u5141\u8bb8\u65f6\uff0c\u6211\u4eec\u624d\u4f1a\u4f7f\u7528\u5206\u6790 Cookie\u3002',
            'cookie-accept': '\u5168\u90e8\u63a5\u53d7',
            'cookie-essential': '\u4ec5\u5fc5\u8981',
            'cookie-manage': '\u7ba1\u7406\u504f\u597d',
            'cookie-policy': '\u9690\u79c1\u653f\u7b56',
            'cookie-pref-title': '\u7ba1\u7406 Cookie \u504f\u597d',
            'cookie-pref-text': '\u5fc5\u8981\u5b58\u50a8\u59cb\u7ec8\u5f00\u542f\uff0c\u56e0\u4e3a\u5b83\u652f\u6301\u7f51\u7ad9\u7684\u6838\u5fc3\u529f\u80fd\u3002\u9664\u975e\u60a8\u9009\u62e9\u5141\u8bb8\uff0c\u5426\u5219\u5206\u6790\u529f\u80fd\u4f1a\u4fdd\u6301\u5173\u95ed\u3002',
            'cookie-essential-label': '\u5fc5\u8981\u5b58\u50a8',
            'cookie-essential-desc': '\u4fdd\u6301\u8bed\u8a00\u504f\u597d\u548c\u7f51\u7ad9\u57fa\u672c\u529f\u80fd\u6b63\u5e38\u8fd0\u884c\u3002',
            'cookie-analytics-label': '\u5206\u6790 Cookie',
            'cookie-analytics-desc': '\u5728\u5f15\u5165\u5206\u6790\u5de5\u5177\u540e\uff0c\u5e2e\u52a9\u6211\u4eec\u4e86\u89e3\u7f51\u7ad9\u7684\u4f7f\u7528\u60c5\u51b5\u3002',
            'cookie-save': '\u4fdd\u5b58\u504f\u597d',
            'cookie-cancel': '\u53d6\u6d88',
            // â”€â”€ Page-specific content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'legal-hero-label':'\u6cd5\u5f8b',
            'ab-hero-label':'\u6211\u4eec\u7684\u6545\u4e8b','ab-h1':'\u5173\u4e8eJontai Energy','ab-story-eyebrow':'\u6211\u4eec\u662f\u8c01',
            'ab-mission-label':'\u6211\u4eec\u7684\u4f7f\u547d','ab-vision-label':'\u6211\u4eec\u7684\u613f\u666f',
            'ab-team-eyebrow':'\u5e55\u540e\u56e2\u961f',
            'fq-hero-label':'\u652f\u6301\u4e0e\u5e2e\u52a9','fq-h1':'\u5e38\u89c1\u95ee\u9898','fq-search-ph':'\u641c\u7d22\u95ee\u9898\u2026',
            'fq-tab-all':'\u5168\u90e8','fq-tab-products':'\u4ea7\u54c1','fq-tab-install':'\u5b89\u88c5','fq-tab-pricing':'\u4ef7\u683c','fq-tab-maint':'\u7ef4\u62a4',
            'ev-h1':'\u6d3b\u52a8',
            'nw-hero-label':'\u516c\u53f8\u52a8\u6001','nw-h1':'Jontai Energy\u65b0\u95fb','nw-section-label':'\u65f6\u95f4\u7ebf',
            'ct-hero-label':'\u8054\u7cfb\u6211\u4eec','ct-h1':'\u4e0e\u6211\u4eec\u8054\u7cfb','ct-info-eyebrow':'\u76f4\u63a5\u8054\u7cfb\u6211\u4eec','ct-form-eyebrow':'\u53d1\u9001\u6d88\u606f',
            'loc-h1':'\u5730\u5740\u4e0e\u8425\u4e1a\u65f6\u95f4',
            'wu-hero-label':'\u6211\u4eec\u7684\u627f\u8bfa','wu-h1':'\u4e3a\u4ec0\u4e48\u9009\u62e9Jontai Energy',
            'wu-intro-eyebrow':'\u4e0d\u53ea\u662f\u592a\u9633\u80fd\u677f','wu-reasons-eyebrow':'\u516d\u5927\u6709\u529b\u7406\u7531','wu-benefits-eyebrow':'Jontai\u4f18\u52bf',
            'rv-hero-label':'\u771f\u5b9e\u5ba2\u6237\uff0c\u771f\u5b9e\u6210\u679c\u3002','rv-h1':'\u5ba2\u6237\u8bc4\u4ef7',
            'rv-score-label':'\u5e73\u5747\u8bc4\u5206','rv-section-eyebrow':'\u4ed6\u4eec\u600e\u4e48\u8bf4','rv-h2':'\u963f\u9c81\u5df4\u7684\u4fe1\u8d56\u4e4b\u9009',
            'qt-hero-label':'\u514d\u8d39\u65e0\u4e49\u52a1\u62a5\u4ef7','qt-h1':'\u60a8\u5728\u5bfb\u627e\u4ec0\u4e48\uff1f',
            'qt-solar-eyebrow':'\u592a\u9633\u80fd','qt-led-eyebrow':'LED\u7167\u660e',
            'qt-comb-eyebrow':'\u6700\u4f18\u4ef7\u5024','qt-comb-h3':'\u592a\u9633\u80fd\u4e0eLED\u7ec4\u5408',
            'ww-hero-label':'Jontai Energy\u804c\u4e1a\u673a\u4f1a','ww-h1':'\u5171\u5efa\u6e05\u6d01\u80fd\u6e90\u7684\u672a\u6765',
            'ww-intro-eyebrow':'\u4e3a\u4ec0\u4e48\u9009\u62e9Jontai Energy','ww-process-eyebrow':'\u6d41\u7a0b\u4ecb\u7ecd','ww-jobs-eyebrow':'\u5f53\u524d\u804c\u4f4d\u7a7a\u7f3a',
            'sv-hero-label':'\u652f\u6301','sv-h1':'\u670d\u52a1\u4e0e\u914d\u4ef6',
            'rt-h1':'\u9000\u8d27\u4e0e\u4ea7\u54c1\u652f\u6301',
            'wa-h1':'\u4fdd\u4fee\u653f\u7b56','tm-h1':'\u6761\u6b3e\u4e0e\u6761\u4ef6','pv-h1':'\u9690\u79c1\u653f\u7b56',
            'ac-hero-label':'\u65e0\u969c\u788d\u8bbf\u95ee','ac-h1':'Jontai Energy\u65e0\u969c\u788d\u670d\u52a1',
            'sc-hero-label':'\u4e0e\u6211\u4eec\u5173\u6ce8','sc-h1':'\u5173\u6ce8Jontai Energy',
            'cl-hero-label':'\u6700\u65b0\u6d3b\u52a8','cl-h1':'\u5373\u5c06\u4e3e\u884c\u7684\u6d3b\u52a8','cl-eyebrow':'\u65e5\u5386',
            'hr-hero-label':'\u65f6\u95f4\u8868','hr-h1':'\u8425\u4e1a\u65f6\u95f4',
            'hr-schedule-eyebrow':'\u6bcf\u5468\u65f6\u95f4\u8868','hr-schedule-h2':'\u6211\u4eec\u7684\u5f00\u653e\u65f6\u95f4',
            'hr-holidays-eyebrow':'\u516c\u5171\u5047\u65e5','hr-holidays-h2':'\u5047\u65e5\u8425\u4e1a\u65f6\u95f4','hr-find-eyebrow':'\u627e\u5230\u6211\u4eec',
            // â”€â”€ Subscription panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'sub-h':'\u8ba2\u9605\u66f4\u65b0','sub-p':'\u4e86\u89e3\u6211\u4eec\u6700\u65b0\u4ea7\u54c1\u548c\u52a8\u6001',
            'sub-name-label':'\u59d3\u540d','sub-email-label':'\u7535\u5b50\u90ae\u4ef6',
            'sub-name-ph':'\u8bf7\u8f93\u5165\u60a8\u7684\u59d3\u540d','sub-email-ph':'\u8bf7\u8f93\u5165\u60a8\u7684\u7535\u5b50\u90ae\u4ef6',
            'sub-toggle':'\u7535\u5b50\u90ae\u4ef6\u901a\u77e5','sub-toggle-desc':'\u63a5\u6536\u5173\u4e8e\u65b0\u4ea7\u54c1\u548c\u8d8b\u52bf\u7684\u66f4\u65b0',
            'sub-btn':'\u7acb\u5373\u8ba2\u9605',
            // â”€â”€ About â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ab-story-h2':'\u57fa\u4e8e\u6e05\u6d01\u80fd\u6e90\u7684\u5bb6\u65cf\u4f01\u4e1a',
            'ab-stat-install':'\u5b89\u88c5','ab-stat-customers':'\u6ee1\u610f\u5ba2\u6237',
            'ab-stat-energy':'\u6e05\u6d01\u80fd\u6e90\u4ea7\u51fa','ab-stat-years':'\u5e74\u7ecf\u9a8c',
            'ab-team-h2':'\u8ba4\u8bc6\u6211\u4eec\u7684\u9886\u5bfc\u56e2\u961f',
            'ab-role-cfw':'\u521b\u59cb\u4eba\u517c\u9996\u5e2d\u8d22\u52a1\u5b98','ab-role-lily':'\u9996\u5e2d\u6267\u884c\u5b98',
            'ab-role-chakho':'\u9996\u5e2d\u6280\u672f\u5b98','ab-role-chingho':'\u9996\u5e2d\u8425\u9500\u5b98',
            'ab-role-bob':'\u9996\u5e2d\u4fe1\u606f\u5b98',
            'ab-cta-h3':'\u51c6\u5907\u597d\u4f7f\u7528\u592a\u9633\u80fd\u4e86\u5417\uff1f','ab-cta-p':'\u4e0e\u6211\u4eec\u7684\u4e13\u5bb6\u4ea4\u6d41\uff0c\u4eca\u5929\u83b7\u53d6\u514d\u8d39\u62a5\u4ef7\u3002','ab-cta-btn':'\u83b7\u53d6\u62a5\u4ef7',
            // â”€â”€ Accessibility â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ac-commitment-h2':'\u6211\u4eec\u7684\u627f\u8bfa',
            'ac-wheelchair-h3':'\u8f6e\u6905\u53ca\u65e0\u969c\u788d\u901a\u9053','ac-parking-h3':'\u65e0\u969c\u788d\u505c\u8f66',
            'ac-staff-h3':'\u5458\u5de5\u534f\u52a9','ac-phone-h3':'\u7535\u8bdd\u53caWhatsApp\u8ba2\u8d2d',
            'ac-resize-h3':'\u6587\u5b57\u5927\u5c0f\u8c03\u6574','ac-contrast-h3':'\u989c\u8272\u5bf9\u6bd4\u5ea6',
            'ac-keyboard-h3':'\u952e\u76d8\u5bfc\u822a','ac-lang-h3':'\u8bed\u8a00\u9009\u9879',
            'ac-mobile-h3':'\u79fb\u52a8\u7aef\u548c\u5c4f\u5e55\u9605\u8bfb\u5668\u53cb\u597d',
            'ac-report-h3':'\u62a5\u544a\u95ee\u9898','ac-improve-h3':'\u6301\u7eed\u6539\u8fdb',
            'ac-cta-h3':'\u9700\u8981\u5e2e\u52a9\u6216\u60f3\u63d0\u4f9b\u53cd\u9988\uff1f',
            // â”€â”€ Celebrations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'cl-section-h2':'\u6d3b\u52a8\u4e0e\u5e86\u5178',
            'cl-event1-h3':'Pagara \u2014 \u8de8\u5e74\u70df\u706b\u79c0',
            'cl-event2-h3':'\u519c\u5386\u65b0\u5e74\u5e86\u5178',
            'cl-more-eyebrow':'\u63a2\u7d22\u66f4\u591a','cl-more-h2':'\u4e5f\u5728Jontai Energy',
            'cl-cta-h3':'\u4e0d\u8981\u9519\u8fc7\u4efb\u4f55\u6d3b\u52a8',
            // â”€â”€ Contact â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ct-info-h2':'\u6211\u4eec\u968f\u65f6\u4e3a\u60a8\u670d\u52a1','ct-form-h2':'\u6211\u4eec\u5982\u4f55\u4e3a\u60a8\u63d0\u4f9b\u5e2e\u52a9\uff1f',
            'ct-visit-label':'\u6765\u8bbf','ct-call-label':'\u81f4\u7535\u6211\u4eec',
            'ct-email-label':'\u53d1\u9001\u90ae\u4ef6','ct-hours-label':'\u8425\u4e1a\u65f6\u95f4',
            // â”€â”€ Events â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ev-celebrations-h2':'\u5e86\u5178','ev-holiday-h2':'\u8282\u5047\u65e5\u8425\u4e1a\u65f6\u95f4',
            // â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'fq-q1':'\u4f60\u4eec\u63d0\u4f9b\u54ea\u4e9b\u7c7b\u578b\u7684\u592a\u9633\u80fd\u677f\uff1f',
            'fq-q2':'\u60a8\u7684\u592a\u9633\u80fd\u677f\u6548\u7387\u5982\u4f55\uff1f',
            'fq-q3':'\u4f60\u4eec\u63d0\u4f9b LED \u7167\u660e\u89e3\u51b3\u65b9\u6848\u5417\uff1f',
            'fq-q4':'\u5b89\u88c5\u9700\u8981\u591a\u957f\u65f6\u95f4\uff1f',
            'fq-q5':'\u4f60\u4eec\u63d0\u4f9b\u5b89\u88c5\u670d\u52a1\u8fd8\u662f\u4ec5\u9500\u552e\u4ea7\u54c1\uff1f',
            'fq-q6':'\u592a\u9633\u80fd\u677f\u9002\u7528\u4e8e\u6211\u7684\u5c4b\u9876\u7c7b\u578b\u5417\uff1f',
            'fq-q7':'\u592a\u9633\u80fd\u677f\u7cfb\u7edf\u7684\u8d39\u7528\u662f\u591a\u5c11\uff1f',
            'fq-q8':'\u6709\u878d\u8d44\u9009\u9879\u5417\uff1f',
            'fq-q9':'\u6709\u54ea\u4e9b\u6fc0\u52b1\u63aa\u65bd\u548c\u8fd4\u5229\uff1f',
            'fq-q10':'\u592a\u9633\u80fd\u677f\u9700\u8981\u591a\u5c11\u7ef4\u62a4\uff1f',
            'fq-q11':'\u592a\u9633\u80fd\u677f\u7684\u4f7f\u7528\u5bff\u547d\u662f\u591a\u4e45\uff1f',
            'fq-q12':'\u5982\u679c\u9762\u677f\u635f\u574f\u4e86\u600e\u4e48\u529e\uff1f',
            'fq-q13':'\u6211\u80fd\u5728\u7535\u8d39\u4e0a\u8282\u7701\u591a\u5c11\uff1f',
            'fq-q14':'\u9634\u5929\u592a\u9633\u80fd\u677f\u80fd\u5de5\u4f5c\u5417\uff1f',
            'fq-q15':'\u6211\u53ef\u4ee5\u50a8\u5b58\u591a\u4f59\u7684\u7535\u80fd\u5417\uff1f',
            'fq-cta-h3':'\u8fd8\u6709\u7591\u95ee\u5417\uff1f',
            // â”€â”€ Hours â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'hr-visit-h2':'\u6b22\u8fce\u6765\u8bbfJontai Energy','hr-contact-h3':'\u6709\u75d5\u95ee\u5417\uff1f',
            'hr-tbd-h3':'\u5f85\u5b9a',
            // â”€â”€ Location â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'loc-map-h2':'\u67e5\u627e\u6211\u4eec\u7684\u4f4d\u7f6e','loc-hours-h2':'\u8425\u4e1a\u65f6\u95f4',
            // â”€â”€ News â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'nw-h2':'\u65b0\u95fb','nw-item1-h3':'\u7f51\u7ad9\u4e0a\u7ebf',
            'nw-item2-h3':'Jontai Energy\u6210\u7acb','nw-cta-h3':'\u60f3\u4e86\u89e3\u6700\u65b0\u52a8\u6001\uff1f',
            // â”€â”€ Privacy â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'legal-toc-h2':'\u76ee\u5f55',
            'pv-who-h2':'\u5173\u4e8e\u6211\u4eec','pv-data-h2':'\u6211\u4eec\u6536\u96c6\u7684\u6570\u636e',
            'pv-use-h2':'\u6211\u4eec\u5982\u4f55\u4f7f\u7528\u60a8\u7684\u6570\u636e','pv-legal-h2':'\u5904\u7406\u7684\u6cd5\u5f8b\u4f9d\u636e',
            'pv-share-h2':'\u6570\u636e\u5171\u4eab','pv-retain-h2':'\u6570\u636e\u4fdd\u7559',
            'pv-rights-h2':'\u60a8\u7684\u6743\u5229','pv-security-h2':'\u5b89\u5168',
            'pv-cookies-h2':'Cookie','pv-changes-h2':'\u653f\u7b56\u53d8\u66f4',
            'pv-cta-h3':'\u5173\u4e8e\u9690\u79c1\u6709\u75d5\u95ee\uff1f',
            // â”€â”€ Quote â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'qt-solar-h2':'\u592a\u9633\u80fd\u62a5\u4ef7','qt-led-h2':'LED\u62a5\u4ef7',
            // â”€â”€ Returns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'rt-policy-h2':'\u9000\u8d27\u4e0e\u6d88\u8d39\u8005\u652f\u6301\u653f\u7b56',
            'rt-unopened-h3':'\u672a\u5f00\u5c01/\u672a\u4f7f\u7528\u4ea7\u54c1','rt-defective-h3':'\u7f3a\u9677\u4ea7\u54c1',
            'rt-wrong-h3':'\u6536\u5230\u9519\u8bef\u5546\u54c1','rt-opened-h3':'\u5df2\u5f00\u5c01\u4f46\u672a\u4f7f\u7528\u4ea7\u54c1',
            'rt-installed-h3':'\u5df2\u5b89\u88c5\u4ea7\u54c1\uff08\u65e0\u7f3a\u9677\uff09',
            'rt-custom-h3':'\u5b9a\u5236\u6216\u7279\u6b8a\u8ba2\u8d2d\u5546\u54c1',
            'rt-late-h3':'14\u5929\u540e\u9000\u8d27\uff08\u65e0\u7f3a\u9677\uff09',
            'rt-cta-h3':'\u9700\u8981\u9000\u8d27\u6216\u6362\u8d27\uff1f',
            // â”€â”€ Reviews â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'rv-cta-h3':'\u6709\u5f88\u597d\u7684\u4f53\u9a8c\uff1f','rv-about-h2':'\u6211\u4eec\u7684\u72ec\u7279\u4e4b\u5904',
            // â”€â”€ Service â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'sv-promise-h2':'\u670d\u52a1\u627f\u8bfa\u4e0e\u4fdd\u4fee\u5904\u7406',
            'sv-solar-h3':'\u592a\u9633\u80fd\u677f\u7ef4\u4fee','sv-inverter-h3':'\u9006\u53d8\u5668\u548c\u7535\u6c60\u670d\u52a1',
            'sv-led-h3':'LED\u706f\u5177\u7ef4\u4fee','sv-electrical-h3':'\u7535\u6c14\u786c\u4ef6',
            'sv-preventive-h3':'\u9884\u9632\u6027\u7ef4\u62a4','sv-onsite-h3':'\u4e0a\u95e8\u670d\u52a1',
            'sv-cta-h3':'\u51c6\u5907\u597d\u9001\u6765\u60a8\u7684\u4ea7\u54c1\u4e86\u5417\uff1f',
            // â”€â”€ Legal shared â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'tm-s1-h2':'\u5f53\u4e8b\u65b9\u4e0e\u9002\u7528\u8303\u56f4','tm-s2-h2':'\u8ba2\u5355\u4e0e\u5b9a\u4ef7',
            'tm-s3-h2':'\u4ed8\u6b3e','tm-s4-h2':'\u914d\u9001\u4e0e\u5b89\u88c5',
            'tm-s5-h2':'\u9000\u8d27\u4e0e\u53d6\u6d88','tm-s6-h2':'\u8d23\u4efb',
            'tm-s7-h2':'\u77e5\u8bc6\u4ea7\u6743','tm-s8-h2':'\u6d88\u8d39\u8005\u6743\u5229',
            'tm-s9-h2':'\u4e89\u8bae\u4e0e\u9002\u7528\u6cd5\u5f8b','tm-s10-h2':'\u6761\u6b3e\u53d8\u66f4',
            'tm-cta-h3':'\u5bf9\u6211\u4eec\u7684\u6761\u6b3e\u6709\u75d5\u95ee\uff1f',
            'wa-s1-h2':'\u4fdd\u4fee\u8303\u56f4','wa-s2-h2':'\u4fdd\u4fee\u671f',
            'wa-s3-h2':'\u6392\u9664\u4e8b\u9879','wa-s4-h2':'\u63d0\u51fa\u4fdd\u4fee\u7533\u8bf7',
            'wa-s5-h2':'\u8865\u6551\u63aa\u65bd','wa-s6-h2':'\u5b89\u88c5\u4fdd\u4fee',
            'wa-s7-h2':'\u6cd5\u5b9a\u6743\u5229','wa-s8-h2':'\u8054\u7cfb\u4e0e\u652f\u6301',
            'wa-cta-h3':'\u9700\u8981\u63d0\u51fa\u4fdd\u4fee\u7533\u8bf7\uff1f',
            // â”€â”€ Why-us â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'wu-story-h2':'\u4e00\u4e2a\u60a8\u771f\u6b63\u53ef\u4ee5\u4fe1\u8d56\u7684\u5408\u4f5c\u4f19\u4f34',
            'wu-pillar-promise':'\u6211\u4eec\u7684\u627f\u8bfa','wu-pillar-track':'\u6211\u4eec\u7684\u4e1a\u7ee9',
            'wu-reasons-h2':'\u6211\u4eec\u7684\u72ec\u7279\u4e4b\u5904',
            'wu-r1-h3':'\u5bb6\u65cf\u4f01\u4e1a','wu-r2-h3':'\u4f18\u8d28\u4ea7\u54c1',
            'wu-r3-h3':'\u4e13\u4e1a\u5b89\u88c5','wu-r4-h3':'\u6709\u7ade\u4e89\u529b\u7684\u4ef7\u683c',
            'wu-r5-h3':'\u5353\u8d8a\u652f\u6301','wu-r6-h3':'\u73af\u4fdd\u627f\u8bfa',
            'wu-benefits-h2':'\u4ee5\u60a8\u4e3a\u4e2d\u5fc3',
            'wu-b1-h4':'\u5feb\u901f\u5b89\u88c5','wu-b2-h4':'\u900f\u660e\u6d41\u7a0b',
            'wu-b3-h4':'\u8d28\u4fdd\u4e0e\u4fdd\u8bc1','wu-b4-h4':'\u7ecf\u8bc1\u5b9e\u7684\u8282\u7701',
            'wu-b5-h4':'\u672c\u5730\u4e13\u4e1a\u77e5\u8bc6','wu-b6-h4':'\u53d7\u793e\u533a\u4fe1\u8d56',
            // â”€â”€ Work-with-us â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
            'ww-intro-h2':'\u4e0d\u4ec5\u4ec5\u662f\u5de5\u4f5c\u2014\u2014\u4e00\u4efd\u4f7f\u547d',
            'ww-process-h2':'\u6211\u4eec\u7684\u62db\u8058\u6d41\u7a0b','ww-jobs-h2':'\u5f00\u653e\u804c\u4f4d',
            'ww-step1-h4':'\u5728\u7ebf\u7533\u8bf7','ww-step2-h4':'\u521d\u6b65\u5ba1\u6838',
            'ww-step3-h4':'\u9762\u8bd5','ww-step4-h4':'\u6b22\u8fce\u52a0\u5165',
            'ww-j1-h3':'\u592a\u9633\u80fd\u5b89\u88c5\u6280\u672f\u5458','ww-j2-h3':'\u9500\u552e\u4ee3\u8868',
            'ww-j3-h3':'\u592a\u9633\u80fd\u5de5\u7a0b\u5e08','ww-j4-h3':'\u5ba2\u6237\u652f\u6301\u4e13\u5458',
            'ww-j5-h3':'\u8fd0\u8425\u7ecf\u7406',
            'ww-cta-h3':'\u7533\u8bf7\u524d\u6709\u75d5\u95ee\uff1f','ww-modal-h3':'\u7533\u8bf7\u804c\u4f4d'
        }
    };

    function applyLang(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const t = TRANSLATIONS[lang];
            if (t && t[key] !== undefined) el.textContent = t[key];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            const t = TRANSLATIONS[lang];
            if (t && t[key] !== undefined) el.placeholder = t[key];
        });
        document.querySelectorAll('.lang-opt').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
        localStorage.setItem('je_lang', lang);
    }

    const COOKIE_CONSENT_KEY = 'je_cookie_consent_v1';

    function getLegalPageHref(pageName) {
        const normalizedPath = window.location.pathname.replace(/\\/g, '/');
        const inPagesDirectory = normalizedPath.indexOf('/pages/') !== -1;
        return inPagesDirectory ? `../${pageName}/index.html` : `pages/${pageName}/index.html`;
    }

    function getStoredCookieConsent() {
        try {
            const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
            if (!storedConsent) return null;
            const parsedConsent = JSON.parse(storedConsent);
            if (typeof parsedConsent !== 'object' || parsedConsent === null) return null;
            if (typeof parsedConsent.analytics !== 'boolean') return null;
            return parsedConsent;
        } catch (error) {
            return null;
        }
    }

    function emitCookieConsent(consent) {
        document.documentElement.dataset.cookieConsent = consent.analytics ? 'analytics' : 'essential';
        window.dispatchEvent(new CustomEvent('je:cookie-consent', {
            detail: consent
        }));
    }

    function saveCookieConsent(consent) {
        const normalizedConsent = {
            essential: true,
            analytics: Boolean(consent.analytics),
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(normalizedConsent));
        emitCookieConsent(normalizedConsent);
        return normalizedConsent;
    }

    function createCookieConsentUi() {
        if (document.getElementById('cookieNotice')) return;

        const privacyHref = getLegalPageHref('privacy');
        document.body.insertAdjacentHTML('beforeend', `
            <section class="cookie-notice" id="cookieNotice" aria-labelledby="cookieNoticeTitle" aria-describedby="cookieNoticeText" hidden>
                <div class="cookie-notice-copy">
                    <p class="cookie-notice-eyebrow">Privacy</p>
                    <h2 id="cookieNoticeTitle" data-i18n="cookie-title">Cookie Preferences</h2>
                    <p id="cookieNoticeText" data-i18n="cookie-text">We use essential storage to remember your language preference and keep the site working properly. We will only use analytics cookies if you allow them.</p>
                </div>
                <div class="cookie-notice-actions">
                    <button type="button" class="cookie-btn cookie-btn-primary" id="cookieAcceptAll" data-i18n="cookie-accept">Accept All</button>
                    <button type="button" class="cookie-btn cookie-btn-secondary" id="cookieEssentialOnly" data-i18n="cookie-essential">Essential Only</button>
                    <button type="button" class="cookie-btn cookie-btn-tertiary" id="cookieManage" data-i18n="cookie-manage">Manage Preferences</button>
                    <a href="${privacyHref}" class="cookie-policy-link" data-i18n="cookie-policy">Privacy Policy</a>
                </div>
            </section>
            <div class="cookie-modal-backdrop" id="cookieBackdrop" hidden></div>
            <section class="cookie-modal" id="cookieModal" role="dialog" aria-modal="true" aria-labelledby="cookieModalTitle" aria-describedby="cookieModalText" hidden>
                <div class="cookie-modal-header">
                    <div>
                        <p class="cookie-modal-kicker">Privacy</p>
                        <h2 id="cookieModalTitle" data-i18n="cookie-pref-title">Manage Cookie Preferences</h2>
                    </div>
                    <button type="button" class="cookie-modal-close" id="cookieCloseModal" aria-label="Close cookie preferences">&times;</button>
                </div>
                <p class="cookie-modal-text" id="cookieModalText" data-i18n="cookie-pref-text">Essential storage is always on because it supports core site functions. Analytics stays off unless you choose to allow it.</p>
                <div class="cookie-pref-list">
                    <label class="cookie-pref-row cookie-pref-row-locked">
                        <div class="cookie-pref-copy">
                            <strong data-i18n="cookie-essential-label">Essential storage</strong>
                            <span data-i18n="cookie-essential-desc">Keeps language preference and core site behavior working.</span>
                        </div>
                        <span class="cookie-switch cookie-switch-on" aria-hidden="true"></span>
                    </label>
                    <label class="cookie-pref-row" for="cookieAnalyticsToggle">
                        <div class="cookie-pref-copy">
                            <strong data-i18n="cookie-analytics-label">Analytics cookies</strong>
                            <span data-i18n="cookie-analytics-desc">Helps us understand site usage when analytics tools are added.</span>
                        </div>
                        <span class="cookie-toggle-wrap">
                            <input type="checkbox" id="cookieAnalyticsToggle" class="cookie-toggle-input">
                            <span class="cookie-toggle-slider" aria-hidden="true"></span>
                        </span>
                    </label>
                </div>
                <div class="cookie-modal-actions">
                    <button type="button" class="cookie-btn cookie-btn-primary" id="cookieSavePreferences" data-i18n="cookie-save">Save Preferences</button>
                    <button type="button" class="cookie-btn cookie-btn-secondary" id="cookieCancelModal" data-i18n="cookie-cancel">Cancel</button>
                </div>
            </section>
        `);
    }

    createCookieConsentUi();

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
    const savedLang = localStorage.getItem('je_lang') || 'en';
    applyLang(savedLang);
    syncFooterLangPanel(savedLang);

    const cookieNotice = document.getElementById('cookieNotice');
    const cookieModal = document.getElementById('cookieModal');
    const cookieBackdrop = document.getElementById('cookieBackdrop');
    const cookieAcceptAll = document.getElementById('cookieAcceptAll');
    const cookieEssentialOnly = document.getElementById('cookieEssentialOnly');
    const cookieManage = document.getElementById('cookieManage');
    const cookieCloseModal = document.getElementById('cookieCloseModal');
    const cookieCancelModal = document.getElementById('cookieCancelModal');
    const cookieSavePreferences = document.getElementById('cookieSavePreferences');
    const cookieAnalyticsToggle = document.getElementById('cookieAnalyticsToggle');

    function showCookieNotice() {
        if (!cookieNotice) return;
        cookieNotice.hidden = false;
    }

    function hideCookieNotice() {
        if (!cookieNotice) return;
        cookieNotice.hidden = true;
    }

    function openCookieModal() {
        if (!cookieModal || !cookieBackdrop) return;
        cookieBackdrop.hidden = false;
        cookieModal.hidden = false;
        document.body.classList.add('cookie-modal-open');
    }

    function closeCookieModal() {
        if (!cookieModal || !cookieBackdrop) return;
        cookieBackdrop.hidden = true;
        cookieModal.hidden = true;
        document.body.classList.remove('cookie-modal-open');
    }

    const storedCookieConsent = getStoredCookieConsent();
    if (storedCookieConsent) {
        if (cookieAnalyticsToggle) cookieAnalyticsToggle.checked = storedCookieConsent.analytics;
        hideCookieNotice();
        emitCookieConsent(storedCookieConsent);
    } else {
        if (cookieAnalyticsToggle) cookieAnalyticsToggle.checked = false;
        showCookieNotice();
    }

    if (cookieAcceptAll) {
        cookieAcceptAll.addEventListener('click', function() {
            saveCookieConsent({ analytics: true });
            hideCookieNotice();
            closeCookieModal();
        });
    }

    if (cookieEssentialOnly) {
        cookieEssentialOnly.addEventListener('click', function() {
            saveCookieConsent({ analytics: false });
            hideCookieNotice();
            closeCookieModal();
        });
    }

    if (cookieManage) {
        cookieManage.addEventListener('click', openCookieModal);
    }

    if (cookieCloseModal) {
        cookieCloseModal.addEventListener('click', closeCookieModal);
    }

    if (cookieCancelModal) {
        cookieCancelModal.addEventListener('click', closeCookieModal);
    }

    if (cookieBackdrop) {
        cookieBackdrop.addEventListener('click', closeCookieModal);
    }

    if (cookieSavePreferences) {
        cookieSavePreferences.addEventListener('click', function() {
            saveCookieConsent({ analytics: cookieAnalyticsToggle ? cookieAnalyticsToggle.checked : false });
            hideCookieNotice();
            closeCookieModal();
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && cookieModal && !cookieModal.hidden) {
            closeCookieModal();
        }
    });

    // Footer language panel functionality
    const languageBtn = document.getElementById('languageBtn');
    const languagePanel = document.getElementById('languagePanel');

    function syncFooterLangPanel(lang) {
        const btn = document.getElementById('languageBtn');
        const panel = document.getElementById('languagePanel');
        if (!panel || !btn) return;
        panel.querySelectorAll('.lang-panel-opt').forEach(function(o) {
            o.classList.toggle('active', o.dataset.lang === lang);
        });
        const activeOpt = panel.querySelector('.lang-panel-opt.active');
        if (activeOpt) {
            btn.querySelector('.current-flag').textContent = activeOpt.dataset.flag;
            btn.querySelector('.current-lang').textContent = activeOpt.dataset.label;
        }
    }

    if (languageBtn && languagePanel) {
        // Toggle panel open/closed
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = languagePanel.classList.contains('open');
            languagePanel.classList.toggle('open', !isOpen);
            languageBtn.classList.toggle('open', !isOpen);
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!languagePanel.contains(e.target) && !languageBtn.contains(e.target)) {
                languagePanel.classList.remove('open');
                languageBtn.classList.remove('open');
            }
        });

        // Handle option selection â€” uses same applyLang as nav picker
        languagePanel.querySelectorAll('.lang-panel-opt').forEach(function(opt) {
            opt.addEventListener('click', function() {
                applyLang(opt.dataset.lang);
                syncFooterLangPanel(opt.dataset.lang);
                languagePanel.classList.remove('open');
                languageBtn.classList.remove('open');
            });
        });
    }

    // Keep footer panel in sync when nav picker is used
    if (navLangDropdown) {
        navLangDropdown.querySelectorAll('.lang-opt').forEach(function(btn) {
            btn.addEventListener('click', function() {
                syncFooterLangPanel(btn.dataset.lang);
            });
        });
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
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new JontaiSiteApp().init();
});
