const fs = require('fs');

let content = fs.readFileSync('portfolio_system.jsx', 'utf8');

const exportTarget = `const ws = XLSX.utils.json_to_sheet(users.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map(u => ({`;

const exportReplace = `const ws = XLSX.utils.json_to_sheet(users.filter(u => {
      const matchSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    }).map(u => ({`;

content = content.replace(exportTarget, exportReplace);

fs.writeFileSync('portfolio_system.jsx', content);
console.log("Fixed export logic to include roleFilter.");
