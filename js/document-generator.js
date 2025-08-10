async function generatePDF(formData) {
    try {
        const response = await fetch('/api/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to generate PDF');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `proposal-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    }
}

async function generateDOCX(formData) {
    try {
        const response = await fetch('/api/generate-docx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to generate DOCX');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `proposal-${Date.now()}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (error) {
        console.error('Error generating DOCX:', error);
        alert('Failed to generate DOCX. Please try again.');
    }
}

// Handle proposal generation
async function generateProposal(format) {
    // Show loading state
    const button = event.target.closest('button');
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    try {
        // Collect form data
        const formData = {
            companyDetails: {
                name: document.getElementById('company-name').value,
                address: document.getElementById('company-address').value,
                type: document.getElementById('company-type').value,
                hasExistingTreatment: document.querySelector('input[name="existing-treatment"]:checked')?.value === 'yes',
                existingTreatmentDetails: document.getElementById('existing-details')?.value || ''
            },
            waterAnalysis: {
                bod: document.getElementById('bod').value,
                cod: document.getElementById('cod').value,
                tds: document.getElementById('tds').value,
                tss: document.getElementById('tss').value,
                ph: document.getElementById('ph').value,
                chemicals: {
                    heavyMetals: document.getElementById('heavy-metals').checked,
                    oilGrease: document.getElementById('oil-grease').checked,
                    phenols: document.getElementById('phenols').checked,
                    notes: document.getElementById('chemical-notes').value
                }
            },
            products: Array.from(document.querySelectorAll('input[name="products"]:checked'))
                .map(cb => ({
                    name: cb.value,
                    capacity: document.getElementById(`${cb.value.toLowerCase()}-capacity`).value,
                    price: document.getElementById(`${cb.value.toLowerCase()}-price`).value
                })),
            totalPrice: document.getElementById('total-price').textContent
        };

        if (format === 'pdf') {
            await generatePDF(formData);
        } else if (format === 'docx') {
            await generateDOCX(formData);
        }

    } catch (error) {
        console.error('Error generating document:', error);
        alert('Failed to generate document. Please try again.');
    } finally {
        // Restore button state
        button.disabled = false;
        button.innerHTML = originalText;
    }
}

async function generatePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let yPos = 20;

    // Add company details
    doc.setFontSize(20);
    doc.text('Proposal', 105, yPos, { align: 'center' });
    yPos += 20;

    doc.setFontSize(12);
    doc.text(`Company: ${data.companyDetails.name}`, 20, yPos);
    yPos += 10;
    doc.text(`Address: ${data.companyDetails.address}`, 20, yPos);
    yPos += 10;
    doc.text(`Type: ${data.companyDetails.type}`, 20, yPos);
    yPos += 20;

    // Add water analysis
    doc.setFontSize(16);
    doc.text('Water Analysis', 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text(`BOD: ${data.waterAnalysis.bod} mg/L`, 20, yPos);
    yPos += 10;
    doc.text(`COD: ${data.waterAnalysis.cod} mg/L`, 20, yPos);
    yPos += 10;
    doc.text(`TDS: ${data.waterAnalysis.tds} mg/L`, 20, yPos);
    yPos += 10;
    doc.text(`TSS: ${data.waterAnalysis.tss} mg/L`, 20, yPos);
    yPos += 20;

    // Add products
    doc.setFontSize(16);
    doc.text('Products', 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    data.products.forEach(product => {
        doc.text(`${product.name}: ${product.capacity} m³/day - ${product.price}`, 20, yPos);
        yPos += 10;
    });

    yPos += 10;
    doc.text(`Total: ${data.totalPrice}`, 20, yPos);

    // Save the PDF
    doc.save(`proposal-${Date.now()}.pdf`);
}

async function generateDOCX(data) {
    const { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, Packer} = docx;

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: 'Proposal',
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 400 }
                }),
                // Company Details
                new Paragraph({
                    text: 'Company Details',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 400, after: 200 }
                }),
                new Paragraph({
                    children: [
                        new TextRun(`Company: ${data.companyDetails.name}`),
                        new TextRun({ text: '\n', break: 1 }),
                        new TextRun(`Address: ${data.companyDetails.address}`),
                        new TextRun({ text: '\n', break: 1 }),
                        new TextRun(`Type: ${data.companyDetails.type}`)
                    ]
                }),
                // Water Analysis
                new Paragraph({
                    text: 'Water Analysis',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 400, after: 200 }
                }),
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph('Parameter')] }),
                                new TableCell({ children: [new Paragraph('Value')] }),
                                new TableCell({ children: [new Paragraph('Unit')] })
                            ]
                        }),
                        ...['BOD', 'COD', 'TDS', 'TSS'].map(param => 
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph(param)] }),
                                    new TableCell({ children: [new Paragraph(data.waterAnalysis[param.toLowerCase()])] }),
                                    new TableCell({ children: [new Paragraph('mg/L')] })
                                ]
                            })
                        )
                    ]
                }),
                // Products
                new Paragraph({
                    text: 'Products',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 400, after: 200 }
                }),
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph('Product')] }),
                                new TableCell({ children: [new Paragraph('Capacity')] }),
                                new TableCell({ children: [new Paragraph('Price')] })
                            ]
                        }),
                        ...data.products.map(product => 
                            new TableRow({
                                children: [
                                    new TableCell({ children: [new Paragraph(product.name)] }),
                                    new TableCell({ children: [new Paragraph(`${product.capacity} m³/day`)] }),
                                    new TableCell({ children: [new Paragraph(product.price)] })
                                ]
                            })
                        )
                    ]
                }),
                // Total
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Total: ${data.totalPrice}`,
                            bold: true,
                            size: 28
                        })
                    ],
                    spacing: { before: 400 }
                })
            ]
        }]
    });

    // Generate and download the document
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proposal-${Date.now()}.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}