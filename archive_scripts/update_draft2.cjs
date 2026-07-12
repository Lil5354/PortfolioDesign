const db = require('better-sqlite3')('UEFGallery.API/gallery.db');
const blocks = [
  { id: 'b1', type: 'image', content: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=100&w=2000', fullWidth: true },
  { id: 'b2', type: 'text', content: '<h1 style="text-align: center;">SUGRA - Bold Display Sans</h1><p style="text-align: center; font-size: 18px; color: #555;">Sugra is a modern, heavy, and striking display sans-serif typeface designed for high-impact headlines, posters, and branding.</p>' },
  { id: 'b3', type: 'grid', fullWidth: false, images: [
    { id: 'g1', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=100&w=1200', width: 1200, height: 800 },
    { id: 'g2', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=100&w=1200', width: 1200, height: 800 },
    { id: 'g3', url: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=100&w=1200', width: 1200, height: 800 },
    { id: 'g4', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=100&w=1200', width: 1200, height: 800 }
  ] },
  { id: 'b4', type: 'text', content: '<h2 style="text-align: center;">Typography in Action</h2><p style="text-align: center;">The bold weight ensures excellent readability while maintaining a strong visual presence.</p>' },
  { id: 'b5', type: 'image', content: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=100&w=2000', fullWidth: true }
];
db.prepare('UPDATE artworks SET blocks_json = ? WHERE artwork_id = ?').run(JSON.stringify(blocks), '27d7e03e-abea-4f6c-8289-b436a6402521');
console.log('Updated Sugra draft with rich layout!');
