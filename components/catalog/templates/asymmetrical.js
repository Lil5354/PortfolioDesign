
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
