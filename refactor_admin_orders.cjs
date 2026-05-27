const fs = require('fs');

let portfolioCode = fs.readFileSync('portfolio_system.jsx', 'utf8');

const adminOrdersStart = portfolioCode.indexOf('function AdminOrdersPage({ setPage }) {');
const adminOrdersEnd = portfolioCode.indexOf('function AdminUsersPage({ setPage }) {');

let adminOrdersCode = portfolioCode.substring(adminOrdersStart, adminOrdersEnd);

// Add coverImageUrl to mock orders
adminOrdersCode = adminOrdersCode.replace(
  "artworkName: 'Kỷ niệm UEF', buyerAccount: 'nva@example.com', studentAuthor: 'Nguyễn Lê Minh Anh', artworkLink: '/gallery?id=1'",
  "artworkName: 'Kỷ niệm UEF', buyerAccount: 'nva@example.com', studentAuthor: 'Nguyễn Lê Minh Anh', artworkLink: '/gallery?id=1', coverImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=500&fit=crop'"
);
adminOrdersCode = adminOrdersCode.replace(
  "artworkName: 'Poster Design', buyerAccount: 'ttb@example.com', studentAuthor: 'Trần Bảo Long', artworkLink: '/gallery?id=2'",
  "artworkName: 'Poster Design', buyerAccount: 'ttb@example.com', studentAuthor: 'Trần Bảo Long', artworkLink: '/gallery?id=2', coverImageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&h=500&fit=crop'"
);

// Update Modal Layout to 2 columns
adminOrdersCode = adminOrdersCode.replace(
  '<div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden flex flex-col p-6">',
  '<div className="bg-white rounded-xl shadow-lg w-full max-w-3xl overflow-hidden flex flex-col p-6">'
);

adminOrdersCode = adminOrdersCode.replace(
  '<div className="space-y-4">',
  `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img src={selectedOrder.coverImageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=500&fit=crop"} alt="Artwork" className="w-full h-auto aspect-square object-cover rounded-lg border border-gray-200" />
              </div>
              <div className="space-y-4">`
);

// Close the grid div
adminOrdersCode = adminOrdersCode.replace(
  '</div>\n          </div>\n        </div>\n      )}\n    </div>',
  '</div>\n            </div>\n          </div>\n        </div>\n      )}\n    </div>'
);

portfolioCode = portfolioCode.substring(0, adminOrdersStart) + adminOrdersCode + portfolioCode.substring(adminOrdersEnd);

fs.writeFileSync('portfolio_system.jsx', portfolioCode);
console.log('Order Modal refactored');
