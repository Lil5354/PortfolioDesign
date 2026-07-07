const db = require('better-sqlite3')('UEFGallery.API/gallery.db');

const blocks = [
  { id: 'b1', type: 'image', content: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400/2fac6e237804865.Y3JvcCwxNTUyLDEyMTQsMTM0LDA.jpg', fullWidth: true },
  { id: 'b2', type: 'text', content: 'SUGRA - BOLD DISPLAY SANS\n\nSugra is a modern, heavy, and striking display sans-serif typeface designed for high-impact headlines, posters, and branding. Its unique letterforms blend geometric precision with playful curves.' },
  { id: 'b3', type: 'grid', fullWidth: false, images: [
    { id: 'g1', url: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=100&w=1200', width: 1200, height: 800 },
    { id: 'g2', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=100&w=1200', width: 1200, height: 800 },
    { id: 'g3', url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=100&w=1200', width: 1200, height: 800 },
    { id: 'g4', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=100&w=1200', width: 1200, height: 800 }
  ] },
  { id: 'b4', type: 'text', content: 'TYPOGRAPHY IN ACTION\n\nThe bold weight ensures excellent readability while maintaining a strong visual presence. Perfect for editorial design, packaging, and digital interfaces.' },
  { id: 'b5', type: 'image', content: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=100&w=2000', fullWidth: true }
];

db.prepare('UPDATE artworks SET title = ?, cover_image_url = ?, blocks_json = ? WHERE artwork_id = ?').run(
  'Draft: Sugra | Bold Display Sans Serif Font', 
  'https://mir-s3-cdn-cf.behance.net/projects/404/2fac6e237804865.Y3JvcCwxNTUyLDEyMTQsMTM0LDA.jpg',
  JSON.stringify(blocks), 
  '27d7e03e-abea-4f6c-8289-b436a6402521'
);
console.log('Restored Sugra draft title, cover, and blocks!');
