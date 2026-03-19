$base = "C:\Users\bhcco\Documents\JE"
$enc  = [System.Text.Encoding]::UTF8

function Patch { param([string]$p,[hashtable]$map)
    $c=[System.IO.File]::ReadAllText($p,$enc); $n=0
    foreach ($k in $map.Keys){ if($c.Contains($k)){ $c=$c.Replace($k,$map[$k]); $n++ } }
    [System.IO.File]::WriteAllText($p,$c,$enc)
    Write-Host "  $(Split-Path (Split-Path $p) -Leaf): $n/$($map.Count)"
}

# ── GLOBAL: subscription panel (all 20 pages) ────────────────────────────────
$allFiles = (Get-ChildItem "$base\pages\*\index.html").FullName + "$base\index.html"
$subMap = [ordered]@{
    '<h2>Subscribe to Updates</h2>' = '<h2 data-i18n="sub-h">Subscribe to Updates</h2>'
    '<p>Stay informed about our latest products and news</p>' = '<p data-i18n="sub-p">Stay informed about our latest products and news</p>'
    '<label for="subscribeName">Name</label>' = '<label for="subscribeName" data-i18n="sub-name-label">Name</label>'
    'id="subscribeName" name="name" placeholder="Enter your name"' = 'id="subscribeName" name="name" placeholder="Enter your name" data-i18n-placeholder="sub-name-ph"'
    '<label for="subscribeEmail">Email</label>' = '<label for="subscribeEmail" data-i18n="sub-email-label">Email</label>'
    'id="subscribeEmail" name="email" placeholder="Enter your email"' = 'id="subscribeEmail" name="email" placeholder="Enter your email" data-i18n-placeholder="sub-email-ph"'
    '<span class="toggle-text">Email Notifications</span>' = '<span class="toggle-text" data-i18n="sub-toggle">Email Notifications</span>'
    '<p class="toggle-description">Receive updates about new products and trends</p>' = '<p class="toggle-description" data-i18n="sub-toggle-desc">Receive updates about new products and trends</p>'
    '<button type="submit" class="btn btn-submit-subscribe">Subscribe Now</button>' = '<button type="submit" class="btn btn-submit-subscribe" data-i18n="sub-btn">Subscribe Now</button>'
}
Write-Host "=== Subscription panel (all pages) ==="
foreach ($f in $allFiles) { Patch $f $subMap }

# ── ABOUT ────────────────────────────────────────────────────────────────────
Write-Host "`n=== about ==="
Patch "$base\pages\about\index.html" @{
    '<h2>A Family Business<br>Built on Clean Energy</h2>' = '<h2 data-i18n="ab-story-h2">A Family Business Built on Clean Energy</h2>'
    '<span class="stat-lbl">Installations</span>' = '<span class="stat-lbl" data-i18n="ab-stat-install">Installations</span>'
    '<span class="stat-lbl">Happy Customers</span>' = '<span class="stat-lbl" data-i18n="ab-stat-customers">Happy Customers</span>'
    '<span class="stat-lbl">Clean Energy Generated</span>' = '<span class="stat-lbl" data-i18n="ab-stat-energy">Clean Energy Generated</span>'
    '<span class="stat-lbl">Years of Experience</span>' = '<span class="stat-lbl" data-i18n="ab-stat-years">Years of Experience</span>'
    '<h2>Meet Our Leadership</h2>' = '<h2 data-i18n="ab-team-h2">Meet Our Leadership</h2>'
    '<span class="team-role">Founder &amp; CFO</span>' = '<span class="team-role" data-i18n="ab-role-cfw">Founder &amp; CFO</span>'
    '<span class="team-role">Chief Executive Officer</span>' = '<span class="team-role" data-i18n="ab-role-lily">Chief Executive Officer</span>'
    '<span class="team-role">Chief Technology Officer</span>' = '<span class="team-role" data-i18n="ab-role-chakho">Chief Technology Officer</span>'
    '<span class="team-role">Chief Marketing Officer</span>' = '<span class="team-role" data-i18n="ab-role-chingho">Chief Marketing Officer</span>'
    '<span class="team-role">Chief Information Officer</span>' = '<span class="team-role" data-i18n="ab-role-bob">Chief Information Officer</span>'
    '<h3>Ready to go solar?</h3>' = '<h3 data-i18n="ab-cta-h3">Ready to go solar?</h3>'
    '<p>Talk to our experts and get a free no-obligation quote today.</p>' = '<p data-i18n="ab-cta-p">Talk to our experts and get a free no-obligation quote today.</p>'
    '>Get a Quote <i class="fas fa-arrow-right"></i></a>' = ' data-i18n="ab-cta-btn">Get a Quote</a>'
}

# ── ACCESSIBILITY ────────────────────────────────────────────────────────────
Write-Host "`n=== accessibility ==="
Patch "$base\pages\accessibility\index.html" @{
    '<h2>Our Commitment</h2>' = '<h2 data-i18n="ac-commitment-h2">Our Commitment</h2>'
    '<h3>Wheelchair &amp; Mobility Access</h3>' = '<h3 data-i18n="ac-wheelchair-h3">Wheelchair &amp; Mobility Access</h3>'
    '<h3>Accessible Parking</h3>' = '<h3 data-i18n="ac-parking-h3">Accessible Parking</h3>'
    '<h3>Staff Assistance</h3>' = '<h3 data-i18n="ac-staff-h3">Staff Assistance</h3>'
    '<h3>Phone &amp; WhatsApp Orders</h3>' = '<h3 data-i18n="ac-phone-h3">Phone &amp; WhatsApp Orders</h3>'
    '<h3>Text Resizing</h3>' = '<h3 data-i18n="ac-resize-h3">Text Resizing</h3>'
    '<h3>Colour Contrast</h3>' = '<h3 data-i18n="ac-contrast-h3">Colour Contrast</h3>'
    '<h3>Keyboard Navigation</h3>' = '<h3 data-i18n="ac-keyboard-h3">Keyboard Navigation</h3>'
    '<h3>Language Options</h3>' = '<h3 data-i18n="ac-lang-h3">Language Options</h3>'
    '<h3>Mobile &amp; Screen Reader Friendly</h3>' = '<h3 data-i18n="ac-mobile-h3">Mobile &amp; Screen Reader Friendly</h3>'
    '<h3>Report an Issue</h3>' = '<h3 data-i18n="ac-report-h3">Report an Issue</h3>'
    '<h3>Continuous Improvement</h3>' = '<h3 data-i18n="ac-improve-h3">Continuous Improvement</h3>'
    '<h3>Need help or want to give feedback?</h3>' = '<h3 data-i18n="ac-cta-h3">Need help or want to give feedback?</h3>'
}

# ── CELEBRATIONS ────────────────────────────────────────────────────────────
Write-Host "`n=== celebrations ==="
Patch "$base\pages\celebrations\index.html" @{
    '<h2>Events &amp; Celebrations</h2>' = '<h2 data-i18n="cl-section-h2">Events &amp; Celebrations</h2>'
    "<h3>Pagara &mdash; New Year's Eve Fireworks</h3>" = '<h3 data-i18n="cl-event1-h3">Pagara &mdash; New Year&#x27;s Eve Fireworks</h3>'
    '<h3>Chinese New Year Celebration</h3>' = '<h3 data-i18n="cl-event2-h3">Chinese New Year Celebration</h3>'
    '<p class="section-eyebrow">Explore More</p>' = '<p class="section-eyebrow" data-i18n="cl-more-eyebrow">Explore More</p>'
    '<h2>Also at Jontai Energy</h2>' = '<h2 data-i18n="cl-more-h2">Also at Jontai Energy</h2>'
    "<h3>Don't miss an event</h3>" = '<h3 data-i18n="cl-cta-h3">Don&#x27;t miss an event</h3>'
}

# ── CONTACT ──────────────────────────────────────────────────────────────────
Write-Host "`n=== contact ==="
Patch "$base\pages\contact\index.html" @{
    "<h2>We're Always<br>Here For You</h2>" = '<h2 data-i18n="ct-info-h2">We&#x27;re Always Here For You</h2>'
    '<h2>How Can We<br>Help You?</h2>' = '<h2 data-i18n="ct-form-h2">How Can We Help You?</h2>'
    '<span class="info-item-label">Visit Us</span>' = '<span class="info-item-label" data-i18n="ct-visit-label">Visit Us</span>'
    '<span class="info-item-label">Call Us</span>' = '<span class="info-item-label" data-i18n="ct-call-label">Call Us</span>'
    '<span class="info-item-label">Email Us</span>' = '<span class="info-item-label" data-i18n="ct-email-label">Email Us</span>'
    '<span class="info-item-label">Business Hours</span>' = '<span class="info-item-label" data-i18n="ct-hours-label">Business Hours</span>'
}

# ── EVENTS ───────────────────────────────────────────────────────────────────
Write-Host "`n=== events ==="
Patch "$base\pages\events\index.html" @{
    '<h2>Celebrations</h2>' = '<h2 data-i18n="ev-celebrations-h2">Celebrations</h2>'
    '<h2>Holiday Opening Hours</h2>' = '<h2 data-i18n="ev-holiday-h2">Holiday Opening Hours</h2>'
}

# ── FAQ ──────────────────────────────────────────────────────────────────────
Write-Host "`n=== faq ==="
Patch "$base\pages\faq\index.html" @{
    '<h3>What types of solar panels do you offer?</h3>' = '<h3 data-i18n="fq-q1">What types of solar panels do you offer?</h3>'
    '<h3>What is the efficiency rating of your solar panels?</h3>' = '<h3 data-i18n="fq-q2">What is the efficiency rating of your solar panels?</h3>'
    '<h3>Do you provide LED lighting solutions?</h3>' = '<h3 data-i18n="fq-q3">Do you provide LED lighting solutions?</h3>'
    '<h3>How long does installation take?</h3>' = '<h3 data-i18n="fq-q4">How long does installation take?</h3>'
    '<h3>Do you provide installation services or just products?</h3>' = '<h3 data-i18n="fq-q5">Do you provide installation services or just products?</h3>'
    '<h3>Will solar panels work on my roof type?</h3>' = '<h3 data-i18n="fq-q6">Will solar panels work on my roof type?</h3>'
    '<h3>How much does a solar panel system cost?</h3>' = '<h3 data-i18n="fq-q7">How much does a solar panel system cost?</h3>'
    '<h3>Are there financing options available?</h3>' = '<h3 data-i18n="fq-q8">Are there financing options available?</h3>'
    '<h3>What incentives and rebates are available?</h3>' = '<h3 data-i18n="fq-q9">What incentives and rebates are available?</h3>'
    '<h3>How much maintenance do solar panels require?</h3>' = '<h3 data-i18n="fq-q10">How much maintenance do solar panels require?</h3>'
    '<h3>What is the lifespan of solar panels?</h3>' = '<h3 data-i18n="fq-q11">What is the lifespan of solar panels?</h3>'
    '<h3>What happens if a panel gets damaged?</h3>' = '<h3 data-i18n="fq-q12">What happens if a panel gets damaged?</h3>'
    '<h3>How much can I save on my electricity bill?</h3>' = '<h3 data-i18n="fq-q13">How much can I save on my electricity bill?</h3>'
    '<h3>Do solar panels work on cloudy days?</h3>' = '<h3 data-i18n="fq-q14">Do solar panels work on cloudy days?</h3>'
    '<h3>Can I store excess energy produced?</h3>' = '<h3 data-i18n="fq-q15">Can I store excess energy produced?</h3>'
    '<h3>Still have questions?</h3>' = '<h3 data-i18n="fq-cta-h3">Still have questions?</h3>'
}

# ── HOURS ────────────────────────────────────────────────────────────────────
Write-Host "`n=== hours ==="
Patch "$base\pages\hours\index.html" @{
    '<h2>Come Visit Jontai Energy</h2>' = '<h2 data-i18n="hr-visit-h2">Come Visit Jontai Energy</h2>'
    '<h3>Have a question?</h3>' = '<h3 data-i18n="hr-contact-h3">Have a question?</h3>'
    '<h3>TBD' = '<h3 data-i18n="hr-tbd-h3">TBD'
}

# ── LOCATION ─────────────────────────────────────────────────────────────────
Write-Host "`n=== location ==="
Patch "$base\pages\location\index.html" @{
    '<h2>Find Our Location</h2>' = '<h2 data-i18n="loc-map-h2">Find Our Location</h2>'
    '<h2>Opening Hours</h2>' = '<h2 data-i18n="loc-hours-h2">Opening Hours</h2>'
}

# ── NEWS ─────────────────────────────────────────────────────────────────────
Write-Host "`n=== news ==="
Patch "$base\pages\news\index.html" @{
    '<h2>News</h2>' = '<h2 data-i18n="nw-h2">News</h2>'
    '<h3>Website Launched</h3>' = '<h3 data-i18n="nw-item1-h3">Website Launched</h3>'
    '<h3>Jontai Energy Established</h3>' = '<h3 data-i18n="nw-item2-h3">Jontai Energy Established</h3>'
    '<h3>Want to stay in the loop?</h3>' = '<h3 data-i18n="nw-cta-h3">Want to stay in the loop?</h3>'
}

# ── PRIVACY ──────────────────────────────────────────────────────────────────
Write-Host "`n=== privacy ==="
Patch "$base\pages\privacy\index.html" @{
    '<h2>Table of Contents</h2>' = '<h2 data-i18n="legal-toc-h2">Table of Contents</h2>'
    '<h2>Who We Are</h2>' = '<h2 data-i18n="pv-who-h2">Who We Are</h2>'
    '<h2>Data We Collect</h2>' = '<h2 data-i18n="pv-data-h2">Data We Collect</h2>'
    '<h2>How We Use Your Data</h2>' = '<h2 data-i18n="pv-use-h2">How We Use Your Data</h2>'
    '<h2>Legal Basis for Processing</h2>' = '<h2 data-i18n="pv-legal-h2">Legal Basis for Processing</h2>'
    '<h2>Sharing of Data</h2>' = '<h2 data-i18n="pv-share-h2">Sharing of Data</h2>'
    '<h2>Data Retention</h2>' = '<h2 data-i18n="pv-retain-h2">Data Retention</h2>'
    '<h2>Your Rights</h2>' = '<h2 data-i18n="pv-rights-h2">Your Rights</h2>'
    '<h2>Security</h2>' = '<h2 data-i18n="pv-security-h2">Security</h2>'
    '<h2>Cookies</h2>' = '<h2 data-i18n="pv-cookies-h2">Cookies</h2>'
    '<h2>Changes to This Policy</h2>' = '<h2 data-i18n="pv-changes-h2">Changes to This Policy</h2>'
    '<h3>Questions about your privacy?</h3>' = '<h3 data-i18n="pv-cta-h3">Questions about your privacy?</h3>'
}

# ── QUOTE ────────────────────────────────────────────────────────────────────
Write-Host "`n=== quote ==="
Patch "$base\pages\quote\index.html" @{
    '<h2>Solar<br>Quote</h2>' = '<h2 data-i18n="qt-solar-h2">Solar Quote</h2>'
    '<h2>LED<br>Quote</h2>' = '<h2 data-i18n="qt-led-h2">LED Quote</h2>'
}

# ── RETURNS ──────────────────────────────────────────────────────────────────
Write-Host "`n=== returns ==="
Patch "$base\pages\returns\index.html" @{
    '<h2>The 1-Week Return &amp; Exchange Policy</h2>' = '<h2 data-i18n="rt-policy-h2">The 1-Week Return &amp; Exchange Policy</h2>'
    '<h3>Unopened / Unused Products</h3>' = '<h3 data-i18n="rt-unopened-h3">Unopened / Unused Products</h3>'
    '<h3>Defective Products</h3>' = '<h3 data-i18n="rt-defective-h3">Defective Products</h3>'
    '<h3>Wrong Item Received</h3>' = '<h3 data-i18n="rt-wrong-h3">Wrong Item Received</h3>'
    '<h3>Opened but Unused Products</h3>' = '<h3 data-i18n="rt-opened-h3">Opened but Unused Products</h3>'
    '<h3>Installed Products (Non-defective)</h3>' = '<h3 data-i18n="rt-installed-h3">Installed Products (Non-defective)</h3>'
    '<h3>Custom or Special-Order Items</h3>' = '<h3 data-i18n="rt-custom-h3">Custom or Special-Order Items</h3>'
    '<h3>Returns After 7 Days (Non-defective)</h3>' = '<h3 data-i18n="rt-late-h3">Returns After 7 Days (Non-defective)</h3>'
    '<h3>Need to return or exchange a product?</h3>' = '<h3 data-i18n="rt-cta-h3">Need to return or exchange a product?</h3>'
}

# ── REVIEWS ──────────────────────────────────────────────────────────────────
Write-Host "`n=== reviews ==="
Patch "$base\pages\reviews\index.html" @{
    '<h3>Had a great experience?</h3>' = '<h3 data-i18n="rv-cta-h3">Had a great experience?</h3>'
    '<h2>What Sets Us Apart</h2>' = '<h2 data-i18n="rv-about-h2">What Sets Us Apart</h2>'
}

# ── SERVICE ──────────────────────────────────────────────────────────────────
Write-Host "`n=== service ==="
Patch "$base\pages\service\index.html" @{
    '<h2>Our 1-Week Fix Promise</h2>' = '<h2 data-i18n="sv-promise-h2">Our 1-Week Fix Promise</h2>'
    '<h3>Solar Panel Repair</h3>' = '<h3 data-i18n="sv-solar-h3">Solar Panel Repair</h3>'
    '<h3>Inverter &amp; Battery Service</h3>' = '<h3 data-i18n="sv-inverter-h3">Inverter &amp; Battery Service</h3>'
    '<h3>LED Fixture Repair</h3>' = '<h3 data-i18n="sv-led-h3">LED Fixture Repair</h3>'
    '<h3>Electrical Hardware</h3>' = '<h3 data-i18n="sv-electrical-h3">Electrical Hardware</h3>'
    '<h3>Preventive Maintenance</h3>' = '<h3 data-i18n="sv-preventive-h3">Preventive Maintenance</h3>'
    '<h3>On-Site Visits</h3>' = '<h3 data-i18n="sv-onsite-h3">On-Site Visits</h3>'
    '<h3>Ready to bring in your product?</h3>' = '<h3 data-i18n="sv-cta-h3">Ready to bring in your product?</h3>'
}

# ── TERMS ────────────────────────────────────────────────────────────────────
Write-Host "`n=== terms ==="
Patch "$base\pages\terms\index.html" @{
    '<h2>Table of Contents</h2>' = '<h2 data-i18n="legal-toc-h2">Table of Contents</h2>'
    '<h2>Parties &amp; Applicability</h2>' = '<h2 data-i18n="tm-s1-h2">Parties &amp; Applicability</h2>'
    '<h2>Orders &amp; Pricing</h2>' = '<h2 data-i18n="tm-s2-h2">Orders &amp; Pricing</h2>'
    '<h2>Payment</h2>' = '<h2 data-i18n="tm-s3-h2">Payment</h2>'
    '<h2>Delivery &amp; Installation</h2>' = '<h2 data-i18n="tm-s4-h2">Delivery &amp; Installation</h2>'
    '<h2>Returns &amp; Cancellations</h2>' = '<h2 data-i18n="tm-s5-h2">Returns &amp; Cancellations</h2>'
    '<h2>Liability</h2>' = '<h2 data-i18n="tm-s6-h2">Liability</h2>'
    '<h2>Intellectual Property</h2>' = '<h2 data-i18n="tm-s7-h2">Intellectual Property</h2>'
    '<h2>Consumer Rights</h2>' = '<h2 data-i18n="tm-s8-h2">Consumer Rights</h2>'
    '<h2>Disputes &amp; Governing Law</h2>' = '<h2 data-i18n="tm-s9-h2">Disputes &amp; Governing Law</h2>'
    '<h2>Changes to These Terms</h2>' = '<h2 data-i18n="tm-s10-h2">Changes to These Terms</h2>'
    '<h3>Have a question about our terms?</h3>' = '<h3 data-i18n="tm-cta-h3">Have a question about our terms?</h3>'
}

# ── WARRANTY ─────────────────────────────────────────────────────────────────
Write-Host "`n=== warranty ==="
Patch "$base\pages\warranty\index.html" @{
    '<h2>Table of Contents</h2>' = '<h2 data-i18n="legal-toc-h2">Table of Contents</h2>'
    '<h2>Warranty Coverage</h2>' = '<h2 data-i18n="wa-s1-h2">Warranty Coverage</h2>'
    '<h2>Warranty Periods</h2>' = '<h2 data-i18n="wa-s2-h2">Warranty Periods</h2>'
    '<h2>Exclusions</h2>' = '<h2 data-i18n="wa-s3-h2">Exclusions</h2>'
    '<h2>Making a Warranty Claim</h2>' = '<h2 data-i18n="wa-s4-h2">Making a Warranty Claim</h2>'
    '<h2>Remedies</h2>' = '<h2 data-i18n="wa-s5-h2">Remedies</h2>'
    '<h2>Installation Warranty</h2>' = '<h2 data-i18n="wa-s6-h2">Installation Warranty</h2>'
    '<h2>Statutory Rights</h2>' = '<h2 data-i18n="wa-s7-h2">Statutory Rights</h2>'
    '<h2>Contact &amp; Support</h2>' = '<h2 data-i18n="wa-s8-h2">Contact &amp; Support</h2>'
    '<h3>Need to make a warranty claim?</h3>' = '<h3 data-i18n="wa-cta-h3">Need to make a warranty claim?</h3>'
}

# ── WHY-US ───────────────────────────────────────────────────────────────────
Write-Host "`n=== why-us ==="
Patch "$base\pages\why-us\index.html" @{
    '<h2>A Partner You Can<br>Actually Trust</h2>' = '<h2 data-i18n="wu-story-h2">A Partner You Can Actually Trust</h2>'
    '<span class="pillar-label">Our Promise</span>' = '<span class="pillar-label" data-i18n="wu-pillar-promise">Our Promise</span>'
    '<span class="pillar-label">Our Track Record</span>' = '<span class="pillar-label" data-i18n="wu-pillar-track">Our Track Record</span>'
    '<h2>What Sets Us Apart</h2>' = '<h2 data-i18n="wu-reasons-h2">What Sets Us Apart</h2>'
    '<h3>Family-Owned</h3>' = '<h3 data-i18n="wu-r1-h3">Family-Owned</h3>'
    '<h3>Premium Products</h3>' = '<h3 data-i18n="wu-r2-h3">Premium Products</h3>'
    '<h3>Expert Installation</h3>' = '<h3 data-i18n="wu-r3-h3">Expert Installation</h3>'
    '<h3>Competitive Pricing</h3>' = '<h3 data-i18n="wu-r4-h3">Competitive Pricing</h3>'
    '<h3>Outstanding Support</h3>' = '<h3 data-i18n="wu-r5-h3">Outstanding Support</h3>'
    '<h3>Environmental Commitment</h3>' = '<h3 data-i18n="wu-r6-h3">Environmental Commitment</h3>'
    '<h2>Built Around You</h2>' = '<h2 data-i18n="wu-benefits-h2">Built Around You</h2>'
    '<h4>Fast Installation</h4>' = '<h4 data-i18n="wu-b1-h4">Fast Installation</h4>'
    '<h4>Transparent Process</h4>' = '<h4 data-i18n="wu-b2-h4">Transparent Process</h4>'
    '<h4>Warranty &amp; Guarantees</h4>' = '<h4 data-i18n="wu-b3-h4">Warranty &amp; Guarantees</h4>'
    '<h4>Proven Savings</h4>' = '<h4 data-i18n="wu-b4-h4">Proven Savings</h4>'
    '<h4>Local Expertise</h4>' = '<h4 data-i18n="wu-b5-h4">Local Expertise</h4>'
    '<h4>Trusted by Community</h4>' = '<h4 data-i18n="wu-b6-h4">Trusted by Community</h4>'
}

# ── WORK-WITH-US ─────────────────────────────────────────────────────────────
Write-Host "`n=== work-with-us ==="
Patch "$base\pages\work-with-us\index.html" @{
    '<h2>Our Hiring Process</h2>' = '<h2 data-i18n="ww-process-h2">Our Hiring Process</h2>'
    '<h2>Open Positions</h2>' = '<h2 data-i18n="ww-jobs-h2">Open Positions</h2>'
    '<h4>Apply Online</h4>' = '<h4 data-i18n="ww-step1-h4">Apply Online</h4>'
    '<h4>Initial Review</h4>' = '<h4 data-i18n="ww-step2-h4">Initial Review</h4>'
    '<h4>Interview</h4>' = '<h4 data-i18n="ww-step3-h4">Interview</h4>'
    '<h4>Welcome Aboard</h4>' = '<h4 data-i18n="ww-step4-h4">Welcome Aboard</h4>'
    '<h3>Solar Installation Technician</h3>' = '<h3 data-i18n="ww-j1-h3">Solar Installation Technician</h3>'
    '<h3>Sales Representative</h3>' = '<h3 data-i18n="ww-j2-h3">Sales Representative</h3>'
    '<h3>Solar Engineer</h3>' = '<h3 data-i18n="ww-j3-h3">Solar Engineer</h3>'
    '<h3>Customer Support Specialist</h3>' = '<h3 data-i18n="ww-j4-h3">Customer Support Specialist</h3>'
    '<h3>Operations Manager</h3>' = '<h3 data-i18n="ww-j5-h3">Operations Manager</h3>'
    '<h3>Questions before applying?</h3>' = '<h3 data-i18n="ww-cta-h3">Questions before applying?</h3>'
    '<h3 id="modalTitle">Apply for Position</h3>' = '<h3 id="modalTitle" data-i18n="ww-modal-h3">Apply for Position</h3>'
}

# fix encoded em-dash h2 in work-with-us using regex
$wf = "$base\pages\work-with-us\index.html"
$wc = [System.IO.File]::ReadAllText($wf,$enc)
$wc = $wc -replace '<h2>More Than a Job[^<]+A Mission</h2>', '<h2 data-i18n="ww-intro-h2">More Than a Job — A Mission</h2>'
[System.IO.File]::WriteAllText($wf,$wc,$enc)
Write-Host "  ww intro h2 fixed via regex"

# ════════════════════════════════════════════════════════════════════════════
# Inject new translation keys into main.js
# ════════════════════════════════════════════════════════════════════════════
Write-Host "`n=== main.js ==="
$jsPath = "$base\assets\js\main.js"
$js = [System.IO.File]::ReadAllText($jsPath, $enc)

$enAdd = @"
,
            // ── Subscription panel ────────────────────────────────────────
            'sub-h':'Subscribe to Updates','sub-p':'Stay informed about our latest products and news',
            'sub-name-label':'Name','sub-email-label':'Email',
            'sub-name-ph':'Enter your name','sub-email-ph':'Enter your email',
            'sub-toggle':'Email Notifications','sub-toggle-desc':'Receive updates about new products and trends',
            'sub-btn':'Subscribe Now',
            // ── About ─────────────────────────────────────────────────────
            'ab-story-h2':'A Family Business Built on Clean Energy',
            'ab-stat-install':'Installations','ab-stat-customers':'Happy Customers',
            'ab-stat-energy':'Clean Energy Generated','ab-stat-years':'Years of Experience',
            'ab-team-h2':'Meet Our Leadership',
            'ab-role-cfw':'Founder & CFO','ab-role-lily':'Chief Executive Officer',
            'ab-role-chakho':'Chief Technology Officer','ab-role-chingho':'Chief Marketing Officer',
            'ab-role-bob':'Chief Information Officer',
            'ab-cta-h3':'Ready to go solar?','ab-cta-p':'Talk to our experts and get a free no-obligation quote today.','ab-cta-btn':'Get a Quote',
            // ── Accessibility ─────────────────────────────────────────────
            'ac-commitment-h2':'Our Commitment',
            'ac-wheelchair-h3':'Wheelchair & Mobility Access','ac-parking-h3':'Accessible Parking',
            'ac-staff-h3':'Staff Assistance','ac-phone-h3':'Phone & WhatsApp Orders',
            'ac-resize-h3':'Text Resizing','ac-contrast-h3':'Colour Contrast',
            'ac-keyboard-h3':'Keyboard Navigation','ac-lang-h3':'Language Options',
            'ac-mobile-h3':'Mobile & Screen Reader Friendly',
            'ac-report-h3':'Report an Issue','ac-improve-h3':'Continuous Improvement',
            'ac-cta-h3':'Need help or want to give feedback?',
            // ── Celebrations ──────────────────────────────────────────────
            'cl-section-h2':'Events & Celebrations',
            "cl-event1-h3":"Pagara — New Year's Eve Fireworks",
            'cl-event2-h3':'Chinese New Year Celebration',
            'cl-more-eyebrow':'Explore More','cl-more-h2':'Also at Jontai Energy',
            "cl-cta-h3":"Don't miss an event",
            // ── Contact ───────────────────────────────────────────────────
            "ct-info-h2":"We're Always Here For You",'ct-form-h2':'How Can We Help You?',
            'ct-visit-label':'Visit Us','ct-call-label':'Call Us',
            'ct-email-label':'Email Us','ct-hours-label':'Business Hours',
            // ── Events ────────────────────────────────────────────────────
            'ev-celebrations-h2':'Celebrations','ev-holiday-h2':'Holiday Opening Hours',
            // ── FAQ ───────────────────────────────────────────────────────
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
            // ── Hours ─────────────────────────────────────────────────────
            'hr-visit-h2':'Come Visit Jontai Energy','hr-contact-h3':'Have a question?',
            'hr-tbd-h3':'TBD — To Be Decided',
            // ── Location ──────────────────────────────────────────────────
            'loc-map-h2':'Find Our Location','loc-hours-h2':'Opening Hours',
            // ── News ──────────────────────────────────────────────────────
            'nw-h2':'News','nw-item1-h3':'Website Launched',
            'nw-item2-h3':'Jontai Energy Established','nw-cta-h3':'Want to stay in the loop?',
            // ── Privacy ───────────────────────────────────────────────────
            'legal-toc-h2':'Table of Contents',
            'pv-who-h2':'Who We Are','pv-data-h2':'Data We Collect',
            'pv-use-h2':'How We Use Your Data','pv-legal-h2':'Legal Basis for Processing',
            'pv-share-h2':'Sharing of Data','pv-retain-h2':'Data Retention',
            'pv-rights-h2':'Your Rights','pv-security-h2':'Security',
            'pv-cookies-h2':'Cookies','pv-changes-h2':'Changes to This Policy',
            'pv-cta-h3':'Questions about your privacy?',
            // ── Quote ─────────────────────────────────────────────────────
            'qt-solar-h2':'Solar Quote','qt-led-h2':'LED Quote',
            // ── Returns ───────────────────────────────────────────────────
            'rt-policy-h2':'The 1-Week Return & Exchange Policy',
            'rt-unopened-h3':'Unopened / Unused Products','rt-defective-h3':'Defective Products',
            'rt-wrong-h3':'Wrong Item Received','rt-opened-h3':'Opened but Unused Products',
            'rt-installed-h3':'Installed Products (Non-defective)',
            'rt-custom-h3':'Custom or Special-Order Items',
            'rt-late-h3':'Returns After 7 Days (Non-defective)',
            'rt-cta-h3':'Need to return or exchange a product?',
            // ── Reviews ───────────────────────────────────────────────────
            'rv-cta-h3':'Had a great experience?','rv-about-h2':'What Sets Us Apart',
            // ── Service ───────────────────────────────────────────────────
            'sv-promise-h2':'Our 1-Week Fix Promise',
            'sv-solar-h3':'Solar Panel Repair','sv-inverter-h3':'Inverter & Battery Service',
            'sv-led-h3':'LED Fixture Repair','sv-electrical-h3':'Electrical Hardware',
            'sv-preventive-h3':'Preventive Maintenance','sv-onsite-h3':'On-Site Visits',
            'sv-cta-h3':'Ready to bring in your product?',
            // ── Legal shared ──────────────────────────────────────────────
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
            // ── Why-us ────────────────────────────────────────────────────
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
            // ── Work-with-us ──────────────────────────────────────────────
            'ww-intro-h2':'More Than a Job — A Mission',
            'ww-process-h2':'Our Hiring Process','ww-jobs-h2':'Open Positions',
            'ww-step1-h4':'Apply Online','ww-step2-h4':'Initial Review',
            'ww-step3-h4':'Interview','ww-step4-h4':'Welcome Aboard',
            'ww-j1-h3':'Solar Installation Technician','ww-j2-h3':'Sales Representative',
            'ww-j3-h3':'Solar Engineer','ww-j4-h3':'Customer Support Specialist',
            'ww-j5-h3':'Operations Manager',
            'ww-cta-h3':'Questions before applying?','ww-modal-h3':'Apply for Position'
"@

$esAdd = @"
,
            // ── Subscription panel ────────────────────────────────────────
            'sub-h':'Suscr\u00edbase a las Actualizaciones','sub-p':'Mant\u00e9ngase informado sobre nuestros \u00faltimos productos y noticias',
            'sub-name-label':'Nombre','sub-email-label':'Correo Electr\u00f3nico',
            'sub-name-ph':'Ingrese su nombre','sub-email-ph':'Ingrese su correo electr\u00f3nico',
            'sub-toggle':'Notificaciones por Correo','sub-toggle-desc':'Reciba actualizaciones sobre nuevos productos y tendencias',
            'sub-btn':'Suscribirse Ahora',
            // ── About ─────────────────────────────────────────────────────
            'ab-story-h2':'Un Negocio Familiar Construido sobre Energ\u00eda Limpia',
            'ab-stat-install':'Instalaciones','ab-stat-customers':'Clientes Satisfechos',
            'ab-stat-energy':'Energ\u00eda Limpia Generada','ab-stat-years':'A\u00f1os de Experiencia',
            'ab-team-h2':'Conozca a Nuestros L\u00edderes',
            'ab-role-cfw':'Fundador y CFO','ab-role-lily':'Directora Ejecutiva',
            'ab-role-chakho':'Director de Tecnolog\u00eda','ab-role-chingho':'Director de Marketing',
            'ab-role-bob':'Director de Informaci\u00f3n',
            'ab-cta-h3':'\u00bfListo para la energ\u00eda solar?','ab-cta-p':'Hable con nuestros expertos y obtenga una cotizaci\u00f3n gratuita hoy.','ab-cta-btn':'Obtener Cotizaci\u00f3n',
            // ── Accessibility ─────────────────────────────────────────────
            'ac-commitment-h2':'Nuestro Compromiso',
            'ac-wheelchair-h3':'Acceso para Sillas de Ruedas y Movilidad','ac-parking-h3':'Estacionamiento Accesible',
            'ac-staff-h3':'Asistencia del Personal','ac-phone-h3':'Pedidos por Tel\u00e9fono y WhatsApp',
            'ac-resize-h3':'Cambio de Tama\u00f1o de Texto','ac-contrast-h3':'Contraste de Color',
            'ac-keyboard-h3':'Navegaci\u00f3n por Teclado','ac-lang-h3':'Opciones de Idioma',
            'ac-mobile-h3':'Compatible con M\u00f3viles y Lectores de Pantalla',
            'ac-report-h3':'Reportar un Problema','ac-improve-h3':'Mejora Continua',
            'ac-cta-h3':'\u00bfNecesita ayuda o desea dar su opini\u00f3n?',
            // ── Celebrations ──────────────────────────────────────────────
            'cl-section-h2':'Eventos y Celebraciones',
            'cl-event1-h3':'Pagara \u2014 Fuegos Artificiales de Nochevieja',
            'cl-event2-h3':'Celebraci\u00f3n del A\u00f1o Nuevo Chino',
            'cl-more-eyebrow':'Explorar M\u00e1s','cl-more-h2':'Tambi\u00e9n en Jontai Energy',
            'cl-cta-h3':'No se pierda ning\u00fan evento',
            // ── Contact ───────────────────────────────────────────────────
            'ct-info-h2':'Siempre Aqu\u00ed Para Usted','ct-form-h2':'\u00bfC\u00f3mo Podemos Ayudarle?',
            'ct-visit-label':'Vis\u00edtenos','ct-call-label':'Ll\u00e1menos',
            'ct-email-label':'Escr\u00edbanos','ct-hours-label':'Horario Comercial',
            // ── Events ────────────────────────────────────────────────────
            'ev-celebrations-h2':'Celebraciones','ev-holiday-h2':'Horarios de Festivos',
            // ── FAQ ───────────────────────────────────────────────────────
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
            // ── Hours ─────────────────────────────────────────────────────
            'hr-visit-h2':'Vis\u00edtenos en Jontai Energy','hr-contact-h3':'\u00bfTiene alguna pregunta?',
            'hr-tbd-h3':'Por Determinarse',
            // ── Location ──────────────────────────────────────────────────
            'loc-map-h2':'Enc\u00fantrenos','loc-hours-h2':'Horario de Apertura',
            // ── News ──────────────────────────────────────────────────────
            'nw-h2':'Noticias','nw-item1-h3':'Sitio Web Inaugurado',
            'nw-item2-h3':'Fundaci\u00f3n de Jontai Energy','nw-cta-h3':'\u00bfDesea mantenerse informado?',
            // ── Privacy ───────────────────────────────────────────────────
            'legal-toc-h2':'Tabla de Contenidos',
            'pv-who-h2':'Qui\u00e9nes Somos','pv-data-h2':'Datos que Recopilamos',
            'pv-use-h2':'C\u00f3mo Usamos sus Datos','pv-legal-h2':'Base Legal del Tratamiento',
            'pv-share-h2':'Compartici\u00f3n de Datos','pv-retain-h2':'Retenci\u00f3n de Datos',
            'pv-rights-h2':'Sus Derechos','pv-security-h2':'Seguridad',
            'pv-cookies-h2':'Cookies','pv-changes-h2':'Cambios en esta Pol\u00edtica',
            'pv-cta-h3':'\u00bfPreguntas sobre su privacidad?',
            // ── Quote ─────────────────────────────────────────────────────
            'qt-solar-h2':'Cotizaci\u00f3n Solar','qt-led-h2':'Cotizaci\u00f3n LED',
            // ── Returns ───────────────────────────────────────────────────
            'rt-policy-h2':'La Pol\u00edtica de Devoluci\u00f3n e Intercambio de 1 Semana',
            'rt-unopened-h3':'Productos Sin Abrir / Sin Usar','rt-defective-h3':'Productos Defectuosos',
            'rt-wrong-h3':'Art\u00edculo Incorrecto Recibido','rt-opened-h3':'Productos Abiertos pero Sin Usar',
            'rt-installed-h3':'Productos Instalados (Sin Defectos)',
            'rt-custom-h3':'Art\u00edculos Personalizados o de Encargo Especial',
            'rt-late-h3':'Devoluciones Despu\u00e9s de 7 D\u00edas (Sin Defectos)',
            'rt-cta-h3':'\u00bfNecesita devolver o intercambiar un producto?',
            // ── Reviews ───────────────────────────────────────────────────
            'rv-cta-h3':'\u00bfTuvo una gran experiencia?','rv-about-h2':'Lo que Nos Distingue',
            // ── Service ───────────────────────────────────────────────────
            'sv-promise-h2':'Nuestra Promesa de Reparaci\u00f3n en 1 Semana',
            'sv-solar-h3':'Reparaci\u00f3n de Paneles Solares','sv-inverter-h3':'Servicio de Inversor y Bater\u00eda',
            'sv-led-h3':'Reparaci\u00f3n de Accesorios LED','sv-electrical-h3':'Hardware El\u00e9ctrico',
            'sv-preventive-h3':'Mantenimiento Preventivo','sv-onsite-h3':'Visitas In Situ',
            'sv-cta-h3':'\u00bfListo para traer su producto?',
            // ── Legal shared ──────────────────────────────────────────────
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
            // ── Why-us ────────────────────────────────────────────────────
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
            // ── Work-with-us ──────────────────────────────────────────────
            'ww-intro-h2':'M\u00e1s que un Trabajo \u2014 Una Misi\u00f3n',
            'ww-process-h2':'Nuestro Proceso de Contrataci\u00f3n','ww-jobs-h2':'Vacantes Disponibles',
            'ww-step1-h4':'Aplicar en L\u00ednea','ww-step2-h4':'Revisi\u00f3n Inicial',
            'ww-step3-h4':'Entrevista','ww-step4-h4':'Bienvenido al Equipo',
            'ww-j1-h3':'T\u00e9cnico de Instalaci\u00f3n Solar','ww-j2-h3':'Representante de Ventas',
            'ww-j3-h3':'Ingeniero Solar','ww-j4-h3':'Especialista en Atenci\u00f3n al Cliente',
            'ww-j5-h3':'Gerente de Operaciones',
            'ww-cta-h3':'\u00bfPreguntas antes de aplicar?','ww-modal-h3':'Aplicar para el Puesto'
"@

$zhAdd = @"
,
            // ── Subscription panel ────────────────────────────────────────
            'sub-h':'\u8ba2\u9605\u66f4\u65b0','sub-p':'\u4e86\u89e3\u6211\u4eec\u6700\u65b0\u4ea7\u54c1\u548c\u52a8\u6001',
            'sub-name-label':'\u59d3\u540d','sub-email-label':'\u7535\u5b50\u90ae\u4ef6',
            'sub-name-ph':'\u8bf7\u8f93\u5165\u60a8\u7684\u59d3\u540d','sub-email-ph':'\u8bf7\u8f93\u5165\u60a8\u7684\u7535\u5b50\u90ae\u4ef6',
            'sub-toggle':'\u7535\u5b50\u90ae\u4ef6\u901a\u77e5','sub-toggle-desc':'\u63a5\u6536\u5173\u4e8e\u65b0\u4ea7\u54c1\u548c\u8d8b\u52bf\u7684\u66f4\u65b0',
            'sub-btn':'\u7acb\u5373\u8ba2\u9605',
            // ── About ─────────────────────────────────────────────────────
            'ab-story-h2':'\u57fa\u4e8e\u6e05\u6d01\u80fd\u6e90\u7684\u5bb6\u65cf\u4f01\u4e1a',
            'ab-stat-install':'\u5b89\u88c5','ab-stat-customers':'\u6ee1\u610f\u5ba2\u6237',
            'ab-stat-energy':'\u6e05\u6d01\u80fd\u6e90\u4ea7\u51fa','ab-stat-years':'\u5e74\u7ecf\u9a8c',
            'ab-team-h2':'\u8ba4\u8bc6\u6211\u4eec\u7684\u9886\u5bfc\u56e2\u961f',
            'ab-role-cfw':'\u521b\u59cb\u4eba\u517c\u9996\u5e2d\u8d22\u52a1\u5b98','ab-role-lily':'\u9996\u5e2d\u6267\u884c\u5b98',
            'ab-role-chakho':'\u9996\u5e2d\u6280\u672f\u5b98','ab-role-chingho':'\u9996\u5e2d\u8425\u9500\u5b98',
            'ab-role-bob':'\u9996\u5e2d\u4fe1\u606f\u5b98',
            'ab-cta-h3':'\u51c6\u5907\u597d\u4f7f\u7528\u592a\u9633\u80fd\u4e86\u5417\uff1f','ab-cta-p':'\u4e0e\u6211\u4eec\u7684\u4e13\u5bb6\u4ea4\u6d41\uff0c\u4eca\u5929\u83b7\u53d6\u514d\u8d39\u62a5\u4ef7\u3002','ab-cta-btn':'\u83b7\u53d6\u62a5\u4ef7',
            // ── Accessibility ─────────────────────────────────────────────
            'ac-commitment-h2':'\u6211\u4eec\u7684\u627f\u8bfa',
            'ac-wheelchair-h3':'\u8f6e\u6905\u53ca\u65e0\u969c\u788d\u901a\u9053','ac-parking-h3':'\u65e0\u969c\u788d\u505c\u8f66',
            'ac-staff-h3':'\u5458\u5de5\u534f\u52a9','ac-phone-h3':'\u7535\u8bdd\u53caWhatsApp\u8ba2\u8d2d',
            'ac-resize-h3':'\u6587\u5b57\u5927\u5c0f\u8c03\u6574','ac-contrast-h3':'\u989c\u8272\u5bf9\u6bd4\u5ea6',
            'ac-keyboard-h3':'\u952e\u76d8\u5bfc\u822a','ac-lang-h3':'\u8bed\u8a00\u9009\u9879',
            'ac-mobile-h3':'\u79fb\u52a8\u7aef\u548c\u5c4f\u5e55\u9605\u8bfb\u5668\u53cb\u597d',
            'ac-report-h3':'\u62a5\u544a\u95ee\u9898','ac-improve-h3':'\u6301\u7eed\u6539\u8fdb',
            'ac-cta-h3':'\u9700\u8981\u5e2e\u52a9\u6216\u60f3\u63d0\u4f9b\u53cd\u9988\uff1f',
            // ── Celebrations ──────────────────────────────────────────────
            'cl-section-h2':'\u6d3b\u52a8\u4e0e\u5e86\u5178',
            'cl-event1-h3':'Pagara \u2014 \u8de8\u5e74\u70df\u706b\u79c0',
            'cl-event2-h3':'\u519c\u5386\u65b0\u5e74\u5e86\u5178',
            'cl-more-eyebrow':'\u63a2\u7d22\u66f4\u591a','cl-more-h2':'\u4e5f\u5728Jontai Energy',
            'cl-cta-h3':'\u4e0d\u8981\u9519\u8fc7\u4efb\u4f55\u6d3b\u52a8',
            // ── Contact ───────────────────────────────────────────────────
            'ct-info-h2':'\u6211\u4eec\u968f\u65f6\u4e3a\u60a8\u670d\u52a1','ct-form-h2':'\u6211\u4eec\u5982\u4f55\u4e3a\u60a8\u63d0\u4f9b\u5e2e\u52a9\uff1f',
            'ct-visit-label':'\u6765\u8bbf','ct-call-label':'\u81f4\u7535\u6211\u4eec',
            'ct-email-label':'\u53d1\u9001\u90ae\u4ef6','ct-hours-label':'\u8425\u4e1a\u65f6\u95f4',
            // ── Events ────────────────────────────────────────────────────
            'ev-celebrations-h2':'\u5e86\u5178','ev-holiday-h2':'\u8282\u5047\u65e5\u8425\u4e1a\u65f6\u95f4',
            // ── FAQ ───────────────────────────────────────────────────────
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
            // ── Hours ─────────────────────────────────────────────────────
            'hr-visit-h2':'\u6b22\u8fce\u6765\u8bbfJontai Energy','hr-contact-h3':'\u6709\u75d5\u95ee\u5417\uff1f',
            'hr-tbd-h3':'\u5f85\u5b9a',
            // ── Location ──────────────────────────────────────────────────
            'loc-map-h2':'\u67e5\u627e\u6211\u4eec\u7684\u4f4d\u7f6e','loc-hours-h2':'\u8425\u4e1a\u65f6\u95f4',
            // ── News ──────────────────────────────────────────────────────
            'nw-h2':'\u65b0\u95fb','nw-item1-h3':'\u7f51\u7ad9\u4e0a\u7ebf',
            'nw-item2-h3':'Jontai Energy\u6210\u7acb','nw-cta-h3':'\u60f3\u4e86\u89e3\u6700\u65b0\u52a8\u6001\uff1f',
            // ── Privacy ───────────────────────────────────────────────────
            'legal-toc-h2':'\u76ee\u5f55',
            'pv-who-h2':'\u5173\u4e8e\u6211\u4eec','pv-data-h2':'\u6211\u4eec\u6536\u96c6\u7684\u6570\u636e',
            'pv-use-h2':'\u6211\u4eec\u5982\u4f55\u4f7f\u7528\u60a8\u7684\u6570\u636e','pv-legal-h2':'\u5904\u7406\u7684\u6cd5\u5f8b\u4f9d\u636e',
            'pv-share-h2':'\u6570\u636e\u5171\u4eab','pv-retain-h2':'\u6570\u636e\u4fdd\u7559',
            'pv-rights-h2':'\u60a8\u7684\u6743\u5229','pv-security-h2':'\u5b89\u5168',
            'pv-cookies-h2':'Cookie','pv-changes-h2':'\u653f\u7b56\u53d8\u66f4',
            'pv-cta-h3':'\u5173\u4e8e\u9690\u79c1\u6709\u75d5\u95ee\uff1f',
            // ── Quote ─────────────────────────────────────────────────────
            'qt-solar-h2':'\u592a\u9633\u80fd\u62a5\u4ef7','qt-led-h2':'LED\u62a5\u4ef7',
            // ── Returns ───────────────────────────────────────────────────
            'rt-policy-h2':'\u4e00\u5468\u9000\u6362\u8d27\u653f\u7b56',
            'rt-unopened-h3':'\u672a\u5f00\u5c01/\u672a\u4f7f\u7528\u4ea7\u54c1','rt-defective-h3':'\u7f3a\u9677\u4ea7\u54c1',
            'rt-wrong-h3':'\u6536\u5230\u9519\u8bef\u5546\u54c1','rt-opened-h3':'\u5df2\u5f00\u5c01\u4f46\u672a\u4f7f\u7528\u4ea7\u54c1',
            'rt-installed-h3':'\u5df2\u5b89\u88c5\u4ea7\u54c1\uff08\u65e0\u7f3a\u9677\uff09',
            'rt-custom-h3':'\u5b9a\u5236\u6216\u7279\u6b8a\u8ba2\u8d2d\u5546\u54c1',
            'rt-late-h3':'7\u5929\u540e\u9000\u8d27\uff08\u65e0\u7f3a\u9677\uff09',
            'rt-cta-h3':'\u9700\u8981\u9000\u8d27\u6216\u6362\u8d27\uff1f',
            // ── Reviews ───────────────────────────────────────────────────
            'rv-cta-h3':'\u6709\u5f88\u597d\u7684\u4f53\u9a8c\uff1f','rv-about-h2':'\u6211\u4eec\u7684\u72ec\u7279\u4e4b\u5904',
            // ── Service ───────────────────────────────────────────────────
            'sv-promise-h2':'\u6211\u4eec\u7684\u4e00\u5468\u4fee\u590d\u627f\u8bfa',
            'sv-solar-h3':'\u592a\u9633\u80fd\u677f\u7ef4\u4fee','sv-inverter-h3':'\u9006\u53d8\u5668\u548c\u7535\u6c60\u670d\u52a1',
            'sv-led-h3':'LED\u706f\u5177\u7ef4\u4fee','sv-electrical-h3':'\u7535\u6c14\u786c\u4ef6',
            'sv-preventive-h3':'\u9884\u9632\u6027\u7ef4\u62a4','sv-onsite-h3':'\u4e0a\u95e8\u670d\u52a1',
            'sv-cta-h3':'\u51c6\u5907\u597d\u9001\u6765\u60a8\u7684\u4ea7\u54c1\u4e86\u5417\uff1f',
            // ── Legal shared ──────────────────────────────────────────────
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
            // ── Why-us ────────────────────────────────────────────────────
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
            // ── Work-with-us ──────────────────────────────────────────────
            'ww-intro-h2':'\u4e0d\u4ec5\u4ec5\u662f\u5de5\u4f5c\u2014\u2014\u4e00\u4efd\u4f7f\u547d',
            'ww-process-h2':'\u6211\u4eec\u7684\u62db\u8058\u6d41\u7a0b','ww-jobs-h2':'\u5f00\u653e\u804c\u4f4d',
            'ww-step1-h4':'\u5728\u7ebf\u7533\u8bf7','ww-step2-h4':'\u521d\u6b65\u5ba1\u6838',
            'ww-step3-h4':'\u9762\u8bd5','ww-step4-h4':'\u6b22\u8fce\u52a0\u5165',
            'ww-j1-h3':'\u592a\u9633\u80fd\u5b89\u88c5\u6280\u672f\u5458','ww-j2-h3':'\u9500\u552e\u4ee3\u8868',
            'ww-j3-h3':'\u592a\u9633\u80fd\u5de5\u7a0b\u5e08','ww-j4-h3':'\u5ba2\u6237\u652f\u6301\u4e13\u5458',
            'ww-j5-h3':'\u8fd0\u8425\u7ecf\u7406',
            'ww-cta-h3':'\u7533\u8bf7\u524d\u6709\u75d5\u95ee\uff1f','ww-modal-h3':'\u7533\u8bf7\u804c\u4f4d'
"@

$js = $js.Replace("'hr-find-eyebrow':'Find Us'",  "'hr-find-eyebrow':'Find Us'" + $enAdd)
$js = $js.Replace("'hr-find-eyebrow':'Enc\u00fantrenos'", "'hr-find-eyebrow':'Enc\u00fantrenos'" + $esAdd)
$js = $js.Replace("'hr-find-eyebrow':'\u627e\u5230\u6211\u4eec'", "'hr-find-eyebrow':'\u627e\u5230\u6211\u4eec'" + $zhAdd)

[System.IO.File]::WriteAllText($jsPath, $js, $enc)
Write-Host "main.js updated"
Write-Host "`nAll done."
