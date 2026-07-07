const db = require('better-sqlite3')('UEFGallery.API/gallery.db');
const uuid = require('crypto').randomUUID;

const adminId = 'e49b9f2d-1d5d-4840-bac1-e59ffd7e93bd';

const years = ['2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026'];
const yearTypes = ['Đồ án Năm 1', 'Đồ án Năm 2', 'Đồ án Năm 3', 'KLTN', 'Best of'];

const tools = [
  'Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe InDesign', 'Adobe After Effects', 
  'Adobe Premiere Pro', 'Cinema 4D', 'Blender', 'Procreate', 'Clip Studio Paint', 
  'ZBrush', 'Unity', 'Unreal Engine', 'Sketch', 'Webflow', 'Framer', 'Spline', 'Rive',
  'Maya', 'Substance Painter', 'CorelDraw', 'DaVinci Resolve'
];

const categories = [
  'Top 10 Portfolio', 'Top 5 Animation', 'Best UX Research', 'Best UI Design', 
  'Creative Logo', 'Typography Excellence', 'Best 3D Model', 'Best Character Design', 
  'Best Environment Design', 'Best Packaging', 'Outstanding Photography', 'Experimental Design', 
  'Minimalist Approach', 'Complex Composition', 'High Attention to Detail', 'Best Storyboarding', 
  'Best Motion Graphics', 'Colorful', 'Dark Mode Excellence', 'Best Interaction Design', 
  'Concept Art', 'Concept Development', 'Brand Strategy', 'Social Media Campaign', 
  'Best Mockup', 'Excellent Render', 'Innovative Idea', 'Editor\'s Choice', 'Honorable Mention',
  'Sustainable Design', 'Inclusive Design', 'Client Favorite', 'Highest Grade', 'Most Popular'
];

let badges = [];

// Generate Year badges
years.forEach(year => {
    yearTypes.forEach(type => {
        badges.push(type + ' ' + year);
    });
});

// Add tools and categories
badges = badges.concat(tools).concat(categories);

const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981', '#14B8A6', 
    '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', 
    '#F43F5E', '#1D4ED8', '#047857', '#B91C1C', '#C2410C', '#4D7C0F', '#0F766E', '#1D4ED8',
    '#4338CA', '#7E22CE', '#BE185D', '#E11D48', '#27272A', '#52525B', '#171717', '#1E293B',
    '#0F172A', '#581C87', '#9D174D', '#831843', '#064E3B', '#14532D', '#78350F', '#451A03'
];

const insertBadge = db.prepare('INSERT INTO badges (badge_id, name, color_code, text_color, lecturer_id, created_at) VALUES (?, ?, ?, ?, ?, ?)');

let count = 0;
badges.forEach((name, i) => {
    // Pick a pseudo-random color for variety
    const bgColor = colors[i % colors.length];
    // White text is safe for these mostly dark/vibrant colors
    insertBadge.run(uuid(), name, bgColor, '#FFFFFF', adminId, new Date().toISOString());
    count++;
});

console.log('Inserted ' + count + ' badges successfully.');
