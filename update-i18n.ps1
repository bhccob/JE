$base = "C:\Users\bhcco\Documents\JE"
$enc  = [System.Text.Encoding]::UTF8

function Patch {
    param([string]$path, [System.Collections.Hashtable]$map)
    $c = [System.IO.File]::ReadAllText($path, $enc)
    $n = 0
    foreach ($from in $map.Keys) {
        if ($c.Contains($from)) { $c = $c.Replace($from, $map[$from]); $n++ }
    }
    [System.IO.File]::WriteAllText($path, $c, $enc)
    $pg = Split-Path (Split-Path $path) -Leaf
    Write-Host "  $pg : $n/$($map.Count) replacements"
}

# ── ABOUT ────────────────────────────────────────────────────────────────────
Patch "$base\pages\about\index.html" @{
    '<p class="about-hero-label">Our Story</p>' = '<p class="about-hero-label" data-i18n="ab-hero-label">Our Story</p>'
    '<h1>About Jontai Energy</h1>' = '<h1 data-i18n="ab-h1">About Jontai Energy</h1>'
    '<p class="story-eyebrow">Who We Are</p>' = '<p class="story-eyebrow" data-i18n="ab-story-eyebrow">Who We Are</p>'
    '<p class="team-eyebrow">The People Behind It</p>' = '<p class="team-eyebrow" data-i18n="ab-team-eyebrow">The People Behind It</p>'
    '<span class="pillar-label">Our Mission</span>' = '<span class="pillar-label" data-i18n="ab-mission-label">Our Mission</span>'
    '<span class="pillar-label">Our Vision</span>' = '<span class="pillar-label" data-i18n="ab-vision-label">Our Vision</span>'
}

# ── FAQ ──────────────────────────────────────────────────────────────────────
Patch "$base\pages\faq\index.html" @{
    '<p class="faq-hero-label">Support & Help</p>' = '<p class="faq-hero-label" data-i18n="fq-hero-label">Support &amp; Help</p>'
    '<h1>Frequently Asked<br>Questions</h1>' = '<h1 data-i18n="fq-h1">Frequently Asked Questions</h1>'
    'placeholder="Search questions&hellip;"' = 'placeholder="Search questions&hellip;" data-i18n-placeholder="fq-search-ph"'
    '<button class="category-tab active" data-cat="all">All</button>' = '<button class="category-tab active" data-cat="all" data-i18n="fq-tab-all">All</button>'
    '<button class="category-tab" data-cat="products">Products</button>' = '<button class="category-tab" data-cat="products" data-i18n="fq-tab-products">Products</button>'
    '<button class="category-tab" data-cat="installation">Installation</button>' = '<button class="category-tab" data-cat="installation" data-i18n="fq-tab-install">Installation</button>'
    '<button class="category-tab" data-cat="pricing">Pricing</button>' = '<button class="category-tab" data-cat="pricing" data-i18n="fq-tab-pricing">Pricing</button>'
    '<button class="category-tab" data-cat="maintenance">Maintenance</button>' = '<button class="category-tab" data-cat="maintenance" data-i18n="fq-tab-maint">Maintenance</button>'
}

# ── EVENTS ───────────────────────────────────────────────────────────────────
Patch "$base\pages\events\index.html" @{
    '<h1>Events</h1>' = '<h1 data-i18n="ev-h1">Events</h1>'
}

# ── NEWS ─────────────────────────────────────────────────────────────────────
Patch "$base\pages\news\index.html" @{
    '<p class="news-hero-label">Company Updates</p>' = '<p class="news-hero-label" data-i18n="nw-hero-label">Company Updates</p>'
    '<h1>Jontai Energy News</h1>' = '<h1 data-i18n="nw-h1">Jontai Energy News</h1>'
    '<p class="news-section-label">Timeline</p>' = '<p class="news-section-label" data-i18n="nw-section-label">Timeline</p>'
}

# ── CONTACT ──────────────────────────────────────────────────────────────────
Patch "$base\pages\contact\index.html" @{
    '<p class="contact-hero-label">Get In Touch</p>' = '<p class="contact-hero-label" data-i18n="ct-hero-label">Get In Touch</p>'
    "<h1>Let's Connect</h1>" = '<h1 data-i18n="ct-h1">Let&#x27;s Connect</h1>'
    '<p class="info-panel-eyebrow">Reach Us Directly</p>' = '<p class="info-panel-eyebrow" data-i18n="ct-info-eyebrow">Reach Us Directly</p>'
    '<p class="form-panel-eyebrow">Send a Message</p>' = '<p class="form-panel-eyebrow" data-i18n="ct-form-eyebrow">Send a Message</p>'
}

# ── LOCATION ─────────────────────────────────────────────────────────────────
Patch "$base\pages\location\index.html" @{
    '<h1>Location & Hours</h1>' = '<h1 data-i18n="loc-h1">Location &amp; Hours</h1>'
}

# ── WHY-US ───────────────────────────────────────────────────────────────────
Patch "$base\pages\why-us\index.html" @{
    '<p class="why-hero-label">Our Commitment</p>' = '<p class="why-hero-label" data-i18n="wu-hero-label">Our Commitment</p>'
    '<h1>Why Choose Jontai Energy</h1>' = '<h1 data-i18n="wu-h1">Why Choose Jontai Energy</h1>'
    '<p class="why-eyebrow">More Than Solar Panels</p>' = '<p class="why-eyebrow" data-i18n="wu-intro-eyebrow">More Than Solar Panels</p>'
    '<p class="section-eyebrow">Six Strong Reasons</p>' = '<p class="section-eyebrow" data-i18n="wu-reasons-eyebrow">Six Strong Reasons</p>'
    '<p class="benefits-eyebrow">The Jontai Advantage</p>' = '<p class="benefits-eyebrow" data-i18n="wu-benefits-eyebrow">The Jontai Advantage</p>'
}

# ── REVIEWS ──────────────────────────────────────────────────────────────────
Patch "$base\pages\reviews\index.html" @{
    '<p class="reviews-hero-label">Real Customers. Real Results.</p>' = '<p class="reviews-hero-label" data-i18n="rv-hero-label">Real Customers. Real Results.</p>'
    '<h1>Customer Reviews</h1>' = '<h1 data-i18n="rv-h1">Customer Reviews</h1>'
    '<span class="score-label">Average Rating</span>' = '<span class="score-label" data-i18n="rv-score-label">Average Rating</span>'
    '<p class="section-eyebrow">What They Say</p>' = '<p class="section-eyebrow" data-i18n="rv-section-eyebrow">What They Say</p>'
    '<h2>Trusted by Aruba</h2>' = '<h2 data-i18n="rv-h2">Trusted by Aruba</h2>'
}

# ── QUOTE ────────────────────────────────────────────────────────────────────
Patch "$base\pages\quote\index.html" @{
    '<p class="quote-hero-label">Free No-Obligation Quote</p>' = '<p class="quote-hero-label" data-i18n="qt-hero-label">Free No-Obligation Quote</p>'
    '<h1>What Are You Looking For?</h1>' = '<h1 data-i18n="qt-h1">What Are You Looking For?</h1>'
    '<p class="quote-hero-sub">Choose the type of solution' = '<p class="quote-hero-sub" data-i18n="qt-hero-sub">Choose the type of solution'
    '<div class="panel-eyebrow">Solar Energy</div>' = '<div class="panel-eyebrow" data-i18n="qt-solar-eyebrow">Solar Energy</div>'
    '<div class="panel-eyebrow">LED Lighting</div>' = '<div class="panel-eyebrow" data-i18n="qt-led-eyebrow">LED Lighting</div>'
    '<span class="combined-eyebrow">Best Value</span>' = '<span class="combined-eyebrow" data-i18n="qt-comb-eyebrow">Best Value</span>'
    '<h3>Solar &amp; LED Together</h3>' = '<h3 data-i18n="qt-comb-h3">Solar &amp; LED Together</h3>'
}

# ── WORK-WITH-US ─────────────────────────────────────────────────────────────
Patch "$base\pages\work-with-us\index.html" @{
    '<p class="ww-hero-label">Careers at Jontai Energy</p>' = '<p class="ww-hero-label" data-i18n="ww-hero-label">Careers at Jontai Energy</p>'
    '<h1>Build the Future<br>of Clean Energy</h1>' = '<h1 data-i18n="ww-h1">Build the Future of Clean Energy</h1>'
    '<p class="ww-eyebrow">Why Jontai Energy</p>' = '<p class="ww-eyebrow" data-i18n="ww-intro-eyebrow">Why Jontai Energy</p>'
    '<p class="process-eyebrow">How It Works</p>' = '<p class="process-eyebrow" data-i18n="ww-process-eyebrow">How It Works</p>'
    '<p class="section-eyebrow">Current Openings</p>' = '<p class="section-eyebrow" data-i18n="ww-jobs-eyebrow">Current Openings</p>'
}

# ── SERVICE ──────────────────────────────────────────────────────────────────
Patch "$base\pages\service\index.html" @{
    '<p class="sp-hero-label">Support</p>' = '<p class="sp-hero-label" data-i18n="sv-hero-label">Support</p>'
    '<h1>Service &amp; Parts</h1>' = '<h1 data-i18n="sv-h1">Service &amp; Parts</h1>'
}

# ── RETURNS ──────────────────────────────────────────────────────────────────
Patch "$base\pages\returns\index.html" @{
    '<p class="rp-hero-label">Support</p>' = '<p class="rp-hero-label" data-i18n="sv-hero-label">Support</p>'
    '<h1>Returns &amp; Product Support</h1>' = '<h1 data-i18n="rt-h1">Returns &amp; Product Support</h1>'
}

# ── WARRANTY ─────────────────────────────────────────────────────────────────
Patch "$base\pages\warranty\index.html" @{
    '<p class="legal-hero-label">Legal</p>' = '<p class="legal-hero-label" data-i18n="legal-hero-label">Legal</p>'
    '<h1>Warranty Policy</h1>' = '<h1 data-i18n="wa-h1">Warranty Policy</h1>'
}

# ── TERMS ────────────────────────────────────────────────────────────────────
Patch "$base\pages\terms\index.html" @{
    '<p class="legal-hero-label">Legal</p>' = '<p class="legal-hero-label" data-i18n="legal-hero-label">Legal</p>'
    '<h1>Terms &amp; Conditions</h1>' = '<h1 data-i18n="tm-h1">Terms &amp; Conditions</h1>'
}

# ── PRIVACY ──────────────────────────────────────────────────────────────────
Patch "$base\pages\privacy\index.html" @{
    '<p class="privacy-hero-label">Legal</p>' = '<p class="privacy-hero-label" data-i18n="legal-hero-label">Legal</p>'
    '<h1>Privacy Policy</h1>' = '<h1 data-i18n="pv-h1">Privacy Policy</h1>'
}

# ── ACCESSIBILITY ────────────────────────────────────────────────────────────
Patch "$base\pages\accessibility\index.html" @{
    '<p class="ac-hero-label">Accessibility</p>' = '<p class="ac-hero-label" data-i18n="ac-hero-label">Accessibility</p>'
    '<h1>Accessibility at Jontai Energy</h1>' = '<h1 data-i18n="ac-h1">Accessibility at Jontai Energy</h1>'
}

# ── SOCIALS ──────────────────────────────────────────────────────────────────
Patch "$base\pages\socials\index.html" @{
    '<p class="soc-hero-label">Connect With Us</p>' = '<p class="soc-hero-label" data-i18n="sc-hero-label">Connect With Us</p>'
    '<h1>Follow Jontai Energy</h1>' = '<h1 data-i18n="sc-h1">Follow Jontai Energy</h1>'
}

# ── CELEBRATIONS ────────────────────────────────────────────────────────────
Patch "$base\pages\celebrations\index.html" @{
    '<p class="hours-hero-label">What''s On</p>' = '<p class="hours-hero-label" data-i18n="cl-hero-label">What''s On</p>'
    '<h1>Upcoming Events</h1>' = '<h1 data-i18n="cl-h1">Upcoming Events</h1>'
    '<p class="events-eyebrow">Calendar</p>' = '<p class="events-eyebrow" data-i18n="cl-eyebrow">Calendar</p>'
}

# ── HOURS ────────────────────────────────────────────────────────────────────
Patch "$base\pages\hours\index.html" @{
    '<p class="hours-hero-label">Schedule</p>' = '<p class="hours-hero-label" data-i18n="hr-hero-label">Schedule</p>'
    '<h1>Opening Hours</h1>' = '<h1 data-i18n="hr-h1">Opening Hours</h1>'
    '<p class="hours-eyebrow">Weekly Schedule</p>' = '<p class="hours-eyebrow" data-i18n="hr-schedule-eyebrow">Weekly Schedule</p>'
    "<h2>When We're<br>Open for You</h2>" = '<h2 data-i18n="hr-schedule-h2">When We''re Open for You</h2>'
    '<p class="section-eyebrow">Public Holidays</p>' = '<p class="section-eyebrow" data-i18n="hr-holidays-eyebrow">Public Holidays</p>'
    '<h2>Holiday Hours</h2>' = '<h2 data-i18n="hr-holidays-h2">Holiday Hours</h2>'
    '<p class="section-eyebrow">Find Us</p>' = '<p class="section-eyebrow" data-i18n="hr-find-eyebrow">Find Us</p>'
}

# ────────────────────────────────────────────────────────────────────────────
# Now inject new keys into main.js TRANSLATIONS object
# ────────────────────────────────────────────────────────────────────────────
$jsPath = "$base\assets\js\main.js"
$js = [System.IO.File]::ReadAllText($jsPath, $enc)

$enNew = @"
,
            // ── Page-specific content ──────────────────────────────────────
            'legal-hero-label':'Legal',
            'ab-hero-label':'Our Story','ab-h1':'About Jontai Energy','ab-story-eyebrow':'Who We Are',
            'ab-mission-label':'Our Mission','ab-vision-label':'Our Vision',
            'ab-team-eyebrow':'The People Behind It',
            'fq-hero-label':'Support & Help','fq-h1':'Frequently Asked Questions',
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
            'hr-holidays-eyebrow':'Public Holidays','hr-holidays-h2':'Holiday Hours','hr-find-eyebrow':'Find Us'
"@

$esNew = @"
,
            // ── Page-specific content ──────────────────────────────────────
            'legal-hero-label':'Legal',
            'ab-hero-label':'Nuestra Historia','ab-h1':'Sobre Jontai Energy','ab-story-eyebrow':'Qui\u00e9nes Somos',
            'ab-mission-label':'Nuestra Misi\u00f3n','ab-vision-label':'Nuestra Visi\u00f3n',
            'ab-team-eyebrow':'El Equipo Detr\u00e1s',
            'fq-hero-label':'Soporte y Ayuda','fq-h1':'Preguntas Frecuentes',
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
            'hr-holidays-eyebrow':'Festivos Oficiales','hr-holidays-h2':'Horarios de Festivos','hr-find-eyebrow':'Enc\u00fantrenos'
"@

$zhNew = @"
,
            // ── Page-specific content ──────────────────────────────────────
            'legal-hero-label':'\u6cd5\u5f8b',
            'ab-hero-label':'\u6211\u4eec\u7684\u6545\u4e8b','ab-h1':'\u5173\u4e8eJontai Energy','ab-story-eyebrow':'\u6211\u4eec\u662f\u8c01',
            'ab-mission-label':'\u6211\u4eec\u7684\u4f7f\u547d','ab-vision-label':'\u6211\u4eec\u7684\u613f\u666f',
            'ab-team-eyebrow':'\u5e55\u540e\u56e2\u961f',
            'fq-hero-label':'\u652f\u6301\u4e0e\u5e2e\u52a9','fq-h1':'\u5e38\u89c1\u95ee\u9898',
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
            'hr-holidays-eyebrow':'\u516c\u5171\u5047\u65e5','hr-holidays-h2':'\u5047\u65e5\u8425\u4e1a\u65f6\u95f4','hr-find-eyebrow':'\u627e\u5230\u6211\u4eec'
"@

# Find injection points and insert
$js = $js.Replace("'ft-subscribe': 'Subscribe'",     "'ft-subscribe': 'Subscribe'" + $enNew)
$js = $js.Replace("'ft-subscribe': 'Suscribirse'",   "'ft-subscribe': 'Suscribirse'" + $esNew)
$js = $js.Replace("'ft-subscribe': '\u8ba2\u9605'",  "'ft-subscribe': '\u8ba2\u9605'" + $zhNew)

[System.IO.File]::WriteAllText($jsPath, $js, $enc)
Write-Host "main.js updated"
Write-Host "Done."
