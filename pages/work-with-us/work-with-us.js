class CareersPageController {
    constructor() {
        this.modal = document.getElementById('applicationModal');
        this.form = document.getElementById('applicationForm');
        this.fileName = document.getElementById('fileName');
        this.dropZone = document.getElementById('fileDrop');
        this.fileInput = document.getElementById('appCvInput');
        this.departmentFilter = document.getElementById('departmentFilter');
        this.locationFilter = document.getElementById('locationFilter');
        this.noResults = document.getElementById('noResults');
    }

    init() {
        this.bindGlobalApi();
        this.bindDropZone();
        this.bindModal();
        this.bindForm();
        this.bindFilters();
    }

    bindGlobalApi() {
        window.toggleJob = this.toggleJob.bind(this);
        window.openModal = this.openModal.bind(this);
        window.closeModal = this.closeModal.bind(this);
        window.goToStep = this.goToStep.bind(this);
        window.nextStep = this.nextStep.bind(this);
        window.handleFile = this.handleFile.bind(this);
        window.filterJobs = this.filterJobs.bind(this);
    }

    getCurrentStep() {
        const activeStep = document.querySelector('.modal-step.active');
        return activeStep ? Number(activeStep.dataset.step) : 1;
    }

    closeAllJobDetails() {
        document.querySelectorAll('.job-card').forEach((card) => {
            const details = card.querySelector('.job-details');
            const button = card.querySelector('.job-toggle-btn');
            if (details) {
                details.style.display = 'none';
            }
            if (button) {
                button.classList.remove('open');
                button.innerHTML = '<i class="fas fa-chevron-down"></i> View Details';
            }
        });
    }

    toggleJob(button) {
        const card = button.closest('.job-card');
        const details = card?.querySelector('.job-details');
        const isOpen = button.classList.contains('open');

        this.closeAllJobDetails();

        if (!isOpen && details) {
            details.style.display = 'block';
            button.classList.add('open');
            button.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Details';
            details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    openModal(position) {
        if (!this.modal) {
            return;
        }

        const modalPosition = document.getElementById('modalPosition');
        if (modalPosition) {
            modalPosition.textContent = position || 'Open Application';
        }

        this.modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        this.goToStep(1);
    }

    closeModal() {
        if (!this.modal) {
            return;
        }

        this.modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    goToStep(stepNumber) {
        document.querySelectorAll('.form-step').forEach((step) => {
            step.style.display = 'none';
        });

        document.querySelectorAll('.modal-step').forEach((step, index) => {
            step.classList.remove('active', 'done');
            if (index + 1 < stepNumber) {
                step.classList.add('done');
            }
            if (index + 1 === stepNumber) {
                step.classList.add('active');
            }
        });

        const target = document.getElementById(`step${stepNumber}`);
        if (target) {
            target.style.display = 'block';
        }
    }

    validateStep(stepNumber) {
        const current = document.getElementById(`step${stepNumber}`);
        if (!current) {
            return true;
        }

        let valid = true;
        current.querySelectorAll('[required]').forEach((field) => {
            if (!field.value.trim()) {
                field.style.borderBottomColor = '#e74c3c';
                field.addEventListener('input', () => {
                    field.style.borderBottomColor = '';
                }, { once: true });
                valid = false;
            }
        });

        return valid;
    }

    nextStep(targetStep) {
        const currentStep = this.getCurrentStep();
        if (targetStep > currentStep && !this.validateStep(currentStep)) {
            return;
        }

        this.goToStep(targetStep);
    }

    handleFile(input) {
        if (!this.fileName || !input.files || !input.files[0]) {
            return;
        }

        const file = input.files[0];
        if (file.size > 8 * 1024 * 1024) {
            alert('File too large. Maximum 8 MB.');
            input.value = '';
            return;
        }

        this.fileName.textContent = file.name;
    }

    filterJobs() {
        const department = this.departmentFilter?.value || 'all';
        const location = this.locationFilter?.value || 'all';
        let visible = 0;

        document.querySelectorAll('.job-card').forEach((card) => {
            const deptMatch = department === 'all' || card.dataset.department === department;
            const locMatch = location === 'all' || card.dataset.location === location;
            const shouldShow = deptMatch && locMatch;

            card.style.display = shouldShow ? 'block' : 'none';
            if (shouldShow) {
                visible += 1;
            }
        });

        if (this.noResults) {
            this.noResults.style.display = visible === 0 ? 'block' : 'none';
        }
    }

    bindDropZone() {
        if (!this.dropZone) {
            return;
        }

        this.dropZone.addEventListener('dragover', (event) => {
            event.preventDefault();
            this.dropZone.style.borderColor = 'var(--primary-green)';
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.style.borderColor = '';
        });

        this.dropZone.addEventListener('drop', (event) => {
            event.preventDefault();
            this.dropZone.style.borderColor = '';
            const file = event.dataTransfer.files[0];
            if (file && this.fileName) {
                this.fileName.textContent = file.name;
            }
            if (file && this.fileInput) {
                this.fileInput.value = '';
            }
        });
    }

    bindModal() {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => this.closeModal());
        }
    }

    bindForm() {
        if (!this.form) {
            return;
        }

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            document.querySelectorAll('.form-step').forEach((step) => {
                step.style.display = 'none';
            });
            document.querySelectorAll('.modal-step').forEach((step) => {
                step.classList.remove('active');
                step.classList.add('done');
            });
            const success = document.getElementById('stepSuccess');
            if (success) {
                success.style.display = 'block';
            }
        });
    }

    bindFilters() {
        if (this.departmentFilter) {
            this.departmentFilter.addEventListener('change', () => this.filterJobs());
        }
        if (this.locationFilter) {
            this.locationFilter.addEventListener('change', () => this.filterJobs());
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CareersPageController().init();
});
