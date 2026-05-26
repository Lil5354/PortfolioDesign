
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
