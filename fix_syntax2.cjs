const fs = require('fs');

let code = fs.readFileSync('portfolio_system.jsx', 'utf8');

// Find the line 3196 index: '  )\n}'
let lines = code.split('\n');

// let's just splice the lines!
// 3197 is }
// 3198-3314 are the wrong lines.
// But wait, the line numbers might have shifted.
let startDelete = -1;
let endDelete = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i] === '      {editModal.isOpen && editModal.user && (') {
        startDelete = i - 7; // up to the '}' of EditArtworkPage
        break;
    }
}

if (startDelete !== -1) {
    let modalStart = startDelete + 7;
    let modalEnd = -1;
    for (let i = modalStart; i < lines.length; i++) {
        if (lines[i] === 'function AdminUsersPage({ setPage }) {') {
            modalEnd = i - 1;
            break;
        }
    }
    
    if (modalEnd !== -1) {
        let modalLines = lines.slice(modalStart, modalEnd);
        
        // Remove from startDelete+1 to modalEnd
        lines.splice(startDelete + 1, modalEnd - startDelete);
        
        // Find where AdminArtworksPage starts
        let targetInsert = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i] === 'function AdminArtworksPage({ setPage }) {') {
                targetInsert = i - 2; // before the }\n  )\n}
                break;
            }
        }
        
        if (targetInsert !== -1) {
            lines.splice(targetInsert, 0, ...modalLines);
            fs.writeFileSync('portfolio_system.jsx', lines.join('\n'));
            console.log("Fixed successfully via lines splice");
        } else {
            console.log("Could not find target insert");
        }
    }
}
