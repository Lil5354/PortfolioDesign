const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

function extractTextFromDocx(filePath) {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();
    const documentXml = zipEntries.find(entry => entry.entryName === 'word/document.xml');
    
    if (documentXml) {
        const xmlData = zip.readAsText(documentXml);
        // Simple regex to extract text from XML tags
        const text = xmlData.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        return text;
    }
    return '';
}

const docxPath = 'c:\\TÀI LIỆU NĂM CUỐI VÀ CV\\HTKH.docx';
const text = extractTextFromDocx(docxPath);
fs.writeFileSync('c:\\TÀI LIỆU NĂM CUỐI VÀ CV\\htkh_text.txt', text, 'utf-8');
console.log('Extraction complete.');
