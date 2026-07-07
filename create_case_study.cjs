const db = require('better-sqlite3')('UEFGallery.API/gallery.db');
const uuid = require('crypto').randomUUID();

const blocks = [
  { id: 'b1', type: 'image', content: '', data: { url: '/demo-assets/sugra/hero.png' }, fullWidth: true },
  { id: 'b2', type: 'text', content: 'SUGRA - BOLD DISPLAY SANS\n\nSugra is a modern, heavy, and striking display sans-serif typeface designed for high-impact headlines, posters, and branding. Its unique letterforms blend geometric precision with playful curves.', data: {} },
  { id: 'b3', type: 'color', content: '', data: { colors: ['#1A1A1A', '#FFC82C', '#FFFFFF', '#F5F5F5'] } },
  { id: 'b4', type: 'typography', content: '', data: { fontName: 'Outfit' } },
  { id: 'b5', type: 'image', content: '', data: { url: '/demo-assets/sugra/grid1.png' }, fullWidth: false },
  { id: 'b6', type: 'image', content: '', data: { url: '/demo-assets/sugra/grid3.png' }, fullWidth: false },
  { id: 'b7', type: 'text', content: 'TYPOGRAPHY IN ACTION\n\nThe bold weight ensures excellent readability while maintaining a strong visual presence. Perfect for editorial design, packaging, and digital interfaces.', data: {} },
  { id: 'b8', type: 'image', content: '', data: { url: '/demo-assets/sugra/footer.png' }, fullWidth: true }
];

db.prepare('INSERT INTO artworks (artwork_id, user_id, title, description, cover_image_url, blocks_json, is_public, is_pending, is_highlighted, is_ai_confirmed, is_ai_verified, view_count, like_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
  uuid,
  'e49b9f2d-1d5d-4840-bac1-e59ffd7e93bd',
  'Sugra: Brand Identity & Typography',
  'A complete case study for the Sugra typeface, featuring bold graphics, typography, and a striking yellow-black-white color palette.',
  '/demo-assets/sugra/hero.png',
  JSON.stringify(blocks),
  1,
  0,
  0,
  1,
  1,
  0,
  0,
  new Date().toISOString(),
  new Date().toISOString()
);
console.log('Inserted published case study artwork: ' + uuid);
