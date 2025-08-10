const express = require('express');
const htmlPdf = require('html-pdf-node');
const docx = require('docx');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors'); // Add CORS support

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// Helper function to format currency
Handlebars.registerHelper('formatCurrency', function(value) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(value);
});

async function generateProposal(data) {
    // Read the HTML template
    const templatePath = path.join(__dirname, 'templates', 'proposal.html');
    const templateContent = await fs.readFile(templatePath, 'utf8');
    
    // Compile the template
    const template = Handlebars.compile(templateContent);
    
    // Calculate total
    const total = data.products.reduce((sum, product) => sum + product.price, 0);
    
    // Generate HTML
    const html = template({
        ...data,
        total,
        date: new Date().toLocaleDateString('en-IN'),
        proposalNumber: `PRO-${Date.now().toString().slice(-6)}`
    });

    return html;
}

// Express endpoint
app.post('/generate-proposal', async (req, res) => {
    try {
        const html = await generateProposal(req.body);
        
        const options = {
            format: 'A4',
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            },
            displayHeaderFooter: true,
            headerTemplate: '<div></div>',
            footerTemplate: `
                <div style="font-size: 10px; text-align: center; width: 100%;">
                    <span>Page </span><span class="pageNumber"></span> of <span class="totalPages"></span>
                </div>
            `
        };

        const file = { content: html };
        const pdf = await htmlPdf.generatePdf(file, options);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=proposal.pdf');
        res.send(pdf);
    } catch (error) {
        console.error('Error generating proposal:', error);
        res.status(500).json({ error: 'Failed to generate proposal' });
    }
});

app.post('/api/generate-docx', async (req, res) => {
    try {
        const formData = req.body;
        const doc = new docx.Document();
        
        // Add content to DOCX
        // ... implement DOCX generation logic here ...

        const buffer = await docx.Packer.toBuffer(doc);

        res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.send(buffer);

    } catch (error) {
        console.error('Error generating DOCX:', error);
        res.status(500).send('Failed to generate DOCX');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

async function generateProposal(format) {
    const form = document.getElementById('proposal-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Collect form data
    const formData = {
        companyDetails: {
            name: document.getElementById('company-name').value,
            address: document.getElementById('company-address').value,
            // ... other company details
        },
        waterReport: [
            {
                parameter: 'BOD',
                unit: 'mg/L',
                inletValue: document.getElementById('bod').value,
                outletValue: '< 30',
                remarks: 'Within limits'
            },
            // ... add other parameters
        ],
        products: Array.from(document.querySelectorAll('input[name="products"]:checked'))
            .map(cb => ({
                productName: cb.value,
                capacity: document.getElementById('plant-size').value,
                price: calculatePrice(cb.value, document.getElementById('plant-size').value)
            }))
    };

    try {
        const response = await fetch('/generate-proposal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to generate proposal');

        // Create a blob from the PDF stream
        const blob = await response.blob();
        // Create a link to download the PDF
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'proposal.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate proposal');
    }
}