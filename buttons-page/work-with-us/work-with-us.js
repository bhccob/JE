// Filter jobs by department and location
function filterJobs() {
    const departmentFilter = document.getElementById('departmentFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const jobCards = document.querySelectorAll('.job-card');

    jobCards.forEach(card => {
        const department = card.getAttribute('data-department');
        const location = card.getAttribute('data-location');
        
        const departmentMatch = departmentFilter === 'all' || department === departmentFilter;
        const locationMatch = locationFilter === 'all' || location === locationFilter;
        
        if (departmentMatch && locationMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Toggle job details
function toggleJobDetails(jobId) {
    const details = document.getElementById(jobId);
    const allDetails = document.querySelectorAll('.job-details');
    
    // Close all other job details
    allDetails.forEach(detail => {
        if (detail.id !== jobId) {
            detail.style.display = 'none';
        }
    });
    
    // Toggle current job details
    if (details.style.display === 'none') {
        details.style.display = 'block';
    } else {
        details.style.display = 'none';
    }
}

// Open application modal
function openApplicationModal() {
    document.getElementById('applicationModal').style.display = 'flex';
}

// Close application modal
function closeApplicationModal() {
    document.getElementById('applicationModal').style.display = 'none';
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Filter listeners
    document.getElementById('departmentFilter').addEventListener('change', filterJobs);
    document.getElementById('locationFilter').addEventListener('change', filterJobs);

    // Apply button listeners
    const applyButtons = document.querySelectorAll('.apply-btn');
    applyButtons.forEach(button => {
        button.addEventListener('click', openApplicationModal);
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('applicationModal');
        if (event.target === modal) {
            closeApplicationModal();
        }
    });

    // Form submission
    document.getElementById('applicationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Application submitted successfully! We will contact you soon.');
        closeApplicationModal();
    });
});
