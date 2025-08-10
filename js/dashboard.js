document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard JS loaded');
    
    // Test if JS is working
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        console.log('Sidebar found');
    }

    // Navigation handling
    const navItems = document.querySelectorAll('nav ul li');
    const sections = document.querySelectorAll('section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });

            // Show selected section
            if (page) {
                document.querySelector(`.${page}`).style.display = 'block';
            }

            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Form validation and submission
    function generateProposal(format) {
        const form = document.getElementById('proposal-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Get form data
        const formData = {
            companyDetails: {
                name: document.getElementById('company-name').value,
                address: document.getElementById('company-address').value,
                type: document.getElementById('company-type').value,
                hasExistingTreatment: document.querySelector('input[name="existing-treatment"]:checked')?.value === 'yes',
                existingTreatmentDetails: document.getElementById('existing-details').value
            },
            waterReport: {
                bod: document.getElementById('bod').value,
                cod: document.getElementById('cod').value,
                tds: document.getElementById('tds').value,
                tss: document.getElementById('tss').value,
                ph: document.getElementById('ph').value,
                chemicals: {
                    heavyMetals: document.getElementById('heavy-metals').checked,
                    oilGrease: document.getElementById('oil-grease').checked,
                    phenols: document.getElementById('phenols').checked,
                    additionalNotes: document.getElementById('chemical-notes').value
                }
            },
            products: Array.from(document.querySelectorAll('input[name="products"]:checked'))
                .map(cb => ({
                    productName: cb.value,
                    capacity: document.getElementById(`${cb.value.toLowerCase()}-capacity`).value,
                    price: document.getElementById(`${cb.value.toLowerCase()}-price`).value
                })),
            plantSize: document.getElementById('plant-size').value
        };

        // Handle generation based on format
        switch(format) {
            case 'pdf':
                generatePDF(formData);
                break;
            case 'docx':
                generateDOCX(formData);
                break;
            case 'both':
                generatePDF(formData);
                generateDOCX(formData);
                break;
        }
    }

    window.generateProposal = generateProposal;

    // Chemical treatment checkbox handler
    const chemicalCheckbox = document.getElementById('chemical-treatment');
    const chemicalDetails = document.querySelector('.chemical-details');

    chemicalCheckbox?.addEventListener('change', (e) => {
        chemicalDetails.style.display = e.target.checked ? 'block' : 'none';
        const textarea = document.getElementById('chemical-notes');
        if (!e.target.checked) {
            textarea.value = '';
        }
    });

    // Handle existing treatment radio buttons
    const radioButtons = document.querySelectorAll('input[name="existing-treatment"]');
    const existingDetails = document.querySelector('.existing-details');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            existingDetails.style.display = e.target.value === 'yes' ? 'block' : 'none';
            if (e.target.value === 'no') {
                document.getElementById('existing-details').value = '';
            }
        });
    });

    function updateTotal() {
        const products = ['etp', 'stp', 'ro', 'mpsc', 'hru', 'upw'];
        let total = 0;

        products.forEach(product => {
            const checkbox = document.querySelector(`input[value="${product.toUpperCase()}"]`);
            const priceInput = document.getElementById(`${product}-price`);
            
            if (checkbox?.checked && priceInput?.value) {
                total += parseFloat(priceInput.value);
            }
        });

        document.getElementById('total-price').textContent = 
            new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR'
            }).format(total);
    }

    // Add event listeners
    const inputs = document.querySelectorAll('input[type="number"], input[type="checkbox"]');
    inputs.forEach(input => {
        input.addEventListener('change', updateTotal);
        input.addEventListener('input', updateTotal);
    });

    // Handle company type selection
    const companyTypeSelect = document.getElementById('company-type');
    const otherTypeDiv = document.querySelector('.other-type');

    companyTypeSelect?.addEventListener('change', (e) => {
        otherTypeDiv.style.display = e.target.value === 'other' ? 'block' : 'none';
        if (e.target.value !== 'other') {
            document.getElementById('other-company-type').value = '';
        }
    });

    // Sidebar toggle functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    // Load saved state
    const sidebarState = localStorage.getItem('sidebarMinimized');
    if (sidebarState === 'true') {
        sidebar.classList.add('minimized');
    }

    // Toggle sidebar
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('minimized');
        localStorage.setItem('sidebarMinimized', sidebar.classList.contains('minimized'));
    });
});

// Add these functions according to your PDF/DOCX generation logic
function generatePDF(data) {
    console.log('Generating PDF:', data);
    // Add your PDF generation logic here
}

function generateDOCX(data) {
    console.log('Generating DOCX:', data);
    // Add your DOCX generation logic here
}