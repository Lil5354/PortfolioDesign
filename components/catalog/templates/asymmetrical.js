export function renderAsymmetrical(payload, artworks) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GRAPHICA — Tập San Ấn Phẩm Thiết Kế Đồ Họa 2025</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root {
    --ink: ${payload.backgroundColor};
    --cream: ${payload.textColor};
    --gold: ${payload.primaryColor};
    --gold-light: #e8d5a3;
    --crimson: ${payload.secondaryColor};
    --slate: #2c3e50;
    --mist: #e8e4dc;
    --white: #fefefe;
    --accent: #d4883a;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--cream);
    color: var(--ink);
    font-family: '${payload.bodyFont}', serif;
    overflow-x: hidden;
  }

  /* ═══════════════════════════════════
     TRANG BÌA (COVER)
  ═══════════════════════════════════ */
  .cover {
    width: 100%;
    min-height: 100vh;
    background: var(--ink);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    page-break-after: always;
  }

  /* Grain texture overlay */
  .cover::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
    opacity: 0.15;
    z-index: 1;
  }

  /* Decorative gold border */
  .cover::after {
    content: '';
    position: absolute;
    inset: 24px;
    border: 1px solid rgba(201,168,76,0.35);
    z-index: 2;
    pointer-events: none;
  }

  /* Background large "G" */
  .cover-bg-letter {
    position: absolute;
    font-family: '${payload.headingFont}', serif;
    font-size: 65vw;
    color: rgba(201,168,76,0.04);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -52%);
    font-weight: 900;
    z-index: 1;
    user-select: none;
    line-height: 1;
  }

  .cover-inner {
    position: relative;
    z-index: 3;
    text-align: center;
    padding: 60px 40px;
  }

  .cover-eyebrow {
    font-family: '${payload.monoFont}', monospace;
    font-size: 11px;
    letter-spacing: 6px;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 32px;
    opacity: 0;
    animation: fadeUp 1s ease 0.3s forwards;
  }

  .cover-title {
    font-family: '${payload.headingFont}', serif;
    font-size: clamp(72px, 12vw, 160px);
    font-weight: 900;
    color: var(--white);
    line-height: 0.88;
    letter-spacing: -2px;
    margin-bottom: 16px;
    opacity: 0;
    animation: fadeUp 1s ease 0.5s forwards;
  }

  .cover-title span {
    display: block;
    color: var(--gold);
    font-style: italic;
    font-size: 0.55em;
    letter-spacing: 4px;
  }

  .cover-subtitle {
    font-family: '${payload.bodyFont}', serif;
    font-size: clamp(16px, 2.5vw, 22px);
    color: rgba(245,240,232,0.65);
    font-style: italic;
    letter-spacing: 2px;
    margin-top: 24px;
    margin-bottom: 48px;
    opacity: 0;
    animation: fadeUp 1s ease 0.7s forwards;
  }

  /* Cover illustration SVG */
  .cover-illustration {
    width: clamp(280px, 50vw, 480px);
    margin: 32px auto;
    opacity: 0;
    animation: fadeIn 1.4s ease 0.9s forwards;
  }

  .cover-meta {
    position: absolute;
    bottom: 48px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 60px;
    z-index: 3;
    opacity: 0;
    animation: fadeIn 1s ease 1.2s forwards;
  }

  .cover-meta-item {
    font-family: '${payload.monoFont}', monospace;
    font-size: 10px;
    color: rgba(201,168,76,0.7);
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  /* Diagonal gold line */
  .cover-line {
    position: absolute;
    width: 1px;
    height: 35%;
    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
    left: 50%;
    top: 0;
    z-index: 2;
    animation: slideDown 1.5s ease 0.2s both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideDown {
    from { height: 0; opacity: 0; }
    to { height: 35%; opacity: 1; }
  }

  /* ═══════════════════════════════════
     TRANG LỜI MỞ ĐẦU
  /* =================== PAGES =================== */
  @media screen {
    body {
      background: #888 !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      padding: 2rem 0;
    }
    .page {
      width: ${payload.pdfOrientation === 'landscape' ? '297mm' : '210mm'} !important;
      height: ${payload.pdfOrientation === 'landscape' ? '210mm' : '297mm'} !important;
      min-height: unset !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
      background-color: var(--bg);
    }
  }
  @media print {
    .page {
      width: 100%;
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      background-color: var(--bg);
    }
  }

  .page-foreword {
    background: var(--white);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .page-number {
    position: absolute;
    bottom: 40px;
    right: 60px;
    font-family: '${payload.monoFont}', monospace;
    font-size: 10px;
    letter-spacing: 4px;
    color: var(--gold);
    text-transform: uppercase;
  }

  .section-label {
    font-family: '${payload.monoFont}', monospace;
    font-size: 10px;
    letter-spacing: 5px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gold-light);
    max-width: 60px;
  }

  .page-heading {
    font-family: '${payload.headingFont}', serif;
    font-size: clamp(36px, 4vw, 60px);
    font-weight: 700;
    line-height: 1.1;
    color: var(--ink);
    margin-bottom: 28px;
  }

  .page-heading em {
    color: var(--crimson);
    font-style: italic;
  }

  .body-text {
    font-family: '${payload.bodyFont}', serif;
    font-size: 18px;
    line-height: 1.9;
    color: #3a3a3a;
    font-weight: 400;
  }

  .body-text p { margin-bottom: 20px; }

  .drop-cap::first-letter {
    float: left;
    font-family: '${payload.headingFont}', serif;
    font-size: 88px;
    line-height: 0.75;
    padding-right: 12px;
    padding-top: 8px;
    color: var(--gold);
    font-weight: 900;
  }

  .pull-quote {
    border-left: 3px solid var(--gold);
    padding: 20px 28px;
    margin: 32px 0;
    background: rgba(201,168,76,0.06);
  }

  .pull-quote p {
    font-family: '${payload.headingFont}', serif;
    font-size: 22px;
    font-style: italic;
    line-height: 1.5;
    color: var(--slate);
    margin: 0;
  }

  /* ═══════════════════════════════════
     MỤC LỤC
  ═══════════════════════════════════ */
  .page-toc {
    background: var(--ink);
    color: var(--white);
    padding: 80px 80px;
  }

  .toc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    margin-top: 56px;
  }

  .toc-item {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    padding: 24px 0;
    border-bottom: 1px solid rgba(201,168,76,0.2);
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    color: inherit;
  }

  .toc-item:hover .toc-number { color: var(--gold); }
  .toc-item:hover .toc-title { color: var(--gold-light); }

  .toc-number {
    font-family: '${payload.monoFont}', monospace;
    font-size: 11px;
    color: rgba(201,168,76,0.5);
    letter-spacing: 2px;
    padding-top: 4px;
    transition: color 0.3s;
    min-width: 32px;
  }

  .toc-content { flex: 1; }

  .toc-title {
    font-family: '${payload.headingFont}', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--white);
    line-height: 1.2;
    transition: color 0.3s;
    margin-bottom: 8px;
  }

  .toc-desc {
    font-family: '${payload.bodyFont}', serif;
    font-size: 14px;
    color: rgba(245,240,232,0.45);
    font-style: italic;
    line-height: 1.5;
  }

  .toc-page {
    font-family: '${payload.monoFont}', monospace;
    font-size: 28px;
    color: rgba(201,168,76,0.25);
    font-weight: 700;
    align-self: center;
  }

  /* ═══════════════════════════════════
     BODY - PHẦN NỘI DUNG CHÍNH
  ═══════════════════════════════════ */
  .page-body {
    background: var(--mist);
    padding: 80px 60px;
  }

  .article-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    margin-top: 56px;
  }

  .article-card {
    background: var(--white);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
  }

  .article-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 48px rgba(10,10,10,0.12);
  }

  .article-card.featured {
    grid-column: span 2;
  }

  .card-image {
    width: 100%;
    aspect-ratio: 16/10;
    overflow: hidden;
    position: relative;
  }

  .card-image.tall { aspect-ratio: 4/5; }

  .card-image svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .card-body { padding: 28px; }

  .card-tag {
    font-family: '${payload.monoFont}', monospace;
    font-size: 9px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
  }

  .card-title {
    font-family: '${payload.headingFont}', serif;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 12px;
    color: var(--ink);
  }

  .card-excerpt {
    font-family: '${payload.bodyFont}', serif;
    font-size: 15px;
    line-height: 1.7;
    color: #555;
    font-style: italic;
  }

  .card-author {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--mist);
  }

  .author-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--crimson));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: '${payload.headingFont}', serif;
    font-size: 13px;
    color: var(--white);
    font-weight: 700;
  }

  .author-info { flex: 1; }
  .author-name {
    font-family: '${payload.monoFont}', monospace;
    font-size: 10px;
    letter-spacing: 1px;
    color: var(--ink);
    font-weight: 700;
  }
  .author-role {
    font-family: '${payload.bodyFont}', serif;
    font-size: 12px;
    color: #888;
    font-style: italic;
  }

  /* ═══════════════════════════════════
     SPREAD LAYOUTS (bố cục nội dung)
  ═══════════════════════════════════ */
  .page-spread {
    background: var(--white);
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 100vh;
  }

  .spread-left {
    background: var(--ink);
    padding: 80px 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .spread-left::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.15), transparent 70%);
    top: -100px;
    right: -100px;
  }

  .spread-right {
    padding: 80px 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .spread-visual {
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
  }

  /* ═══════════════════════════════════
     LỜI KẾT / CẢM ƠN
  ═══════════════════════════════════ */
  .page-closing {
    background: linear-gradient(135deg, var(--slate) 0%, #1a1a2e 50%, var(--ink) 100%);
    padding: 100px 80px;
    text-align: center;
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .page-closing::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 70%);
  }

  .closing-ornament {
    color: var(--gold);
    font-size: 48px;
    margin-bottom: 40px;
    opacity: 0.6;
  }

  .closing-title {
    font-family: '${payload.headingFont}', serif;
    font-size: clamp(40px, 6vw, 80px);
    font-weight: 900;
    color: var(--white);
    line-height: 1.05;
    margin-bottom: 24px;
  }

  .closing-title em {
    color: var(--gold);
    font-style: italic;
  }

  .closing-body {
    font-family: '${payload.bodyFont}', serif;
    font-size: 20px;
    color: rgba(245,240,232,0.7);
    line-height: 1.9;
    max-width: 640px;
    margin: 0 auto 48px;
    font-style: italic;
  }

  .thanks-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    list-style: none;
    margin-top: 40px;
  }

  .thanks-list li {
    font-family: '${payload.monoFont}', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(201,168,76,0.7);
    padding: 8px 20px;
    border: 1px solid rgba(201,168,76,0.3);
    border-radius: 0;
  }

  .school-info {
    position: relative;
    z-index: 2;
    margin-top: 60px;
    padding-top: 40px;
    border-top: 1px solid rgba(201,168,76,0.3);
    width: 100%;
    max-width: 600px;
  }

  .school-name {
    font-family: '${payload.headingFont}', serif;
    font-size: 20px;
    color: var(--white);
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: 1px;
  }

  .school-detail {
    font-family: '${payload.monoFont}', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    color: rgba(201,168,76,0.6);
    text-transform: uppercase;
  }

  /* ═══════════════════════════════════
     DIVIDERS & ORNAMENTS
  ═══════════════════════════════════ */
  .divider {
    display: flex;
    align-items: center;
    gap: 20px;
    margin: 48px 0;
  }
  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--gold-light));
  }
  .divider::after {
    background: linear-gradient(to left, transparent, var(--gold-light));
  }
  .divider-ornament {
    color: var(--gold);
    font-size: 18px;
  }

  .highlight-box {
    background: linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04));
    border: 1px solid rgba(201,168,76,0.3);
    padding: 32px 36px;
    margin: 32px 0;
    position: relative;
  }

  .highlight-box::before {
    content: '"';
    position: absolute;
    top: -20px;
    left: 24px;
    font-family: '${payload.headingFont}', serif;
    font-size: 80px;
    color: var(--gold);
    opacity: 0.3;
    line-height: 1;
  }

  /* Light text on dark bg */
  .text-light { color: var(--white) !important; }
  .text-light .section-label { color: var(--gold); }
  .text-light .page-heading { color: var(--white); }
  .text-light .body-text { color: rgba(245,240,232,0.75); }

  /* Stat display */
  .stats-row {
    display: flex;
    gap: 0;
    margin: 40px 0;
  }
  .stat-item {
    flex: 1;
    text-align: center;
    padding: 24px 16px;
    border-right: 1px solid rgba(201,168,76,0.2);
  }
  .stat-item:last-child { border-right: none; }
  .stat-number {
    font-family: '${payload.headingFont}', serif;
    font-size: 48px;
    font-weight: 900;
    color: var(--gold);
    display: block;
    line-height: 1;
  }
  .stat-label {
    font-family: '${payload.monoFont}', monospace;
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(245,240,232,0.5);
    margin-top: 8px;
    display: block;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--ink); }
  ::-webkit-scrollbar-thumb { background: var(--gold); }

  /* Print styles */
  @media print {
    .cover, .page, .page-spread, .page-toc, .page-closing { page-break-after: always; }
  }

  /* Responsive */
  @media (max-width: 900px) {
    .page-foreword, .toc-grid, .article-grid, .page-spread {
      grid-template-columns: 1fr;
    }
    .article-card.featured { grid-column: span 1; }
    .page, .page-body, .page-toc, .page-closing { padding: 60px 32px; }
    .cover-meta { padding: 0 32px; }
  }
</style>
</head>
<body>

<!-- ══════════════════════════════
     TRANG BÌA
══════════════════════════════ -->
<section class="cover" id="cover">
  <div class="cover-bg-letter">${payload.bgLetter || 'G'}</div>
  <div class="cover-line"></div>

  <div class="cover-inner">
    <p class="cover-eyebrow">${payload.departmentName} &nbsp;&middot;&nbsp; ${payload.academicYear}</p>

    <h1 class="cover-title">
      GRAPHICA
      <span>Ấn Phẩm Thiết Kế</span>
    </h1>

    <p class="cover-subtitle">${payload.journalSubtitle}</p>

    <!-- Cover SVG Illustration -->
    <div class="cover-illustration">
      <svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" fill="none">
        <!-- Background shape -->
        <rect x="20" y="20" width="440" height="280" fill="none" stroke="rgba(201,168,76,0.2)" stroke-width="1"/>
        <!-- Abstract composition -->
        <circle cx="240" cy="160" r="110" fill="none" stroke="rgba(201,168,76,0.15)" stroke-width="1"/>
        <circle cx="240" cy="160" r="75" fill="none" stroke="rgba(201,168,76,0.25)" stroke-width="1"/>

        <!-- Gold geometric accent -->
        <polygon points="240,50 310,120 240,190 170,120" fill="none" stroke="#c9a84c" stroke-width="1.5"/>
        <polygon points="240,80 290,130 240,180 190,130" fill="rgba(201,168,76,0.08)" stroke="#c9a84c" stroke-width="0.8"/>

        <!-- Typography element -->
        <text x="240" y="175" text-anchor="middle" font-family="'Playfair Display', serif" font-size="64" font-weight="900" fill="rgba(201,168,76,0.2)" letter-spacing="-2">G</text>

        <!-- Corner ornaments -->
        <line x1="20" y1="20" x2="60" y2="20" stroke="#c9a84c" stroke-width="2"/>
        <line x1="20" y1="20" x2="20" y2="60" stroke="#c9a84c" stroke-width="2"/>
        <line x1="460" y1="20" x2="420" y2="20" stroke="#c9a84c" stroke-width="2"/>
        <line x1="460" y1="20" x2="460" y2="60" stroke="#c9a84c" stroke-width="2"/>
        <line x1="20" y1="300" x2="60" y2="300" stroke="#c9a84c" stroke-width="2"/>
        <line x1="20" y1="300" x2="20" y2="260" stroke="#c9a84c" stroke-width="2"/>
        <line x1="460" y1="300" x2="420" y2="300" stroke="#c9a84c" stroke-width="2"/>
        <line x1="460" y1="300" x2="460" y2="260" stroke="#c9a84c" stroke-width="2"/>

        <!-- Scattered letters -->
        <text x="60" y="100" font-family="'Playfair Display', serif" font-size="14" fill="rgba(201,168,76,0.4)" transform="rotate(-12,60,100)">TYPE</text>
        <text x="370" y="230" font-family="'Playfair Display', serif" font-size="14" fill="rgba(201,168,76,0.4)" transform="rotate(8,370,230)">FORM</text>
        <text x="55" y="230" font-family="'Space Mono', monospace" font-size="9" fill="rgba(201,168,76,0.3)" transform="rotate(-5,55,230)">COLOR</text>
        <text x="360" y="90" font-family="'Space Mono', monospace" font-size="9" fill="rgba(201,168,76,0.3)" transform="rotate(10,360,90)">SPACE</text>

        <!-- Horizontal rule -->
        <line x1="140" y1="255" x2="340" y2="255" stroke="rgba(201,168,76,0.3)" stroke-width="1"/>
        <text x="240" y="272" text-anchor="middle" font-family="'Space Mono', monospace" font-size="9" fill="rgba(201,168,76,0.6)" letter-spacing="5">VII · 2025</text>
      </svg>
    </div>
  </div>

  <div class="cover-meta">
    <span class="cover-meta-item">ấn phẩm số VII</span>
    <span class="cover-meta-item">thiết kế · sáng tạo · truyền cảm hứng</span>
    <span class="cover-meta-item">HCM · 2025</span>
  </div>
</section>


<!-- ══════════════════════════════
     LỜI MỞ ĐẦU
══════════════════════════════ -->
<section class="page page-foreword" id="foreword">
  <div>
    <div class="section-label">Lời Mở Đầu</div>
    <h2 class="page-heading">Nơi Ý Tưởng<br><em>Trở Thành</em><br>Thị Giác</h2>

    <div class="divider"><span class="divider-ornament">◆</span></div>

    <div class="body-text">${payload.forewordText}</div>

    <div class="divider"><span class="divider-ornament">◆</span></div>

    <p style="font-family: '${payload.monoFont}', monospace;font-size:11px;letter-spacing:2px;color:var(--gold)">— Ban Biên Tập GRAPHICA VII</p>
  </div>

  <!-- Illustration: foreword visual -->
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;">
    <svg viewBox="0 0 360 420" xmlns="http://www.w3.org/2000/svg" fill="none" style="width:100%;max-width:340px;">
      <!-- Background -->
      <rect x="0" y="0" width="360" height="420" fill="#0a0a0a"/>
      <!-- Gold geometric forms -->
      <circle cx="180" cy="210" r="160" fill="none" stroke="rgba(201,168,76,0.12)" stroke-width="1"/>
      <circle cx="180" cy="210" r="120" fill="none" stroke="rgba(201,168,76,0.18)" stroke-width="1"/>
      <circle cx="180" cy="210" r="80" fill="none" stroke="rgba(201,168,76,0.25)" stroke-width="1.5"/>

      <!-- Eye / Aperture shape -->
      <path d="M 60,210 Q 180,100 300,210 Q 180,320 60,210 Z" fill="rgba(201,168,76,0.08)" stroke="#c9a84c" stroke-width="1.5"/>
      <circle cx="180" cy="210" r="40" fill="rgba(139,26,26,0.6)" stroke="#c9a84c" stroke-width="1.5"/>
      <circle cx="180" cy="210" r="22" fill="rgba(10,10,10,0.8)"/>
      <circle cx="192" cy="198" r="7" fill="rgba(201,168,76,0.6)"/>

      <!-- Radial lines -->
      <line x1="180" y1="50" x2="180" y2="370" stroke="rgba(201,168,76,0.1)" stroke-width="1"/>
      <line x1="20" y1="210" x2="340" y2="210" stroke="rgba(201,168,76,0.1)" stroke-width="1"/>
      <line x1="60" y1="90" x2="300" y2="330" stroke="rgba(201,168,76,0.08)" stroke-width="1"/>
      <line x1="300" y1="90" x2="60" y2="330" stroke="rgba(201,168,76,0.08)" stroke-width="1"/>

      <!-- Text at top -->
      <text x="180" y="38" text-anchor="middle" font-family="'Space Mono', monospace" font-size="8" fill="rgba(201,168,76,0.5)" letter-spacing="5">VISION · FORM · EXPRESSION</text>

      <!-- Bottom text -->
      <text x="180" y="400" text-anchor="middle" font-family="'Playfair Display', serif" font-size="14" fill="rgba(201,168,76,0.5)" font-style="italic">Thiết Kế Là Nhân Văn</text>
    </svg>

    <div style="text-align:center">
      <div class="stats-row" style="border:1px solid var(--mist);background:var(--cream)">
        <div class="stat-item" style="border-color:var(--gold-light)">
          <span class="stat-number" style="color:var(--crimson)">48</span>
          <span class="stat-label" style="color:#888">Tác phẩm</span>
        </div>
        <div class="stat-item" style="border-color:var(--gold-light)">
          <span class="stat-number" style="color:var(--crimson)">12</span>
          <span class="stat-label" style="color:#888">Tác giả</span>
        </div>
        <div class="stat-item" style="border-color:transparent">
          <span class="stat-number" style="color:var(--crimson)">6</span>
          <span class="stat-label" style="color:#888">Chuyên đề</span>
        </div>
      </div>
    </div>
  </div>

  <div class="page-number">GRAPHICA VII &nbsp;·&nbsp; LỜI MỞ ĐẦU &nbsp;·&nbsp; 03</div>
</section>


<!-- ══════════════════════════════
     MỤC LỤC
══════════════════════════════ -->
<section class="page page-toc" id="toc">
  <div class="section-label" style="color:var(--gold)">Nội Dung</div>
  <h2 style="font-family: '${payload.headingFont}', serif;font-size:clamp(40px,5vw,72px);font-weight:900;color:var(--white);line-height:1.05">
    Mục<br><em style="color:var(--gold);font-style:italic">Lục</em>
  </h2>

  <div class="toc-grid">
    <a href="#foreword" class="toc-item">
      <span class="toc-number">01</span>
      <div class="toc-content">
        <div class="toc-title">Lời Mở Đầu</div>
        <div class="toc-desc">Nơi ý tưởng trở thành thị giác — thông điệp từ Ban Biên Tập</div>
      </div>
      <span class="toc-page">03</span>
    </a>

    <a href="#identity" class="toc-item">
      <span class="toc-number">02</span>
      <div class="toc-content">
        <div class="toc-title">Nhận Diện Thương Hiệu</div>
        <div class="toc-desc">Brand Identity & Visual Systems — Xây dựng hệ thống nhận diện toàn diện</div>
      </div>
      <span class="toc-page">08</span>
    </a>

    <a href="#typography" class="toc-item">
      <span class="toc-number">03</span>
      <div class="toc-content">
        <div class="toc-title">Typography & Chữ Nghệ Thuật</div>
        <div class="toc-desc">Thực nghiệm với hình thái chữ và sức mạnh của ngôn ngữ thị giác</div>
      </div>
      <span class="toc-page">16</span>
    </a>

    <a href="#illustration" class="toc-item">
      <span class="toc-number">04</span>
      <div class="toc-content">
        <div class="toc-title">Minh Họa & Nghệ Thuật Số</div>
        <div class="toc-desc">Editorial illustration, concept art và phong cách thị giác đương đại</div>
      </div>
      <span class="toc-page">26</span>
    </a>

    <a href="#packaging" class="toc-item">
      <span class="toc-number">05</span>
      <div class="toc-content">
        <div class="toc-title">Thiết Kế Bao Bì & Ấn Phẩm</div>
        <div class="toc-desc">Packaging design, poster, brochure — ấn phẩm gặp gỡ thực tiễn</div>
      </div>
      <span class="toc-page">36</span>
    </a>

    <a href="#closing" class="toc-item">
      <span class="toc-number">06</span>
      <div class="toc-content">
        <div class="toc-title">Lời Kết & Cảm Ơn</div>
        <div class="toc-desc">Ghi nhận những đóng góp và truyền cảm hứng cho hành trình tiếp theo</div>
      </div>
      <span class="toc-page">48</span>
    </a>
  </div>

  <div class="page-number" style="color:rgba(201,168,76,0.5)">GRAPHICA VII &nbsp;·&nbsp; MỤC LỤC &nbsp;·&nbsp; 05</div>
</section>


<!-- ══════════════════════════════
     SPREAD: NHẬN DIỆN THƯƠNG HIỆU
══════════════════════════════ -->
<section class="page-spread" id="identity">
  <div class="spread-left">
    <div class="section-label text-light" style="color:var(--gold)">Chuyên Đề 02</div>
    <h2 style="font-family: '${payload.headingFont}', serif;font-size:clamp(32px,4vw,56px);font-weight:900;color:var(--white);line-height:1.1;margin-bottom:28px;">
      Nhận Diện<br><em style="color:var(--gold)">Thương Hiệu</em>
    </h2>

    <div class="stats-row" style="border-top:1px solid rgba(201,168,76,0.2);border-bottom:1px solid rgba(201,168,76,0.2);margin:28px 0;">
      <div class="stat-item">
        <span class="stat-number">14</span>
        <span class="stat-label">Dự án</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">6</span>
        <span class="stat-label">Tác giả</span>
      </div>
    </div>

    <div class="body-text" style="color:rgba(245,240,232,0.72)">
      <p>Nhận diện thương hiệu là linh hồn của một tổ chức được trực quan hóa. Trong chuyên đề này, các sinh viên đã vận dụng phương pháp luận thiết kế hiện đại để kiến tạo những hệ thống thị giác đồng bộ, bền vững và có chiều sâu văn hóa.</p>
      <p>Từ logo mark, color system, typography scale cho đến brand guidelines — từng dự án đều thể hiện sự hiểu biết sâu sắc về mối quan hệ giữa thương hiệu và con người.</p>
    </div>

    <!-- Featured brand logo illustration -->
    <div style="margin-top:36px;">
      <svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" fill="none" style="width:100%">
        <!-- Logo concept 1: AURA -->
        <rect x="10" y="10" width="130" height="160" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.25)" stroke-width="1"/>
        <circle cx="75" cy="80" r="35" fill="none" stroke="#c9a84c" stroke-width="2"/>
        <circle cx="75" cy="80" r="22" fill="rgba(201,168,76,0.2)"/>
        <text x="75" y="134" text-anchor="middle" font-family="'Playfair Display',serif" font-size="13" fill="#c9a84c" font-weight="700" letter-spacing="4">AURA</text>
        <text x="75" y="148" text-anchor="middle" font-family="'Space Mono',monospace" font-size="7" fill="rgba(201,168,76,0.5)" letter-spacing="3">STUDIO</text>

        <!-- Logo concept 2: KOVA -->
        <rect x="155" y="10" width="130" height="160" fill="rgba(139,26,26,0.06)" stroke="rgba(139,26,26,0.25)" stroke-width="1"/>
        <polygon points="220,30 255,90 185,90" fill="none" stroke="#8b1a1a" stroke-width="2"/>
        <polygon points="220,70 245,115 195,115" fill="rgba(139,26,26,0.2)"/>
        <text x="220" y="142" text-anchor="middle" font-family="'Playfair Display',serif" font-size="14" fill="#8b1a1a" font-weight="900" letter-spacing="3">KOVA</text>
        <text x="220" y="157" text-anchor="middle" font-family="'Space Mono',monospace" font-size="7" fill="rgba(139,26,26,0.5)" letter-spacing="2">ARCHITECTS</text>
      </svg>
    </div>
  </div>

  <div class="spread-right">
    <div class="section-label">Brand Showcase</div>

    <!-- Brand cards -->
    <div style="display:flex;flex-direction:column;gap:28px;">

      <div style="border:1px solid var(--mist);padding:24px;background:var(--cream)">
        <div style="display:grid;grid-template-columns:80px 1fr;gap:20px;align-items:center">
          <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" fill="#0a0a0a"/>
            <circle cx="40" cy="40" r="28" fill="none" stroke="#c9a84c" stroke-width="2"/>
            <path d="M26,40 L40,26 L54,40 L40,54 Z" fill="#c9a84c"/>
            <circle cx="40" cy="40" r="8" fill="#0a0a0a"/>
          </svg>
          <div>
            <div class="card-tag">Brand Identity · 2025</div>
            <div style="font-family: '${payload.headingFont}', serif;font-size:18px;font-weight:700;color:var(--ink)">NEXUS Architecture</div>
            <div style="font-family: '${payload.bodyFont}', serif;font-size:14px;color:#777;font-style:italic">Thiết kế: Nguyễn Minh Châu</div>
          </div>
        </div>
        <p style="font-family: '${payload.bodyFont}', serif;font-size:15px;line-height:1.7;color:#555;margin-top:16px;font-style:italic">Hệ thống nhận diện lấy cảm hứng từ điểm giao thoa kiến trúc đương đại và triết học phương Đông — nơi kỳ hà học gặp gỡ tâm linh.</p>
      </div>

      <div style="border:1px solid var(--mist);padding:24px;background:var(--cream)">
        <div style="display:grid;grid-template-columns:80px 1fr;gap:20px;align-items:center">
          <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" fill="#8b1a1a"/>
            <text x="40" y="52" text-anchor="middle" font-family="'Playfair Display',serif" font-size="36" fill="#f5f0e8" font-weight="900" font-style="italic">V</text>
          </svg>
          <div>
            <div class="card-tag">Brand Identity · 2025</div>
            <div style="font-family: '${payload.headingFont}', serif;font-size:18px;font-weight:700;color:var(--ink)">Vela Fine Dining</div>
            <div style="font-family: '${payload.bodyFont}', serif;font-size:14px;color:#777;font-style:italic">Thiết kế: Trần Thanh Hương</div>
          </div>
        </div>
        <p style="font-family: '${payload.bodyFont}', serif;font-size:15px;line-height:1.7;color:#555;margin-top:16px;font-style:italic">Thương hiệu nhà hàng cao cấp với bản sắc Địa Trung Hải — kết hợp màu sắc đỏ cardinal với typography thanh lịch tạo nên trải nghiệm xa xỉ tinh tế.</p>
      </div>

      <div class="highlight-box">
        <p style="font-family: '${payload.bodyFont}', serif;font-size:17px;font-style:italic;line-height:1.7;color:var(--slate)">"Một logo tốt không phải là logo đẹp — mà là logo đúng. Đúng với bản chất thương hiệu, đúng với kỳ vọng khách hàng, và đúng với thời đại."</p>
        <p style="font-family: '${payload.monoFont}', monospace;font-size:10px;letter-spacing:2px;color:var(--gold);margin-top:12px">— GV. Phạm Thế Anh, Giảng viên Thiết kế Nhận diện</p>
      </div>
    </div>

    <div class="page-number">GRAPHICA VII &nbsp;·&nbsp; NHẬN DIỆN THƯƠNG HIỆU &nbsp;·&nbsp; 11</div>
  </div>
</section>


<!-- ══════════════════════════════
     BODY: NỘI DUNG CHÍNH - TYPOGRAPHY
══════════════════════════════ -->
<section class="page page-body" id="typography">
  <div class="section-label">Chuyên Đề 03</div>
  <h2 class="page-heading">Typography &<br><em>Chữ Nghệ Thuật</em></h2>

  <div class="article-grid">
    <!-- Featured article -->
    <div class="article-card featured">
      <div class="card-image">
        <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" fill="none" style="width:100%;height:100%">
          <rect width="600" height="380" fill="#1a1a2e"/>
          <!-- Giant letter composition -->
          <text x="-30" y="320" font-family="'Playfair Display',serif" font-size="380" fill="rgba(201,168,76,0.06)" font-weight="900">A</text>
          <!-- Overlaid colored letters -->
          <text x="50" y="280" font-family="'Playfair Display',serif" font-size="200" fill="rgba(139,26,26,0.4)" font-weight="900" font-style="italic">T</text>
          <text x="160" y="280" font-family="'Playfair Display',serif" font-size="200" fill="rgba(201,168,76,0.3)" font-weight="900">Y</text>
          <text x="280" y="280" font-family="'Playfair Display',serif" font-size="200" fill="rgba(245,240,232,0.15)" font-weight="900" font-style="italic">P</text>
          <!-- Horizontal lines -->
          <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(201,168,76,0.15)" stroke-width="1"/>
          <line x1="0" y1="200" x2="600" y2="200" stroke="rgba(201,168,76,0.08)" stroke-width="1"/>
          <line x1="0" y1="280" x2="600" y2="280" stroke="rgba(201,168,76,0.08)" stroke-width="1"/>
          <!-- Annotation -->
          <text x="20" y="35" font-family="'Space Mono',monospace" font-size="9" fill="rgba(201,168,76,0.6)" letter-spacing="4">DISPLAY TYPEFACE STUDY</text>
          <line x1="20" y1="42" x2="220" y2="42" stroke="rgba(201,168,76,0.3)" stroke-width="1"/>
          <!-- Small text blocks -->
          <text x="430" y="50" font-family="'Cormorant Garamond',serif" font-size="11" fill="rgba(245,240,232,0.4)" font-style="italic">ascender</text>
          <text x="430" y="125" font-family="'Cormorant Garamond',serif" font-size="11" fill="rgba(245,240,232,0.4)" font-style="italic">cap height</text>
          <text x="430" y="205" font-family="'Cormorant Garamond',serif" font-size="11" fill="rgba(245,240,232,0.4)" font-style="italic">baseline</text>
          <!-- Pointer lines -->
          <line x1="425" y1="48" x2="400" y2="48" stroke="rgba(201,168,76,0.3)" stroke-width="0.8"/>
          <line x1="425" y1="123" x2="400" y2="120" stroke="rgba(201,168,76,0.3)" stroke-width="0.8"/>
          <line x1="425" y1="203" x2="400" y2="200" stroke="rgba(201,168,76,0.3)" stroke-width="0.8"/>
        </svg>
      </div>
      <div class="card-body">
        <div class="card-tag">Typography · Thực Nghiệm · Featured</div>
        <div class="card-title">Giải Phẫu Chữ Việt: Tìm Lại Bản Sắc Typography Bản Địa</div>
        <div class="card-excerpt">Trong kỷ nguyên toàn cầu hóa, tiếng Việt với hệ thống dấu độc đáo của mình đặt ra thách thức lẫn cơ hội cho các nhà thiết kế: làm thế nào để tạo ra những typeface vừa phục vụ độc giả hiện đại, vừa gìn giữ vẻ đẹp của ngôn ngữ dân tộc?</div>
        <div class="card-author">
          <div class="author-avatar">LH</div>
          <div class="author-info">
            <div class="author-name">Lê Thị Hạnh</div>
            <div class="author-role">Năm 4 · Chuyên ngành Typography</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 2 -->
    <div class="article-card">
      <div class="card-image tall">
        <svg viewBox="0 0 280 360" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
          <rect width="280" height="360" fill="#f5f0e8"/>
          <!-- Poster typography layout -->
          <rect x="0" y="0" width="280" height="180" fill="#8b1a1a"/>
          <text x="140" y="100" text-anchor="middle" font-family="'Playfair Display',serif" font-size="64" fill="rgba(245,240,232,0.9)" font-weight="900" font-style="italic">Viet</text>
          <text x="140" y="155" text-anchor="middle" font-family="'Space Mono',monospace" font-size="9" fill="rgba(245,240,232,0.5)" letter-spacing="8">TYPOGRAPHY</text>
          <!-- Bottom section -->
          <text x="24" y="220" font-family="'Playfair Display',serif" font-size="28" fill="#0a0a0a" font-weight="700">Nam</text>
          <text x="24" y="252" font-family="'Playfair Display',serif" font-size="28" fill="#c9a84c" font-weight="700">Phong</text>
          <text x="24" y="284" font-family="'Playfair Display',serif" font-size="28" fill="#0a0a0a" font-weight="700">Chữ Việt</text>
          <line x1="24" y1="300" x2="256" y2="300" stroke="#0a0a0a" stroke-width="1.5"/>
          <text x="24" y="320" font-family="'Space Mono',monospace" font-size="8" fill="#888" letter-spacing="2">POSTER SERIES · 2025</text>
        </svg>
      </div>
      <div class="card-body">
        <div class="card-tag">Poster · Series</div>
        <div class="card-title">Nam Phong: Bộ Poster Typography Về Văn Hóa Việt</div>
        <div class="card-excerpt">Chuỗi poster lấy cảm hứng từ các câu tục ngữ Việt Nam, nơi ngôn từ và hình thức thị giác hòa quyện thành một chỉnh thể thẩm mỹ.</div>
        <div class="card-author">
          <div class="author-avatar" style="background:linear-gradient(135deg,var(--crimson),#3a1a5a)">TV</div>
          <div class="author-info">
            <div class="author-name">Trần Anh Vũ</div>
            <div class="author-role">Năm 3 · Graphic Design</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="page-number">GRAPHICA VII &nbsp;·&nbsp; TYPOGRAPHY &nbsp;·&nbsp; 19</div>
</section>


<!-- ══════════════════════════════
     MINH HỌA & NGHỆ THUẬT SỐ
══════════════════════════════ -->
<section class="page page-body" id="illustration" style="background:var(--white)">
  <div class="section-label">Chuyên Đề 04</div>
  <h2 class="page-heading" style="max-width:600px">Minh Họa &<br><em>Nghệ Thuật Số</em></h2>

  <div class="article-grid">

    <div class="article-card">
      <div class="card-image">
        <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
          <rect width="320" height="200" fill="#0d1b2a"/>
          <!-- Abstract cityscape illustration -->
          <rect x="20" y="100" width="40" height="100" fill="#1a3a5c"/>
          <rect x="35" y="80" width="25" height="120" fill="#1e4a7a"/>
          <rect x="75" y="60" width="35" height="140" fill="#0d2b45"/>
          <rect x="120" y="40" width="50" height="160" fill="#1a3a5c"/>
          <rect x="140" y="20" width="20" height="180" fill="#1e4a7a"/>
          <rect x="185" y="55" width="45" height="145" fill="#0d2b45"/>
          <rect x="240" y="75" width="35" height="125" fill="#1a3a5c"/>
          <rect x="265" y="50" width="30" height="150" fill="#1e4a7a"/>
          <!-- Neon/glow effect - moon -->
          <circle cx="255" cy="45" r="22" fill="rgba(201,168,76,0.15)"/>
          <circle cx="255" cy="45" r="14" fill="rgba(201,168,76,0.3)"/>
          <circle cx="255" cy="45" r="8" fill="#c9a84c"/>
          <!-- Reflection dots (windows) -->
          <rect x="80" y="68" width="4" height="4" fill="rgba(201,168,76,0.6)"/>
          <rect x="90" y="75" width="4" height="4" fill="rgba(201,168,76,0.4)"/>
          <rect x="130" y="50" width="5" height="5" fill="rgba(201,168,76,0.7)"/>
          <rect x="145" y="30" width="4" height="4" fill="rgba(201,168,76,0.9)"/>
          <rect x="145" y="45" width="4" height="4" fill="rgba(201,168,76,0.5)"/>
          <rect x="195" y="65" width="4" height="4" fill="rgba(201,168,76,0.6)"/>
          <!-- Ground reflection -->
          <rect x="0" y="170" width="320" height="30" fill="rgba(14,27,42,0.8)"/>
          <line x1="0" y1="172" x2="320" y2="172" stroke="rgba(201,168,76,0.15)" stroke-width="1"/>
          <text x="16" y="192" font-family="'Space Mono',monospace" font-size="7" fill="rgba(201,168,76,0.4)" letter-spacing="3">NOCTURNE CITY · 2025</text>
        </svg>
      </div>
      <div class="card-body">
        <div class="card-tag">Editorial Illustration</div>
        <div class="card-title">Nocturne City: Đô Thị Đêm Trong Mắt Họa Sĩ</div>
        <div class="card-excerpt">Bộ minh họa editorial khám phá vẻ đẹp cô đơn và huyền bí của thành phố ban đêm qua lăng kính nghệ thuật đương đại.</div>
        <div class="card-author">
          <div class="author-avatar" style="background:linear-gradient(135deg,#1a3a5c,#0d2b45)">NL</div>
          <div class="author-info">
            <div class="author-name">Nguyễn Thu Linh</div>
            <div class="author-role">Năm 4 · Illustration</div>
          </div>
        </div>
      </div>
    </div>

    <div class="article-card">
      <div class="card-image">
        <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
          <rect width="320" height="200" fill="#f0e6d3"/>
          <!-- Abstract botanical illustration -->
          <!-- Stem -->
          <line x1="160" y1="200" x2="160" y2="30" stroke="#5a4a3a" stroke-width="2.5"/>
          <!-- Leaves -->
          <ellipse cx="130" cy="140" rx="40" ry="18" fill="#4a7a5a" transform="rotate(-30 130 140)"/>
          <ellipse cx="192" cy="110" rx="40" ry="18" fill="#3d6b4a" transform="rotate(30 192 110)"/>
          <ellipse cx="125" cy="85" rx="32" ry="14" fill="#5a8a6a" transform="rotate(-25 125 85)"/>
          <ellipse cx="195" cy="160" rx="32" ry="14" fill="#4a7a5a" transform="rotate(35 195 160)"/>
          <!-- Flower -->
          <circle cx="160" cy="30" r="28" fill="#c9a84c" opacity="0.9"/>
          <circle cx="160" cy="30" r="14" fill="#8b5e3c"/>
          <circle cx="160" cy="30" r="6" fill="#c9a84c"/>
          <!-- Petal details -->
          <circle cx="160" cy="5" r="10" fill="#e8c97a" opacity="0.7"/>
          <circle cx="160" cy="55" r="10" fill="#e8c97a" opacity="0.7"/>
          <circle cx="135" cy="30" r="10" fill="#e8c97a" opacity="0.7"/>
          <circle cx="185" cy="30" r="10" fill="#e8c97a" opacity="0.7"/>
          <!-- Small dots -->
          <circle cx="90" cy="170" r="4" fill="#4a7a5a" opacity="0.5"/>
          <circle cx="235" cy="170" r="4" fill="#4a7a5a" opacity="0.5"/>
          <circle cx="75" cy="150" r="3" fill="#c9a84c" opacity="0.4"/>
          <!-- Label -->
          <text x="20" y="192" font-family="'Cormorant Garamond',serif" font-size="11" fill="#5a4a3a" font-style="italic">Botanica Series · Plate III</text>
        </svg>
      </div>
      <div class="card-body">
        <div class="card-tag">Concept Art · Botanica</div>
        <div class="card-title">Herbarium: Bộ Minh Họa Thực Vật Học Nghệ Thuật</div>
        <div class="card-excerpt">Kết hợp phương pháp minh họa truyền thống với kỹ thuật số để tái diễn giải vẻ đẹp của thiên nhiên nhiệt đới Việt Nam.</div>
        <div class="card-author">
          <div class="author-avatar" style="background:linear-gradient(135deg,#4a7a5a,#8b5e3c)">PB</div>
          <div class="author-info">
            <div class="author-name">Phùng Thị Bảo</div>
            <div class="author-role">Năm 3 · Digital Arts</div>
          </div>
        </div>
      </div>
    </div>

    <div class="article-card">
      <div class="card-image">
        <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
          <rect width="320" height="200" fill="#1a0a2e"/>
          <!-- Abstract geometric concept art -->
          <polygon points="160,10 285,80 285,150 160,200 35,150 35,80" fill="none" stroke="rgba(201,168,76,0.3)" stroke-width="1.5"/>
          <polygon points="160,35 260,90 260,140 160,180 60,140 60,90" fill="none" stroke="rgba(201,168,76,0.2)" stroke-width="1"/>
          <!-- Inner glow -->
          <circle cx="160" cy="100" r="55" fill="radial-gradient(circle,rgba(139,26,26,0.5),transparent)"/>
          <circle cx="160" cy="100" r="55" fill="rgba(139,26,26,0.2)"/>
          <circle cx="160" cy="100" r="30" fill="rgba(201,168,76,0.15)"/>
          <circle cx="160" cy="100" r="12" fill="rgba(201,168,76,0.8)"/>
          <!-- Radiating lines -->
          <line x1="160" y1="100" x2="160" y2="10" stroke="rgba(201,168,76,0.2)" stroke-width="1"/>
          <line x1="160" y1="100" x2="285" y2="80" stroke="rgba(201,168,76,0.2)" stroke-width="1"/>
          <line x1="160" y1="100" x2="285" y2="150" stroke="rgba(201,168,76,0.2)" stroke-width="1"/>
          <line x1="160" y1="100" x2="160" y2="200" stroke="rgba(201,168,76,0.2)" stroke-width="1"/>
          <line x1="160" y1="100" x2="35" y2="150" stroke="rgba(201,168,76,0.2)" stroke-width="1"/>
          <line x1="160" y1="100" x2="35" y2="80" stroke="rgba(201,168,76,0.2)" stroke-width="1"/>
          <!-- Text -->
          <text x="160" y="195" text-anchor="middle" font-family="'Space Mono',monospace" font-size="7" fill="rgba(201,168,76,0.4)" letter-spacing="4">COSMOS · VI</text>
        </svg>
      </div>
      <div class="card-body">
        <div class="card-tag">Concept Art · Sci-fi</div>
        <div class="card-title">Cosmos VI: Khoa Học Viễn Tưởng Gặp Nghệ Thuật Việt</div>
        <div class="card-excerpt">Dự án concept art táo bạo kết hợp yếu tố văn hóa dân gian Việt Nam với thẩm mỹ khoa học viễn tưởng hiện đại.</div>
        <div class="card-author">
          <div class="author-avatar" style="background:linear-gradient(135deg,#1a0a2e,#8b1a1a)">HK</div>
          <div class="author-info">
            <div class="author-name">Hoàng Minh Khôi</div>
            <div class="author-role">Năm 4 · Digital Illustration</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="page-number">GRAPHICA VII &nbsp;·&nbsp; MINH HỌA &nbsp;·&nbsp; 27</div>
</section>


<!-- ══════════════════════════════
     BÀI VIẾT SÂU: BỐ CỤC FULL BLEED
══════════════════════════════ -->
<section class="page page-spread" id="packaging">
  <div class="spread-left" style="background:var(--cream)">
    <div class="section-label">Chuyên Đề 05</div>
    <h2 style="font-family: '${payload.headingFont}', serif;font-size:clamp(28px,3.5vw,48px);font-weight:900;color:var(--ink);line-height:1.1;margin-bottom:24px">
      Thiết Kế Bao Bì<br><em style="color:var(--gold)">&amp; Ấn Phẩm</em>
    </h2>
    <div class="body-text">
      <p>Thiết kế bao bì là nghệ thuật ở điểm giao thoa giữa thẩm mỹ và chức năng. Mỗi sản phẩm đặt ra cho nhà thiết kế một câu hỏi căn bản: làm thế nào để lớp vỏ bên ngoài kể được câu chuyện của linh hồn bên trong?</p>
      <p>Các sinh viên trong chuyên đề này đã làm việc với các thương hiệu địa phương thực tế, từ trà Việt, mỹ phẩm handmade đến thực phẩm truyền thống — biến mỗi sản phẩm thành một tác phẩm cầm tay.</p>
    </div>
    <div class="highlight-box" style="border-color:rgba(201,168,76,0.4)">
      <p style="font-family: '${payload.bodyFont}', serif;font-size:16px;color:var(--slate);line-height:1.7;font-style:italic">"Bao bì không chỉ bảo vệ sản phẩm — nó là lời hứa của thương hiệu với người tiêu dùng, được hiện thân qua từng đường nét, màu sắc và chất liệu."</p>
    </div>
    <!-- Packaging illustrations -->
    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" fill="none" style="width:100%;margin-top:24px">
      <!-- Tea box -->
      <rect x="20" y="20" width="80" height="160" fill="#2d4a3e" rx="3"/>
      <rect x="25" y="25" width="70" height="150" fill="none" stroke="rgba(201,168,76,0.4)" stroke-width="1" rx="2"/>
      <circle cx="60" cy="90" r="22" fill="rgba(201,168,76,0.2)" stroke="#c9a84c" stroke-width="1"/>
      <text x="60" y="95" text-anchor="middle" font-family="'Playfair Display',serif" font-size="10" fill="#c9a84c" font-weight="700">TRÀ</text>
      <text x="60" y="135" text-anchor="middle" font-family="'Space Mono',monospace" font-size="7" fill="rgba(201,168,76,0.6)" letter-spacing="2">HIGHLAND</text>
      <text x="60" y="148" text-anchor="middle" font-family="'Space Mono',monospace" font-size="6" fill="rgba(201,168,76,0.4)" letter-spacing="1">OOLONG · 100g</text>

      <!-- Bottle -->
      <path d="M 155,50 Q 155,20 175,20 Q 195,20 195,50 L 200,160 Q 200,180 175,180 Q 150,180 150,160 Z" fill="#1a1a2e"/>
      <path d="M 163,48 Q 163,28 175,28 Q 187,28 187,48 L 191,158 Q 191,172 175,172 Q 159,172 159,158 Z" fill="rgba(201,168,76,0.12)" stroke="rgba(201,168,76,0.3)" stroke-width="0.8"/>
      <rect x="163" y="70" width="24" height="60" fill="rgba(245,240,232,0.08)" rx="1"/>
      <text x="175" y="100" text-anchor="middle" font-family="'Cormorant Garamond',serif" font-size="7" fill="rgba(245,240,232,0.6)" font-style="italic">Sérum</text>
      <text x="175" y="112" text-anchor="middle" font-family="'Playfair Display',serif" font-size="9" fill="#c9a84c" font-weight="700">LUNA</text>

      <!-- Box 2 -->
      <rect x="220" y="30" width="60" height="90" fill="#8b1a1a" rx="2"/>
      <rect x="224" y="34" width="52" height="82" fill="none" stroke="rgba(245,240,232,0.2)" stroke-width="1" rx="1"/>
      <text x="250" y="70" text-anchor="middle" font-family="'Playfair Display',serif" font-size="9" fill="rgba(245,240,232,0.9)" font-weight="700">BÁNH</text>
      <text x="250" y="84" text-anchor="middle" font-family="'Playfair Display',serif" font-size="9" fill="rgba(245,240,232,0.9)" font-weight="700">TRUNG</text>
      <text x="250" y="98" text-anchor="middle" font-family="'Playfair Display',serif" font-size="9" fill="#c9a84c" font-weight="700">THU</text>
      <rect x="220" y="130" width="60" height="50" fill="#5a0000" rx="2"/>
      <text x="250" y="160" text-anchor="middle" font-family="'Space Mono',monospace" font-size="6" fill="rgba(245,240,232,0.4)" letter-spacing="1">PREMIUM</text>
    </svg>
  </div>

  <div class="spread-right" style="background:var(--ink)">
    <div style="position:relative;z-index:1;">
      <div class="section-label" style="color:var(--gold)">Dự án nổi bật</div>

      <div style="display:flex;flex-direction:column;gap:28px;margin-top:24px;">
        <div style="border:1px solid rgba(201,168,76,0.2);padding:24px;background:rgba(201,168,76,0.04)">
          <div style="font-family: '${payload.monoFont}', monospace;font-size:9px;color:var(--gold);letter-spacing:4px;margin-bottom:12px">PACKAGING · GOLD AWARD</div>
          <div style="font-family: '${payload.headingFont}', serif;font-size:20px;font-weight:700;color:var(--white);margin-bottom:10px">Hương Vị Quê Nhà — Bộ Quà Tặng Ẩm Thực Việt</div>
          <div style="font-family: '${payload.bodyFont}', serif;font-size:15px;line-height:1.7;color:rgba(245,240,232,0.65);font-style:italic">Bộ 5 sản phẩm gia vị và đặc sản miền Nam được đóng gói trong hộp gỗ khắc tay, kết hợp họa tiết dân gian với thiết kế tối giản hiện đại. Nhận giải Gold tại cuộc thi Packaging Vietnam 2025.</div>
          <div style="margin-top:16px;font-family: '${payload.monoFont}', monospace;font-size:10px;color:rgba(201,168,76,0.6);letter-spacing:2px">Tác giả: Đinh Quốc Bảo · Năm 4</div>
        </div>

        <div style="border:1px solid rgba(201,168,76,0.2);padding:24px;background:rgba(201,168,76,0.04)">
          <div style="font-family: '${payload.monoFont}', monospace;font-size:9px;color:var(--gold);letter-spacing:4px;margin-bottom:12px">PRINT DESIGN · POSTER SERIES</div>
          <div style="font-family: '${payload.headingFont}', serif;font-size:20px;font-weight:700;color:var(--white);margin-bottom:10px">Ký Ức Hà Nội — 36 Phố Phường Qua Ký Họa</div>
          <div style="font-family: '${payload.bodyFont}', serif;font-size:15px;line-height:1.7;color:rgba(245,240,232,0.65);font-style:italic">Chuỗi 12 poster ký họa kiến trúc phố cổ Hà Nội bằng kỹ thuật khắc gỗ số hóa, mang vẻ đẹp hoài cổ vào ngôn ngữ thiết kế đương đại.</div>
          <div style="margin-top:16px;font-family: '${payload.monoFont}', monospace;font-size:10px;color:rgba(201,168,76,0.6);letter-spacing:2px">Tác giả: Vũ Thu Trang · Năm 3</div>
        </div>

        <div style="border:1px solid rgba(201,168,76,0.2);padding:24px;background:rgba(201,168,76,0.04)">
          <div style="font-family: '${payload.monoFont}', monospace;font-size:9px;color:var(--gold);letter-spacing:4px;margin-bottom:12px">BROCHURE · EDITORIAL</div>
          <div style="font-family: '${payload.headingFont}', serif;font-size:20px;font-weight:700;color:var(--white);margin-bottom:10px">Thiên Nhiên Gọi — Tờ Gấp Du Lịch Sinh Thái</div>
          <div style="font-family: '${payload.bodyFont}', serif;font-size:15px;line-height:1.7;color:rgba(245,240,232,0.65);font-style:italic">Tờ gấp 6 mặt cho khu bảo tồn sinh thái Cần Giờ, sử dụng giấy tái chế và mực thực vật — thông điệp bền vững thể hiện ngay từ chất liệu sản xuất.</div>
          <div style="margin-top:16px;font-family: '${payload.monoFont}', monospace;font-size:10px;color:rgba(201,168,76,0.6);letter-spacing:2px">Tác giả: Lâm Thị Cẩm Nhung · Năm 4</div>
        </div>
      </div>
    </div>
    <div class="page-number" style="color:rgba(201,168,76,0.5)">GRAPHICA VII &nbsp;·&nbsp; BAO BÌ & ẤN PHẨM &nbsp;·&nbsp; 39</div>
  </div>
</section>


<!-- ══════════════════════════════
     LỜI KẾT & CẢM ƠN
══════════════════════════════ -->
<section class="page-closing" id="closing">
  <div style="position:relative;z-index:2;width:100%;max-width:740px;text-align:center">

    <!-- Ornament -->
    <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" style="width:120px;margin:0 auto 40px;display:block">
      <line x1="0" y1="20" x2="48" y2="20" stroke="rgba(201,168,76,0.5)" stroke-width="1"/>
      <diamond x="52" y="14" width="16" height="12"/>
      <polygon points="60,12 68,20 60,28 52,20" fill="none" stroke="#c9a84c" stroke-width="1.5"/>
      <circle cx="60" cy="20" r="4" fill="#c9a84c"/>
      <line x1="72" y1="20" x2="120" y2="20" stroke="rgba(201,168,76,0.5)" stroke-width="1"/>
    </svg>

    <div class="section-label" style="color:var(--gold);justify-content:center;margin-bottom:24px">
      <span>Lời Kết</span>
    </div>

    <h2 class="closing-title">
      Sáng Tạo<br>Không Có<br><em>Điểm Dừng</em>
    </h2>

    <p class="closing-body">
      Tập san GRAPHICA VII khép lại nhưng hành trình của những người trẻ đam mê thiết kế thì vẫn tiếp diễn — qua từng trang giấy, từng màn hình, từng không gian triển lãm. Chúng tôi tin rằng thiết kế tốt có thể thay đổi cách con người nhìn nhận thế giới và cảm nhận nhau.
    </p>

    <div class="divider" style="margin:40px 0">
      <span class="divider-ornament" style="color:var(--gold)">◆</span>
    </div>

    <h3 style="font-family: '${payload.headingFont}', serif;font-size:22px;color:var(--white);margin-bottom:24px;font-weight:400;font-style:italic">Lời Cảm Ơn Chân Thành</h3>

    <ul class="thanks-list">
      <li>GV. Phạm Thế Anh</li>
      <li>GV. Nguyễn Quỳnh Như</li>
      <li>GV. Lê Hoàng Bảo</li>
      <li>ThS. Trần Văn Minh</li>
      <li>Ban Chủ Nhiệm Khoa</li>
      <li>Hội Đồng Giám Khảo</li>
      <li>Gia Đình & Bạn Bè</li>
      <li>Các Đối Tác Thực Hành</li>
    </ul>

    <div class="school-info">
      <div class="school-name">Khoa Mỹ Thuật Ứng Dụng</div>
      <div class="school-detail" style="margin-top:6px">Trường Đại Học Mỹ Thuật TP. Hồ Chí Minh</div>
      <div class="school-detail" style="margin-top:4px;opacity:0.5">Năm học 2024 – 2025 &nbsp;·&nbsp; Xuất bản tháng 05/2025</div>

      <!-- Final ornament -->
      <svg viewBox="0 0 200 30" xmlns="http://www.w3.org/2000/svg" style="width:200px;margin:32px auto 0;display:block">
        <line x1="0" y1="15" x2="80" y2="15" stroke="rgba(201,168,76,0.3)" stroke-width="1"/>
        <circle cx="100" cy="15" r="6" fill="none" stroke="rgba(201,168,76,0.5)" stroke-width="1"/>
        <circle cx="100" cy="15" r="2" fill="rgba(201,168,76,0.5)"/>
        <line x1="120" y1="15" x2="200" y2="15" stroke="rgba(201,168,76,0.3)" stroke-width="1"/>
      </svg>
    </div>
  </div>
</section>

</body>
</html>
    ${artworks.map((a, i) => `
    <section class="page-spread" id="art-${i}">
      <div class="spread-left">
        <div class="section-label text-light" style="color:var(--gold)">Ấn Phẩm Nổi Bật 0${i+1}</div>
        <h2 style="font-family:'${payload.headingFont}',serif;font-size:clamp(32px,4vw,56px);font-weight:900;color:var(--white);line-height:1.1;margin-bottom:28px;">
          ${a.title}
        </h2>

        <div class="body-text" style="color:rgba(245,240,232,0.72)">
          <p>${a.category}</p>
        </div>
        
        <div style="margin-top:36px; border:1px solid var(--mist);padding:24px;background:var(--cream)">
           <div style="font-family:'${payload.headingFont}',serif;font-size:18px;font-weight:700;color:var(--ink)">${a.title}</div>
           <div style="font-family:'${payload.bodyFont}',serif;font-size:14px;color:#777;font-style:italic">Tác giả: ${a.student}</div>
           <p style="font-family:'${payload.bodyFont}',serif;font-size:15px;line-height:1.7;color:#555;margin-top:16px;">${a.note || ''}</p>
        </div>
      </div>

      <div class="spread-right" style="display:flex; align-items:center; justify-content:center;">
        ${a.coverImageUrl ? `<img src="${a.coverImageUrl}" style="max-width:100%; max-height:80vh; object-fit:contain; box-shadow: 0 20px 40px rgba(0,0,0,0.2);" />` : `<div style="width:100%;height:60vh;background:var(--mist);display:flex;align-items:center;justify-content:center;color:#999;">No Image</div>`}
      </div>
    </section>
    `).join('')}
    
`;
}
