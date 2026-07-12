const fs = require('fs');

const filesToUpdate = [
  'c:\\TÀI LIỆU NĂM CUỐI VÀ CV\\prototype\\portfolio_system_part3.jsx',
  'c:\\TÀI LIỆU NĂM CUỐI VÀ CV\\prototype\\translate_i18n.cjs'
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/bộ sưu tập/g, 'Moodboard');
    content = content.replace(/Bộ sưu tập/g, 'Moodboard');
    content = content.replace(/Bộ Sưu Tập/g, 'Moodboard');
    content = content.replace(/BỘ SƯU TẬP/g, 'MOODBOARD');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
