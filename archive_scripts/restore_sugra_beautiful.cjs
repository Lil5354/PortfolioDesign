const db = require('better-sqlite3')('UEFGallery.API/gallery.db');

const blocks = [
  { id: 'b1', type: 'image', content: '/demo-assets/sugra/hero.png', fullWidth: true },
  { id: 'b2', type: 'text', content: 'SUGRA - BOLD DISPLAY SANS\n\nSugra is a modern, heavy, and striking display sans-serif typeface designed for high-impact headlines, posters, and branding. Its unique letterforms blend geometric precision with playful curves.' },
  { id: 'b3', type: 'grid', fullWidth: false, images: [
    { id: 'g1', url: '/demo-assets/sugra/grid1.png', width: 1200, height: 800 },
    { id: 'g2', url: '/demo-assets/sugra/grid2.png', width: 1200, height: 800 },
    { id: 'g3', url: '/demo-assets/sugra/grid3.png', width: 1200, height: 800 },
    { id: 'g4', url: '/demo-assets/sugra/grid4.png', width: 1200, height: 800 }
  ] },
  { id: 'b4', type: 'text', content: 'TYPOGRAPHY IN ACTION\n\nThe bold weight ensures excellent readability while maintaining a strong visual presence. Perfect for editorial design, packaging, and digital interfaces.' },
  { id: 'b5', type: 'image', content: '/demo-assets/sugra/footer.png', fullWidth: true }
];

db.prepare('UPDATE artworks SET title = ?, cover_image_url = ?, blocks_json = ? WHERE artwork_id = ?').run(
  'Draft: Sugra | Bold Display Sans Serif Font', 
  'https://mir-s3-cdn-cf.behance.net/projects/404/2fac6e237804865.Y3JvcCwxNTUyLDEyMTQsMTM0LDA.jpg',
  JSON.stringify(blocks), 
  '27d7e03e-abea-4f6c-8289-b436a6402521'
);
console.log('Restored Sugra draft with GENERATED BEAUTIFUL images!');
