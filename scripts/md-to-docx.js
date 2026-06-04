const fs = require('fs');
const marked = require('marked');
const htmlToDocx = require('html-to-docx');

(async () => {
  try {
    // Read the markdown file
    const mdPath = 'C:\\Users\\jayes\\.gemini\\antigravity\\brain\\b6a3efb5-10ad-439e-b835-fd78c8624038\\dlt_registration_guide.md';
    const mdContent = fs.readFileSync(mdPath, 'utf-8');

    // Convert Markdown to HTML
    const htmlContent = marked.parse(mdContent);

    // Provide a full HTML wrapper with styling
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Calibri, sans-serif; font-size: 11pt; }
            h1 { font-size: 18pt; font-weight: bold; margin-bottom: 12pt; }
            h2 { font-size: 14pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
            h3 { font-size: 12pt; font-weight: bold; margin-top: 10pt; margin-bottom: 4pt; }
            p { margin-bottom: 10pt; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10pt; }
            th, td { border: 1px solid #000; padding: 4px; }
            pre, code { font-family: Consolas, monospace; background: #f4f4f4; padding: 2px; }
            blockquote { margin-left: 20pt; font-style: italic; color: #555; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    // Convert HTML to DOCX buffer
    const docxBuffer = await htmlToDocx(fullHtml, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    // Save the docx file
    const outPath = 'C:\\Users\\jayes\\.gemini\\antigravity\\brain\\b6a3efb5-10ad-439e-b835-fd78c8624038\\dlt_registration_guide.docx';
    fs.writeFileSync(outPath, docxBuffer);
    
    console.log('Successfully created:', outPath);
  } catch (error) {
    console.error('Error creating docx:', error);
  }
})();
