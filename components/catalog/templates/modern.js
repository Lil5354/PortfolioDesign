
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
