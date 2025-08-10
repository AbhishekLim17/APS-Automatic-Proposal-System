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
    // Using generateProposal from document-generator.js
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

