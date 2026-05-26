import os
import re

def create_dir_if_not_exists(path):
    if not os.path.exists(path):
        os.makedirs(path)

create_dir_if_not_exists('components/catalog/templates')

# --- 1. CLASSIC TEMPLATE ---
CLASSIC_JS = """
export function renderClassic(payload, artworks) {
  const themeStyles = `
    :root {
      --ivory: ${payload.backgroundColor};
      --ink: ${payload.textColor};
      --gold: ${payload.primaryColor};
      --rust: ${payload.secondaryColor};
      --rule: ${payload.primaryColor};
      --parchment: #ede6d3;
      --sepia: #5c4a2a;
      --gold2: #d4af6a;
      --white: #fffdf8;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--ivory); color: var(--ink); font-family: '${payload.bodyFont}', serif; }
    .cover { width: 100%; min-height: 100vh; background: var(--ink); display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; page-break-after: always; }
    .cover-frame { position: absolute; inset: 30px; border: 1px solid var(--gold); opacity: 0.4; }
    .cover-inner { position: relative; z-index: 2; text-align: center; padding: 60px 80px; }
    .cover-title { font-family: '${payload.headingFont}', serif; font-size: 120px; color: var(--ivory); line-height: 0.85; }
    .cover-title-sub { font-family: '${payload.headingFont}', serif; font-size: 24px; font-style: italic; color: var(--gold2); letter-spacing: 6px; margin-top: 12px; }
    .cover-vol { font-family: '${payload.monoFont}', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 8px; color: var(--gold); text-transform: uppercase; margin-bottom: 40px; }
    
    .page { width: 100%; min-height: 100vh; padding: 80px; position: relative; overflow: hidden; page-break-after: always; background: var(--white); }
    .page-toc { background: var(--parchment); }
    .page-colophon { background: var(--ink); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
    
    h1.classic, h2.classic { font-family: '${payload.headingFont}', serif; color: var(--ink); }
    h1.classic { font-size: 48px; line-height: 1.1; margin-bottom: 20px; }
    h2.classic { font-size: 36px; line-height: 1.1; margin-bottom: 16px; }
    .body-text { font-size: 15px; line-height: 1.85; color: var(--sepia); margin-bottom: 18px; }
    
    .works-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 40px; margin-top: 40px; }
    .work-card { border: 1px solid var(--rule); background: var(--ivory); }
    .work-img { width: 100%; aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center; background: var(--ink); border-bottom: 1px solid var(--rule); }
    .work-img img { width: 100%; height: 100%; object-fit: cover; }
    .work-info { padding: 20px; }
    .work-info h4 { font-family: '${payload.headingFont}', serif; font-size: 18px; color: var(--ink); margin-bottom: 6px; }
    .work-info p { font-family: '${payload.monoFont}', sans-serif; font-size: 10px; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; margin-bottom: 10px; }
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Josefin+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>${themeStyles}</style>
    </head>
    <body>
      <div class="cover">
        <div class="cover-frame"></div>
        <div class="cover-inner">
          <p class="cover-vol">${payload.departmentName} · Số ${payload.editionNumber} · ${payload.academicYear}</p>
          <h1 class="cover-title">${payload.journalTitle}</h1>
          <p class="cover-title-sub">${payload.journalSubtitle}</p>
        </div>
      </div>
      
      <div class="page page-toc">
        <h2 class="classic" style="text-align:center">Mục Lục</h2>
        <div style="column-count: 2; column-gap: 60px; margin-top: 40px;">
          ${artworks.map((a, i) => `
            <div style="margin-bottom: 20px; border-bottom: 1px dotted var(--rule); padding-bottom: 10px;">
              <span style="font-family:'${payload.headingFont}', serif; font-size: 20px; color: var(--gold);">0${i+1}</span>
              <h4 style="font-family:'${payload.headingFont}', serif; display:inline-block; margin-left: 10px;">${a.title}</h4>
              <p style="font-family:'${payload.monoFont}', sans-serif; font-size: 9px; color: var(--sepia); margin-left: 35px;">${a.student}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="page page-body">
        <h2 class="classic" style="text-align:center">Tác Phẩm Nổi Bật</h2>
        <div class="works-grid">
          ${artworks.map(a => `
            <div class="work-card">
              <div class="work-img">
                ${a.coverImageUrl ? `<img src="${a.coverImageUrl}" />` : '<span style="color:var(--ivory)">No Image</span>'}
              </div>
              <div class="work-info">
                <p>${a.category}</p>
                <h4>${a.title}</h4>
                <small>${a.student}</small>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="page page-colophon">
        <h1 class="classic" style="color:var(--ivory); font-size: 60px;">${payload.closingText.replace(/<[^>]+>/g, '')}</h1>
        <p style="color:var(--gold); font-family:'${payload.monoFont}', sans-serif; font-size: 12px; margin-top: 20px;">${payload.schoolName}</p>
      </div>
    </body>
    </html>
  `;
}
"""

# --- 2. MODERN TEMPLATE ---
MODERN_JS = """
export function renderModern(payload, artworks) {
  const themeStyles = `
    :root {
      --black: ${payload.backgroundColor};
      --white: ${payload.textColor};
      --accent: ${payload.primaryColor};
      --accent2: ${payload.secondaryColor};
      --gray1: #1c1c1c;
      --gray2: #2e2e2e;
      --gray3: #6b6b6b;
      --grid-gap: 3px;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--black); color: var(--white); font-family: '${payload.bodyFont}', sans-serif; }
    .cover { width: 100%; min-height: 100vh; display: grid; grid-template-rows: auto 1fr auto; position: relative; overflow: hidden; page-break-after: always; }
    .cover-topbar { display: flex; justify-content: space-between; padding: 28px 40px; border-bottom: var(--grid-gap) solid var(--gray2); }
    .cover-main-title { font-family: '${payload.headingFont}', sans-serif; font-size: 140px; font-weight: 900; line-height: 0.85; text-transform: uppercase; color: var(--white); }
    .accent-word { color: var(--accent); font-style: italic; }
    .cover-hero { display: grid; grid-template-columns: 1fr 1fr; height: 100%; }
    .cover-hero-left { padding: 60px 50px; border-right: var(--grid-gap) solid var(--gray2); display: flex; flex-direction: column; justify-content: flex-end; }
    .cover-hero-right { background: var(--gray1); display: flex; align-items: center; justify-content: center; }
    
    .page { width: 100%; min-height: 100vh; position: relative; overflow: hidden; page-break-after: always; }
    .page-works { background: var(--black); padding: 40px; }
    .works-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--grid-gap); background: var(--gray2); margin-top: 20px; }
    .work-block { background: var(--black); position: relative; min-height: 300px; display: flex; flex-direction: column; }
    .work-block img { width: 100%; height: 200px; object-fit: cover; }
    .work-block-info { padding: 20px; }
    .work-title { font-family: '${payload.headingFont}', sans-serif; font-size: 24px; font-weight: 700; text-transform: uppercase; color: var(--white); }
    .work-tag { font-family: '${payload.monoFont}', monospace; font-size: 10px; color: var(--accent); text-transform: uppercase; }
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,700;0,900;1,700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
      <style>${themeStyles}</style>
    </head>
    <body>
      <div class="cover">
        <div class="cover-topbar">
          <span style="font-family:'${payload.monoFont}', monospace; font-size: 12px; color: var(--white);">${payload.schoolName}</span>
          <span style="font-family:'${payload.monoFont}', monospace; font-size: 12px; color: var(--gray3);">${payload.academicYear}</span>
        </div>
        <div class="cover-hero">
          <div class="cover-hero-left">
            <h1 class="cover-main-title">${payload.journalTitle} <span class="accent-word">${payload.editionNumber}</span></h1>
            <p style="margin-top: 20px; color: var(--gray3); font-family:'${payload.monoFont}', monospace; font-size: 12px;">${payload.journalSubtitle}</p>
          </div>
          <div class="cover-hero-right">
             <div style="width: 200px; height: 200px; background: var(--accent); border-radius: 50%;"></div>
          </div>
        </div>
      </div>
      
      <div class="page page-works">
        <h2 style="font-family:'${payload.headingFont}', sans-serif; font-size: 60px; color: var(--white); text-transform: uppercase;">Works</h2>
        <div class="works-grid">
          ${artworks.map(a => `
            <div class="work-block">
              ${a.coverImageUrl ? `<img src="${a.coverImageUrl}" />` : '<div style="height:200px; background:var(--gray1)"></div>'}
              <div class="work-block-info">
                <div class="work-tag">${a.category}</div>
                <div class="work-title">${a.title}</div>
                <div style="font-family:'${payload.monoFont}', monospace; font-size: 10px; color: var(--gray3); margin-top: 5px;">${a.student}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </body>
    </html>
  `;
}
"""

# --- 3. ASYMMETRICAL TEMPLATE ---
ASYMMETRICAL_JS = """
export function renderAsymmetrical(payload, artworks) {
  const themeStyles = `
    :root {
      --ink: ${payload.backgroundColor};
      --cream: ${payload.textColor};
      --gold: ${payload.primaryColor};
      --crimson: ${payload.secondaryColor};
      --white: #ffffff;
      --mist: #e8e4dc;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--cream); color: var(--ink); font-family: '${payload.bodyFont}', serif; }
    .cover { width: 100%; min-height: 100vh; background: var(--ink); display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; overflow: hidden; page-break-after: always; }
    .cover-title { font-family: '${payload.headingFont}', serif; font-size: 140px; font-weight: 900; color: var(--white); line-height: 0.88; text-align: center; z-index: 2; }
    .cover-title span { display: block; color: var(--gold); font-style: italic; font-size: 0.55em; }
    .bg-letter { position: absolute; font-family: '${payload.headingFont}', serif; font-size: 65vw; color: rgba(255,255,255,0.03); top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 900; z-index: 1; }
    
    .page { width: 100%; min-height: 100vh; padding: 80px 60px; position: relative; overflow: hidden; page-break-after: always; }
    .page-spread { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; background: var(--white); }
    .spread-left { background: var(--ink); padding: 80px 60px; display: flex; flex-direction: column; justify-content: center; }
    .spread-right { padding: 80px 60px; display: flex; flex-direction: column; justify-content: center; }
    
    .artwork-img { width: 100%; aspect-ratio: 1; object-fit: cover; }
    .artwork-title { font-family: '${payload.headingFont}', serif; font-size: 32px; font-weight: 700; color: var(--white); margin-bottom: 12px; }
    .artwork-author { font-family: '${payload.monoFont}', monospace; font-size: 12px; color: var(--gold); text-transform: uppercase; }
  `;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
      <style>${themeStyles}</style>
    </head>
    <body>
      <div class="cover">
        <div class="bg-letter">${payload.bgLetter || 'G'}</div>
        <h1 class="cover-title">${payload.journalTitle} <span>${payload.journalSubtitle}</span></h1>
        <p style="color: var(--gold); font-family: '${payload.monoFont}', monospace; margin-top: 40px; z-index: 2; letter-spacing: 4px;">EDITION ${payload.editionNumber}</p>
      </div>

      ${artworks.map(a => `
        <div class="page-spread">
          <div class="spread-left">
            <h2 class="artwork-title">${a.title}</h2>
            <p class="artwork-author">${a.student}</p>
            <p style="color: rgba(255,255,255,0.6); font-family: '${payload.bodyFont}', serif; margin-top: 20px; font-size: 18px; font-style: italic;">${a.category}</p>
          </div>
          <div class="spread-right">
            ${a.coverImageUrl ? `<img class="artwork-img" src="${a.coverImageUrl}" />` : '<div class="artwork-img" style="background:var(--mist)"></div>'}
          </div>
        </div>
      `).join('')}
      
      <div class="cover" style="background: linear-gradient(135deg, #2c3e50, var(--ink));">
         <h2 style="font-family:'${payload.headingFont}', serif; font-size: 60px; color: var(--white); text-align: center;">${payload.closingText.replace(/<[^>]+>/g, '')}</h2>
      </div>
    </body>
    </html>
  `;
}
"""

# --- 4. INDEX TEMPLATE ---
INDEX_JS = """
import { renderClassic } from './classic.js';
import { renderModern } from './modern.js';
import { renderAsymmetrical } from './asymmetrical.js';

export function generatePreviewHTML(payload, sortedEnabled) {
  switch (payload.layoutTheme) {
    case 'classic': return renderClassic(payload, sortedEnabled);
    case 'modern': return renderModern(payload, sortedEnabled);
    case 'asymmetrical': return renderAsymmetrical(payload, sortedEnabled);
    default: return renderModern(payload, sortedEnabled);
  }
}

export function generatePrintReadyHTML(payload, artworks) {
  const html = generatePreviewHTML(payload, artworks);
  const printCSS = `
    <style>
      @media print {
        @page { size: ${payload.pdfSize === 'A4' ? 'A4 portrait' : '210mm 210mm'}; margin: 0; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .page, .cover, .page-foreword, .page-toc, .page-closing, .page-spread, .page-body {
          page-break-after: always !important;
          break-after: page !important;
        }
        body { margin: 0 !important; }
      }
    </style>
  `;
  return html.replace('</head>', printCSS + '</head>');
}
"""

with open('components/catalog/templates/classic.js', 'w', encoding='utf-8') as f:
    f.write(CLASSIC_JS)
with open('components/catalog/templates/modern.js', 'w', encoding='utf-8') as f:
    f.write(MODERN_JS)
with open('components/catalog/templates/asymmetrical.js', 'w', encoding='utf-8') as f:
    f.write(ASYMMETRICAL_JS)
with open('components/catalog/templates/index.js', 'w', encoding='utf-8') as f:
    f.write(INDEX_JS)

print("Templates generated.")
