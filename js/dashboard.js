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
                         .map(cb => cb.value),
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