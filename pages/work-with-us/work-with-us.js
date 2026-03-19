/* ── Toggle job details ── */
function toggleJob(btn) {
    const card = btn.closest('.job-card');
    const details = card.querySelector('.job-details');
    const isOpen = btn.classList.contains('open');
    // Close all others
    document.querySelectorAll('.job-card').forEach(c => {
        c.querySelector('.job-details').style.display = 'none';
        const b = c.querySelector('.job-toggle-btn');
        b.classList.remove('open');
        b.innerHTML = '<i class="fas fa-chevron-down"></i> View Details';
    });
    if (!isOpen) {
        details.style.display = 'block';
        btn.classList.add('open');
        btn.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Details';
        details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/* ── Modal open/close ── */
function openModal(position) {
    const modal = document.getElementById('applicationModal');
    document.getElementById('modalPosition').textContent = position || 'Open Application';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    goToStep(1);
}

function closeModal() {
    document.getElementById('applicationModal').classList.remove('open');
    document.body.style.overflow = '';
}

/* ── Step navigation ── */
function goToStep(n) {
    document.querySelectorAll('.form-step').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.modal-step').forEach((s, i) => {
        s.classList.remove('active', 'done');
        if (i + 1 < n) s.classList.add('done');
        if (i + 1 === n) s.classList.add('active');
    });
    const target = document.getElementById('step' + n);
    if (target) target.style.display = 'block';
}

function nextStep(n) {
    // Validate current step inputs
    const current = document.getElementById('step' + (n - 1));
    if (current) {
        const required = current.querySelectorAll('[required]');
        let valid = true;
        required.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderBottomColor = '#e74c3c';
                field.addEventListener('input', () => {
                    field.style.borderBottomColor = '';
                }, { once: true });
                valid = false;
            }
        });
        if (!valid) return;
    }
    goToStep(n);
}

/* ── File drop/browse ── */
function handleFile(input) {
    const nameEl = document.getElementById('fileName');
    if (input.files && input.files[0]) {
        const file = input.files[0];
        if (file.size > 8 * 1024 * 1024) {
            alert('File too large. Maximum 8 MB.');
            input.value = '';
            return;
        }
        nameEl.textContent = file.name;
    }
}

/* ── Filter jobs ── */
function filterJobs() {
    const dept = document.getElementById('departmentFilter').value;
    const loc  = document.getElementById('locationFilter').value;
    let visible = 0;
    document.querySelectorAll('.job-card').forEach(card => {
        const deptMatch = dept === 'all' || !dept || card.dataset.department === dept;
        const locMatch  = loc  === 'all' || !loc  || card.dataset.location  === loc;
        if (deptMatch && locMatch) {
            card.style.display = 'block';
            visible++;
        } else {
            card.style.display = 'none';
        }
    });
    const noRes = document.getElementById('noResults');
    if (noRes) noRes.style.display = visible === 0 ? 'block' : 'none';
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
    // File drop zone
    const dropZone = document.getElementById('fileDrop');
    if (dropZone) {
        dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.style.borderColor = 'var(--primary-green)'; });
        dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = ''; });
        dropZone.addEventListener('drop', e => {
            e.preventDefault();
            dropZone.style.borderColor = '';
            const file = e.dataTransfer.files[0];
            if (file) {
                document.getElementById('cvUpload').files; // not directly settable
                document.getElementById('fileName').textContent = file.name;
            }
        });
    }

    // Close modal on backdrop click
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // Form submit → success screen
    const form = document.getElementById('applicationForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            document.querySelectorAll('.form-step').forEach(s => s.style.display = 'none');
            document.querySelectorAll('.modal-step').forEach(s => {
                s.classList.remove('active');
                s.classList.add('done');
            });
            const success = document.getElementById('stepSuccess');
            if (success) success.style.display = 'block';
        });
    }

    // Filters
    const filterDept = document.getElementById('departmentFilter');
    const filterLoc  = document.getElementById('locationFilter');
    if (filterDept) filterDept.addEventListener('change', filterJobs);
    if (filterLoc)  filterLoc.addEventListener('change', filterJobs);
});
