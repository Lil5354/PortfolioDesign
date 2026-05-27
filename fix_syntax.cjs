const fs = require('fs');

let code = fs.readFileSync('portfolio_system.jsx', 'utf8');

// The marker where EditArtworkPage actually ends
const marker1 = '    </div>\n  )\n}\n\n\n        </div>\n      </div>\n    </div>\n  )\n}\n\n\n      {editModal.isOpen && editModal.user && (';
let idx1 = code.indexOf('    </div>\n  )\n}\n\n\n        </div>\n      </div>\n    </div>\n  )\n}\n\n\n      {editModal.isOpen && editModal.user && (');

if (idx1 === -1) {
    console.log("Marker 1 not found");
} else {
    // Find where AdminUsersPage starts
    let idx2 = code.indexOf('function AdminUsersPage({ setPage }) {', idx1);
    if (idx2 !== -1) {
        let toRemove = code.substring(idx1 + 14, idx2);
        
        // Remove the dangling code and the modal from this wrong place
        code = code.substring(0, idx1 + 14) + code.substring(idx2);
        
        // Extract the modal code from what we removed
        let modalStartIdx = toRemove.indexOf('{editModal.isOpen');
        let modalCode = toRemove.substring(modalStartIdx - 6);
        
        // Find where to insert it inside AdminUsersPage
        let endMarker = '      )}\n    </div>\n  )\n}\n\nfunction AdminArtworksPage({ setPage }) {';
        let idx3 = code.indexOf(endMarker);
        
        if (idx3 !== -1) {
            code = code.substring(0, idx3 + 10) + modalCode + code.substring(idx3 + 10);
            fs.writeFileSync('portfolio_system.jsx', code);
            console.log("Successfully fixed the syntax error and moved editModal!");
        } else {
            console.log("Could not find AdminUsersPage end marker");
        }
    } else {
        console.log("Could not find AdminUsersPage start");
    }
}
