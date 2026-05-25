const fs = require('fs');
const sys = fs.readFileSync('portfolio_system.jsx', 'utf8');
const keys = [...sys.matchAll(/t\((['"])(.*?)\1\)/g)].map(m => m[2]);
const i18n = fs.readFileSync('lib/i18n.jsx', 'utf8');
const missing = [...new Set(keys)].filter(k => !i18n.includes(k + ':') && !i18n.includes(k + ' :'));
console.log('MISSING KEYS:', missing.join(', '));
