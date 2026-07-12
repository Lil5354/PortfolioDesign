const fs = require('fs');

let portfolioCode = fs.readFileSync('portfolio_system.jsx', 'utf8');

// Dashboard Page refactor
const adminDashboardStart = portfolioCode.indexOf('function AdminDashboardPage({ setPage }) {');
const adminDashboardEnd = portfolioCode.indexOf('function AdminUsersPage({ setPage }) {');

let dashboardCode = portfolioCode.substring(adminDashboardStart, adminDashboardEnd);

// Import jspdf and autoTable
if (!portfolioCode.includes('import jsPDF from "jspdf"')) {
  portfolioCode = portfolioCode.replace(
    'import * as XLSX from "xlsx";',
    'import * as XLSX from "xlsx";\nimport jsPDF from "jspdf";\nimport "jspdf-autotable";'
  );
}

// Replace PDF button onClick
dashboardCode = dashboardCode.replace(
  'onClick={() => setPage("admin_export")}',
  'onClick={async () => {\n' +
  '              const doc = new jsPDF();\n' +
  '              doc.addFont("https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf", "Roboto", "normal");\n' +
  '              doc.setFont("Roboto");\n' +
  '              doc.text("BAO CAO TONG QUAN HE THONG", 14, 20);\n' +
  '              \n' +
  '              doc.autoTable({\n' +
  '                startY: 30,\n' +
  '                head: [["Chi tieu", "Gia tri", "Chu thich"]],\n' +
  '                body: stats.map(s => [s.label, s.value, s.hint]),\n' +
  '                theme: "grid",\n' +
  '                styles: { font: "Roboto" }\n' +
  '              });\n' +
  '              \n' +
  '              doc.text("HOAT DONG GAN DAY", 14, doc.lastAutoTable.finalY + 15);\n' +
  '              doc.autoTable({\n' +
  '                startY: doc.lastAutoTable.finalY + 25,\n' +
  '                head: [["Hoat dong", "Loai"]],\n' +
  '                body: recentActivity.map(a => [\n' +
  '                  a.user?.fullName + (a.isPublic ? " da duoc duyet an pham " : " vua dang an pham ") + a.title,\n' +
  '                  a.isPublic ? "Duyet" : "Moi"\n' +
  '                ]),\n' +
  '                theme: "striped",\n' +
  '                styles: { font: "Roboto" }\n' +
  '              });\n' +
  '              \n' +
  '              doc.save("Bao_Cao_Tong_Quan.pdf");\n' +
  '            }}'
);

portfolioCode = portfolioCode.substring(0, adminDashboardStart) + dashboardCode + portfolioCode.substring(adminDashboardEnd);

fs.writeFileSync('portfolio_system.jsx', portfolioCode);
console.log('Dashboard PDF Export refactored');
