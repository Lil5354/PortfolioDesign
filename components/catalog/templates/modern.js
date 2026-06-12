export function renderModern(payload, artworks) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GRID — Tập San Ấn Phẩm Thiết Kế Đồ Họa 2025 · Modern</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,700;0,900;1,700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --black: ${payload.backgroundColor};
    --white: ${payload.textColor};
    --accent: ${payload.primaryColor};
    --accent2: ${payload.secondaryColor};
    --yellow:  #ffe600;
    --gray1:   #1c1c1c;
    --gray2:   #2e2e2e;
    --gray3:   #6b6b6b;
    --gray4:   #b0b0b0;
    --grid-gap: 3px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: '${payload.bodyFont}', sans-serif;
    overflow-x: hidden;
  }

  /* =================== COVER =================== */
  .cover {
    width: 100%;
    min-height: 100vh;
    background: var(--black);
    display: grid;
    grid-template-rows: auto 1fr auto;
    position: relative;
    overflow: hidden;
    page-break-after: always;
  }

  /* Full-bleed scan lines texture */
  .cover::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255,255,255,0.01) 2px,
      rgba(255,255,255,0.01) 4px
    );
    pointer-events: none;
    z-index: 0;
  }

  .cover-topbar {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28px 40px;
    border-bottom: var(--grid-gap) solid var(--gray2);
  }

  .cover-topbar-left {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .tag {
    font-family: '${payload.monoFont}', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    color: var(--gray3);
    text-transform: uppercase;
    border: 1px solid var(--gray2);
    padding: 4px 10px;
  }

  .cover-logo {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 5px;
    color: var(--white);
    text-transform: uppercase;
  }

  .cover-hero {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 100%;
  }

  .cover-hero-left {
    background: var(--black);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 60px 50px 70px;
    border-right: var(--grid-gap) solid var(--gray2);
    position: relative;
    overflow: hidden;
  }

  /* Large background number */
  .cover-bg-num {
    position: absolute;
    font-family: '${payload.headingFont}', sans-serif;
    font-size: 40vw;
    font-weight: 900;
    color: rgba(255,255,255,0.02);
    top: 50%;
    left: -10%;
    transform: translateY(-50%);
    line-height: 1;
    user-select: none;
    z-index: 0;
  }

  .cover-eyebrow {
    font-family: '${payload.monoFont}', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--accent);
    text-transform: uppercase;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
    opacity: 0;
    animation: slideRight 0.8s ease 0.3s forwards;
  }

  .cover-main-title {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: clamp(90px, 14vw, 200px);
    font-weight: 900;
    line-height: 0.85;
    text-transform: uppercase;
    color: var(--white);
    position: relative;
    z-index: 1;
    opacity: 0;
    animation: slideRight 0.9s ease 0.5s forwards;
  }

  .cover-main-title .accent-word {
    color: var(--accent);
    font-style: italic;
    display: block;
  }

  .cover-sub-info {
    margin-top: 40px;
    position: relative;
    z-index: 1;
    display: flex;
    gap: 32px;
    opacity: 0;
    animation: slideRight 0.8s ease 0.8s forwards;
  }

  .cover-sub-info-item label {
    display: block;
    font-family: '${payload.monoFont}', monospace;
    font-size: 8px;
    color: var(--gray3);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .cover-sub-info-item span {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--white);
    letter-spacing: 1px;
  }

  .cover-hero-right {
    position: relative;
    background: var(--gray1);
    overflow: hidden;
    opacity: 0;
    animation: fadeIn 1.2s ease 0.6s forwards;
  }

  /* Geometric grid artwork */
  .cover-art {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cover-bottom {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    border-top: var(--grid-gap) solid var(--gray2);
  }

  .cover-stat {
    padding: 20px 32px;
    border-right: var(--grid-gap) solid var(--gray2);
  }
  .cover-stat:last-child { border-right: none; }
  .cover-stat label {
    font-family: '${payload.monoFont}', monospace;
    font-size: 8px;
    letter-spacing: 2px;
    color: var(--gray3);
    text-transform: uppercase;
    display: block;
    margin-bottom: 6px;
  }
  .cover-stat strong {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: 28px;
    font-weight: 900;
    color: var(--white);
  }

  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

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

  /* Page header bar */
  .page-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 40px;
    border-bottom: var(--grid-gap) solid var(--gray2);
    background: var(--black);
  }
  .page-bar-title {
    font-family: '${payload.monoFont}', monospace;
    font-size: 9px;
    letter-spacing: 3px;
    color: var(--gray3);
    text-transform: uppercase;
  }
  .page-bar-num {
    font-family: '${payload.monoFont}', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    color: var(--accent);
  }

  /* =================== FOREWORD =================== */
  .page-foreword {
    background: var(--black);
    display: grid;
    grid-template-rows: auto 1fr;
  }

  .foreword-body {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }

  .foreword-left {
    padding: 60px 40px;
    border-right: var(--grid-gap) solid var(--gray2);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .foreword-chapter {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: clamp(80px, 14vw, 180px);
    font-weight: 900;
    line-height: 0.8;
    color: rgba(255,255,255,0.04);
    text-align: left;
    margin-bottom: 32px;
  }

  .foreword-chapter-label {
    font-family: '${payload.monoFont}', monospace;
    font-size: 9px;
    letter-spacing: 3px;
    color: var(--accent);
    text-transform: uppercase;
    border-left: 3px solid var(--accent);
    padding-left: 12px;
    margin-bottom: 20px;
  }

  .foreword-chapter-title {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: clamp(28px, 3.5vw, 48px);
    font-weight: 700;
    text-transform: uppercase;
    line-height: 1;
    color: var(--white);
  }

  .foreword-right {
    padding: 60px 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .foreword-quote {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: clamp(26px, 3vw, 44px);
    font-weight: 700;
    font-style: italic;
    line-height: 1.15;
    color: var(--white);
    text-transform: uppercase;
    margin-bottom: 32px;
    border-top: var(--grid-gap) solid var(--accent);
    padding-top: 28px;
  }

  .foreword-quote mark {
    background: var(--accent);
    color: var(--black);
    padding: 0 6px;
  }

  .foreword-text {
    font-size: 15px;
    font-weight: 300;
    line-height: 1.8;
    color: var(--gray4);
    max-width: 520px;
    margin-bottom: 20px;
  }

  .mono-line {
    font-family: '${payload.monoFont}', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--gray3);
    margin-top: 16px;
  }

  /* =================== TABLE OF CONTENTS =================== */
  .page-toc {
    background: var(--black);
    display: grid;
    grid-template-rows: auto 1fr;
  }

  .toc-body {
    display: grid;
    grid-template-columns: 1fr 3fr;
  }

  .toc-sidebar {
    padding: 40px;
    border-right: var(--grid-gap) solid var(--gray2);
    background: var(--gray1);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .toc-sidebar-title {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: clamp(40px, 6vw, 80px);
    font-weight: 900;
    text-transform: uppercase;
    line-height: 0.85;
    color: var(--white);
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
  }

  .toc-main {
    padding: 40px 50px;
  }

  .toc-section-label {
    font-family: '${payload.monoFont}', monospace;
    font-size: 9px;
    letter-spacing: 3px;
    color: var(--accent2);
    text-transform: uppercase;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .toc-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gray2);
  }

  .toc-item {
    display: grid;
    grid-template-columns: 60px 1fr auto;
    align-items: center;
    gap: 0;
    border-bottom: 1px solid var(--gray2);
    padding: 0;
    overflow: hidden;
    transition: background 0.2s;
    cursor: default;
  }
  .toc-item:hover { background: var(--gray2); }

  .toc-item-num {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: 42px;
    font-weight: 900;
    color: rgba(255,255,255,0.08);
    padding: 16px 16px 16px 0;
    line-height: 1;
  }
  .toc-item:hover .toc-item-num { color: var(--accent); }

  .toc-item-info {
    padding: 16px 20px;
    border-left: var(--grid-gap) solid var(--gray2);
  }
  .toc-item-info h4 {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: 20px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--white);
    letter-spacing: 1px;
    margin-bottom: 3px;
  }
  .toc-item-info p {
    font-family: '${payload.monoFont}', monospace;
    font-size: 8px;
    color: var(--gray3);
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .toc-item-pg {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: 28px;
    font-weight: 300;
    color: var(--gray3);
    padding: 16px 24px;
    text-align: right;
  }

  .toc-item.featured .toc-item-num { color: var(--accent); }
  .toc-item.featured .toc-item-info h4 { color: var(--accent); }

  /* =================== BODY / WORKS =================== */
  .page-works {
    background: var(--black);
  }

  .works-full-bleed {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: var(--grid-gap);
    background: var(--gray2);
    margin-top: var(--grid-gap);
  }

  .work-block {
    background: var(--black);
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: transform 0.3s;
  }
  .work-block:hover { z-index: 2; }

  .work-block-art {
    width: 100%;
    display: block;
  }

  .work-block-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: linear-gradient(to top, rgba(8,8,8,0.95) 0%, transparent 100%);
    padding: 32px 28px 24px;
    transform: translateY(8px);
    transition: transform 0.3s;
  }
  .work-block:hover .work-block-overlay { transform: translateY(0); }

  .work-tag {
    font-family: '${payload.monoFont}', monospace;
    font-size: 8px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 8px;
  }

  .work-title {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--white);
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  .work-author {
    font-family: '${payload.monoFont}', monospace;
    font-size: 9px;
    color: var(--gray4);
    letter-spacing: 1px;
  }

  /* Large featured block spanning 2 cols */
  .work-block-wide {
    grid-column: 1 / -1;
  }
  .work-block-wide .work-block-art {
    height: 380px;
    object-fit: cover;
  }

  /* Three-col row */
  .works-three {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--grid-gap);
    background: var(--gray2);
    margin-top: var(--grid-gap);
  }

  /* =================== CLOSING =================== */
  .page-closing {
    background: var(--black);
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .closing-left {
    background: var(--accent);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 60px 50px;
    position: relative;
    overflow: hidden;
  }

  .closing-bg-text {
    position: absolute;
    top: 0; left: -20px;
    font-family: '${payload.headingFont}', sans-serif;
    font-size: 30vw;
    font-weight: 900;
    color: rgba(0,0,0,0.08);
    line-height: 0.85;
    user-select: none;
  }

  .closing-left-content {
    position: relative;
    z-index: 1;
  }

  .closing-label {
    font-family: '${payload.monoFont}', monospace;
    font-size: 9px;
    letter-spacing: 3px;
    color: rgba(8,8,8,0.6);
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .closing-title {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: clamp(60px, 9vw, 120px);
    font-weight: 900;
    text-transform: uppercase;
    line-height: 0.85;
    color: var(--black);
  }

  .closing-right {
    padding: 60px 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .credits-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--gray2);
    margin-top: 32px;
    flex: 1;
  }
  .credit-cell {
    background: var(--black);
    padding: 28px 24px;
  }
  .credit-cell label {
    font-family: '${payload.monoFont}', monospace;
    font-size: 8px;
    letter-spacing: 3px;
    color: var(--accent2);
    text-transform: uppercase;
    display: block;
    margin-bottom: 10px;
  }
  .credit-cell ul {
    list-style: none;
  }
  .credit-cell ul li {
    font-family: '${payload.headingFont}', sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: var(--white);
    line-height: 1.7;
    letter-spacing: 0.5px;
  }

  .closing-footer {
    padding-top: 32px;
    border-top: var(--grid-gap) solid var(--gray2);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .closing-footer p {
    font-family: '${payload.monoFont}', monospace;
    font-size: 9px;
    color: var(--gray3);
    letter-spacing: 2px;
    text-transform: uppercase;
  }
</style>
</head>
<body>

<!-- =================== COVER =================== -->
<section class="cover">
  <div class="cover-topbar">
    <div class="cover-topbar-left">
      <span class="cover-logo">GRID / 01</span>
      <span class="tag">Tập San Thiết Kế</span>
      <span class="tag">2024–2025</span>
    </div>
    <span class="tag">Khoa Thiết Kế Đồ Họa</span>
  </div>

  <div class="cover-hero">
    <div class="cover-hero-left">
      <div class="cover-bg-num">G</div>
      <p class="cover-eyebrow">// Vol. 01 — Annual Exhibition</p>
      <h1 class="cover-main-title">
        ĐỒ
        <span class="accent-word">HỌA</span>
        MỚI
      </h1>
      <div class="cover-sub-info">
        <div class="cover-sub-info-item">
          <label>Chủ đề</label>
          <span>Boundaries</span>
        </div>
        <div class="cover-sub-info-item">
          <label>Năm</label>
          <span>2025</span>
        </div>
        <div class="cover-sub-info-item">
          <label>Số lượng</label>
          <span>500 bản</span>
        </div>
      </div>
    </div>

    <div class="cover-hero-right">
      <div class="cover-art">
        <svg viewBox="0 0 700 700" style="width:100%;height:100%;position:absolute;inset:0;" preserveAspectRatio="xMidYMid slice">
          <!-- Full-bleed geometric composition -->
          <rect width="700" height="700" fill="#1c1c1c"/>
          <!-- Grid lines -->
          <line x1="0" y1="175" x2="700" y2="175" stroke="#2e2e2e" stroke-width="1"/>
          <line x1="0" y1="350" x2="700" y2="350" stroke="#2e2e2e" stroke-width="1"/>
          <line x1="0" y1="525" x2="700" y2="525" stroke="#2e2e2e" stroke-width="1"/>
          <line x1="175" y1="0" x2="175" y2="700" stroke="#2e2e2e" stroke-width="1"/>
          <line x1="350" y1="0" x2="350" y2="700" stroke="#2e2e2e" stroke-width="1"/>
          <line x1="525" y1="0" x2="525" y2="700" stroke="#2e2e2e" stroke-width="1"/>

          <!-- Color blocks - full bleed style -->
          <rect x="350" y="0" width="175" height="175" fill="#ff3c00" opacity="0.9"/>
          <rect x="175" y="175" width="175" height="175" fill="#ffe600" opacity="0.85"/>
          <rect x="525" y="350" width="175" height="175" fill="#00c2a8" opacity="0.85"/>
          <rect x="0" y="525" width="175" height="175" fill="#ff3c00" opacity="0.6"/>

          <!-- Large circle -->
          <circle cx="350" cy="350" r="210" fill="none" stroke="#f2f2f0" stroke-width="2" opacity="0.08"/>
          <circle cx="350" cy="350" r="140" fill="none" stroke="#f2f2f0" stroke-width="1" opacity="0.06"/>
          <circle cx="350" cy="350" r="70" fill="none" stroke="#f2f2f0" stroke-width="1" opacity="0.08"/>

          <!-- Typography as graphic element -->
          <text x="350" y="390" text-anchor="middle" font-family="'Barlow Condensed', sans-serif" font-size="110" font-weight="900" fill="none" stroke="#f2f2f0" stroke-width="1" opacity="0.12">GR</text>

          <!-- Diagonal accent -->
          <line x1="0" y1="700" x2="700" y2="0" stroke="#ff3c00" stroke-width="1" opacity="0.15"/>
          <line x1="0" y1="650" x2="650" y2="0" stroke="#ff3c00" stroke-width="0.5" opacity="0.08"/>

          <!-- Dot grid accent -->
          <g opacity="0.2" fill="#f2f2f0">
            <circle cx="88" cy="88" r="2"/>
            <circle cx="88" cy="263" r="2"/>
            <circle cx="263" cy="88" r="2"/>
            <circle cx="612" cy="612" r="2"/>
            <circle cx="612" cy="437" r="2"/>
            <circle cx="437" cy="612" r="2"/>
          </g>

          <!-- Corner label -->
          <text x="540" y="40" font-family="'IBM Plex Mono', monospace" font-size="9" fill="#6b6b6b" letter-spacing="2">GRID 2025</text>
        </svg>
      </div>
    </div>
  </div>

  <div class="cover-bottom">
    <div class="cover-stat">
      <label>Sinh Viên</label>
      <strong>86</strong>
    </div>
    <div class="cover-stat">
      <label>Tác Phẩm</label>
      <strong>124</strong>
    </div>
    <div class="cover-stat">
      <label>Giải Thưởng</label>
      <strong>12</strong>
    </div>
    <div class="cover-stat">
      <label>Chủ Đề</label>
      <strong>Boundaries</strong>
    </div>
  </div>
</section>

<!-- =================== LỜI MỞ ĐẦU =================== -->
<section class="page page-foreword">
  <div class="page-bar">
    <span class="page-bar-title">GRID / Tập San Ấn Phẩm Thiết Kế Đồ Họa — 2025</span>
    <span class="page-bar-num">// 02</span>
  </div>

  <div class="foreword-body">
    <div class="foreword-left">
      <div>
        <div class="foreword-chapter-label">Chương 01</div>
        <h2 class="foreword-chapter-title">Lời<br>Mở<br>Đầu</h2>
      </div>

      <!-- Author block -->
      <div style="margin-top: 40px;">
        <svg viewBox="0 0 200 200" width="100%" style="max-width:200px; display:block;">
          <rect width="200" height="200" fill="#1c1c1c"/>
          <circle cx="100" cy="80" r="40" fill="#2e2e2e"/>
          <rect cx="100" cy="80" x="60" y="116" width="80" height="60" fill="#2e2e2e" rx="0"/>
          <line x1="0" y1="185" x2="200" y2="185" stroke="#ff3c00" stroke-width="2"/>
          <text x="100" y="198" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="8" fill="#6b6b6b" letter-spacing="2">GVC. PHÚC THỊNH</text>
        </svg>
        <p class="mono-line" style="margin-top: 10px;">// Trưởng Khoa Thiết Kế</p>
      </div>
    </div>

    <div class="foreword-right">
      <blockquote class="foreword-quote">
        "Ranh giới tồn tại để <mark>bị phá vỡ</mark> — và mỗi thiết kế xuất sắc là một lần vượt qua chính mình."
      </blockquote>

      <p class="foreword-text">GRID 2025 mang chủ đề <strong style="color:var(--white)">"BOUNDARIES"</strong> — một tuyên ngôn về sự dũng cảm phá vỡ khuôn khổ. Các sinh viên năm nay không chỉ thành thạo kỹ thuật mà còn dám đặt câu hỏi về định nghĩa của thiết kế đồ họa trong kỷ nguyên số.</p>

      <p class="foreword-text">Từ hệ thống nhận diện thương hiệu cho đến motion design, từ bao bì sản phẩm đến installation art — mỗi tác phẩm trong tập san này đại diện cho một góc nhìn riêng biệt, táo bạo và có chiều sâu.</p>

      <p class="foreword-text">Chào mừng bạn đến với GRID — nơi hệ thống gặp gỡ sự hỗn loạn có chủ đích.</p>

      <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid var(--accent);">
        <p class="mono-line">// Tập San Ấn Phẩm Thiết Kế Đồ Họa</p>
        <p class="mono-line">// Khoa Thiết Kế Đồ Họa · 2024–2025</p>
      </div>
    </div>
  </div>
</section>

<!-- =================== MỤC LỤC =================== -->
<section class="page page-toc">
  <div class="page-bar">
    <span class="page-bar-title">GRID / Nội Dung</span>
    <span class="page-bar-num">// 03</span>
  </div>

  <div class="toc-body">
    <div class="toc-sidebar">
      <p class="mono-line" style="margin-bottom: 32px; color: var(--accent);">// Contents</p>
      <div class="toc-sidebar-title">MỤC<br>LỤC</div>
    </div>

    <div class="toc-main">
      <p class="toc-section-label">Nội dung tập san · 2025</p>

      <div class="toc-item featured">
        <div class="toc-item-num">01</div>
        <div class="toc-item-info">
          <h4>Lời Mở Đầu</h4>
          <p>Tiếng nói của ban biên tập</p>
        </div>
        <div class="toc-item-pg">02</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-num">02</div>
        <div class="toc-item-info">
          <h4>Nhận Diện Thương Hiệu</h4>
          <p>Brand Identity · Corporate Design</p>
        </div>
        <div class="toc-item-pg">06</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-num">03</div>
        <div class="toc-item-info">
          <h4>Ấn Phẩm & Xuất Bản</h4>
          <p>Print Design · Editorial</p>
        </div>
        <div class="toc-item-pg">14</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-num">04</div>
        <div class="toc-item-info">
          <h4>Motion & Interactive</h4>
          <p>Digital Design · Animation</p>
        </div>
        <div class="toc-item-pg">22</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-num">05</div>
        <div class="toc-item-info">
          <h4>Minh Họa & Typography</h4>
          <p>Illustration · Type Design</p>
        </div>
        <div class="toc-item-pg">30</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-num">06</div>
        <div class="toc-item-info">
          <h4>Bao Bì Sản Phẩm</h4>
          <p>Packaging Design</p>
        </div>
        <div class="toc-item-pg">38</div>
      </div>
      <div class="toc-item featured">
        <div class="toc-item-num">07</div>
        <div class="toc-item-info">
          <h4>Dự Án Tốt Nghiệp</h4>
          <p>Graduation Projects · Showcase</p>
        </div>
        <div class="toc-item-pg">46</div>
      </div>
      <div class="toc-item">
        <div class="toc-item-num">08</div>
        <div class="toc-item-info">
          <h4>Lời Cảm Ơn & Colophon</h4>
          <p>Credits · Acknowledgements</p>
        </div>
        <div class="toc-item-pg">56</div>
      </div>
    </div>
  </div>
</section>

<!-- =================== WORKS – FULL BLEED GRID =================== -->
<section class="page page-works">
  <div class="page-bar">
    <span class="page-bar-title">GRID / Ấn Phẩm Nổi Bật — Brand Identity</span>
    <span class="page-bar-num">// 06</span>
  </div>

  <!-- Large featured + side stack -->
  <div class="works-full-bleed">
    <!-- Wide feature -->
    <div class="work-block work-block-wide" style="grid-column: 1 / -1; position: relative;">
      <svg viewBox="0 0 1200 400" style="width:100%;height:380px;display:block;" preserveAspectRatio="xMidYMid slice">
        <rect width="1200" height="400" fill="#1c1c1c"/>
        <!-- Brand system mock - wide cinematic -->
        <rect x="0" y="0" width="400" height="400" fill="#ff3c00"/>
        <text x="200" y="180" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="80" font-weight="900" fill="#080808">VNS</text>
        <text x="200" y="225" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="11" fill="#080808" letter-spacing="6">STUDIOS</text>
        <line x1="80" y1="250" x2="320" y2="250" stroke="#080808" stroke-width="1" opacity="0.5"/>
        <text x="200" y="270" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="8" fill="#080808" letter-spacing="3" opacity="0.7">CREATIVE PRODUCTION HOUSE</text>
        <!-- Color system -->
        <rect x="430" y="40" width="100" height="60" fill="#ff3c00"/>
        <rect x="540" y="40" width="100" height="60" fill="#ffe600"/>
        <rect x="650" y="40" width="100" height="60" fill="#00c2a8"/>
        <rect x="760" y="40" width="100" height="60" fill="#080808"/>
        <rect x="870" y="40" width="100" height="60" fill="#f2f2f0"/>
        <text x="430" y="125" font-family="'IBM Plex Mono',monospace" font-size="8" fill="#6b6b6b" letter-spacing="1">FF3C00</text>
        <text x="540" y="125" font-family="'IBM Plex Mono',monospace" font-size="8" fill="#6b6b6b" letter-spacing="1">FFE600</text>
        <text x="650" y="125" font-family="'IBM Plex Mono',monospace" font-size="8" fill="#6b6b6b" letter-spacing="1">00C2A8</text>
        <text x="760" y="125" font-family="'IBM Plex Mono',monospace" font-size="8" fill="#6b6b6b" letter-spacing="1">080808</text>
        <text x="870" y="125" font-family="'IBM Plex Mono',monospace" font-size="8" fill="#6b6b6b" letter-spacing="1">F2F2F0</text>
        <!-- Type system -->
        <text x="430" y="170" font-family="'Barlow Condensed',sans-serif" font-size="36" font-weight="900" fill="#f2f2f0">Aa</text>
        <text x="430" y="195" font-family="'IBM Plex Mono',monospace" font-size="8" fill="#6b6b6b" letter-spacing="2">BARLOW CONDENSED</text>
        <!-- Business card mocks -->
        <rect x="580" y="155" width="160" height="100" rx="2" fill="#080808" stroke="#2e2e2e" stroke-width="1"/>
        <rect x="580" y="155" width="3" height="100" fill="#ff3c00"/>
        <text x="594" y="200" font-family="'Barlow Condensed',sans-serif" font-size="14" font-weight="700" fill="#f2f2f0">VNS STUDIOS</text>
        <text x="594" y="218" font-family="'IBM Plex Mono',monospace" font-size="7" fill="#6b6b6b" letter-spacing="1">Nguyễn Thành Phát</text>
        <text x="594" y="232" font-family="'IBM Plex Mono',monospace" font-size="7" fill="#6b6b6b" letter-spacing="1">Creative Director</text>
        <rect x="760" y="155" width="160" height="100" rx="2" fill="#ff3c00"/>
        <text x="840" y="200" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="28" font-weight="900" fill="#080808">VNS</text>
        <text x="840" y="220" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="7" fill="#080808" letter-spacing="3" opacity="0.6">STUDIOS</text>
        <!-- Author label -->
        <rect x="980" y="155" width="200" height="100" fill="none" stroke="#2e2e2e" stroke-width="1"/>
        <text x="1080" y="195" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="8" fill="#6b6b6b" letter-spacing="2">SINH VIÊN XỬ LÝ</text>
        <text x="1080" y="213" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="16" font-weight="700" fill="#f2f2f0">LÊ ANH DŨNG</text>
        <text x="1080" y="232" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="7" fill="#ff3c00" letter-spacing="2">KHÓA 2021</text>
      </svg>
      <div class="work-block-overlay">
        <p class="work-tag">// Brand Identity — Giải Nhất</p>
        <h3 class="work-title">VNS Studios — Hệ Thống Nhận Diện Toàn Diện</h3>
        <p class="work-author">Lê Anh Dũng · Khóa 2021 · Dự Án Tốt Nghiệp</p>
      </div>
    </div>

    <!-- Two smaller blocks -->
    <div class="work-block">
      <svg viewBox="0 0 560 320" style="width:100%;display:block;height:280px;" preserveAspectRatio="xMidYMid slice">
        <rect width="560" height="320" fill="#080808"/>
        <!-- Poster typography -->
        <rect x="0" y="0" width="280" height="320" fill="#ffe600"/>
        <text x="140" y="130" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="80" font-weight="900" fill="#080808">PH</text>
        <text x="140" y="200" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="80" font-weight="900" fill="#080808">Ở</text>
        <text x="140" y="260" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="9" fill="#080808" letter-spacing="4" opacity="0.6">POSTER DESIGN</text>
        <rect x="290" y="20" width="250" height="280" fill="none" stroke="#2e2e2e" stroke-width="1"/>
        <text x="415" y="80" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="22" font-weight="700" fill="#f2f2f0" text-transform="uppercase">PHỞ HÀ NỘI</text>
        <text x="415" y="105" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="8" fill="#6b6b6b" letter-spacing="3">KÝ ỨC VỊ NGON</text>
        <line x1="320" y1="118" x2="510" y2="118" stroke="#ff3c00" stroke-width="1.5"/>
        <ellipse cx="415" cy="180" rx="60" ry="60" fill="none" stroke="#ffe600" stroke-width="1" opacity="0.4"/>
        <text x="415" y="188" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="32" font-weight="900" fill="#ffe600">PHỞ</text>
      </svg>
      <div class="work-block-overlay">
        <p class="work-tag">// Typography · Poster</p>
        <h3 class="work-title">Phở — Poster Series</h3>
        <p class="work-author">Trần Thị Bích Ngọc · Khóa 2022</p>
      </div>
    </div>

    <div class="work-block">
      <svg viewBox="0 0 560 320" style="width:100%;display:block;height:280px;" preserveAspectRatio="xMidYMid slice">
        <rect width="560" height="320" fill="#00c2a8"/>
        <!-- Packaging mockup -->
        <rect x="40" y="30" width="160" height="260" rx="4" fill="#080808"/>
        <rect x="40" y="30" width="160" height="5" rx="2" fill="#00c2a8" opacity="0.8"/>
        <text x="120" y="100" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="20" font-weight="900" fill="#f2f2f0">LOTUS</text>
        <text x="120" y="120" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="7" fill="#6b6b6b" letter-spacing="3">TEA CO.</text>
        <ellipse cx="120" cy="185" rx="45" ry="45" fill="none" stroke="#00c2a8" stroke-width="1.5" opacity="0.6"/>
        <text x="120" y="192" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="26" font-weight="900" fill="#00c2a8">LÁ</text>
        <text x="120" y="250" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="7" fill="#6b6b6b" letter-spacing="2">TRÀ SEN ĐỎ</text>
        <!-- 2nd variant -->
        <rect x="220" y="50" width="140" height="220" rx="4" fill="#f2f2f0"/>
        <rect x="220" y="50" width="140" height="5" rx="2" fill="#080808" opacity="0.8"/>
        <text x="290" y="120" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="20" font-weight="900" fill="#080808">LOTUS</text>
        <text x="290" y="140" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="7" fill="#6b6b6b" letter-spacing="3">TEA CO.</text>
        <ellipse cx="290" cy="195" rx="40" ry="40" fill="none" stroke="#080808" stroke-width="1" opacity="0.3"/>
        <text x="290" y="202" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="24" font-weight="900" fill="#080808">LÁ</text>
        <text x="290" y="255" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="7" fill="#6b6b6b" letter-spacing="2">TRÀ SEN TRẮNG</text>
        <!-- 3rd variant -->
        <rect x="375" y="70" width="120" height="180" rx="4" fill="#ff3c00"/>
        <text x="435" y="135" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="18" font-weight="900" fill="#f2f2f0">LOTUS</text>
        <text x="435" y="152" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="6" fill="rgba(242,242,240,0.6)" letter-spacing="2">TEA CO.</text>
        <text x="435" y="220" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="6" fill="rgba(242,242,240,0.6)" letter-spacing="2">TRÀ HOA CÚC</text>
      </svg>
      <div class="work-block-overlay">
        <p class="work-tag">// Packaging Design</p>
        <h3 class="work-title">Lotus Tea — Packaging System</h3>
        <p class="work-author">Nguyễn Khánh Vân · Khóa 2022</p>
      </div>
    </div>
  </div>

  <!-- Three-col row -->
  <div class="works-three">
    <div class="work-block">
      <svg viewBox="0 0 320 220" style="width:100%;display:block;height:220px;" preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="220" fill="#1c1c1c"/>
        <!-- Motion stills -->
        <rect x="20" y="20" width="80" height="60" fill="#ff3c00" opacity="0.8"/>
        <rect x="110" y="20" width="80" height="60" fill="#ff3c00" opacity="0.6"/>
        <rect x="200" y="20" width="100" height="60" fill="#ff3c00" opacity="0.4"/>
        <text x="160" y="130" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="24" font-weight="900" fill="#f2f2f0">MOTION</text>
        <text x="160" y="152" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="8" fill="#6b6b6b" letter-spacing="3">TITLE SEQUENCE</text>
        <!-- Play button -->
        <polygon points="145,168 145,188 165,178" fill="#ff3c00"/>
        <rect x="170" y="168" width="4" height="20" fill="#6b6b6b"/>
        <rect x="178" y="168" width="4" height="20" fill="#6b6b6b"/>
      </svg>
      <div class="work-block-overlay" style="position:relative;background:none;padding:16px 20px;">
        <p class="work-tag">// Motion Design</p>
        <h3 class="work-title">Kinetic Title Sequence</h3>
        <p class="work-author">Phạm Duy Bảo · Khóa 2023</p>
      </div>
    </div>

    <div class="work-block">
      <svg viewBox="0 0 320 220" style="width:100%;display:block;height:220px;" preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="220" fill="#080808"/>
        <!-- Abstract illustration -->
        <circle cx="160" cy="100" r="70" fill="none" stroke="#ffe600" stroke-width="2"/>
        <circle cx="160" cy="100" r="50" fill="none" stroke="#ffe600" stroke-width="1" opacity="0.5"/>
        <circle cx="160" cy="100" r="30" fill="#ffe600" opacity="0.1"/>
        <!-- Intersecting shapes -->
        <rect x="120" y="70" width="80" height="60" fill="none" stroke="#ffe600" stroke-width="1" opacity="0.6" transform="rotate(15 160 100)"/>
        <rect x="120" y="70" width="80" height="60" fill="none" stroke="#ffe600" stroke-width="1" opacity="0.4" transform="rotate(-15 160 100)"/>
        <text x="160" y="180" text-anchor="middle" font-family="'IBM Plex Mono',monospace" font-size="8" fill="#6b6b6b" letter-spacing="3">GEOMETRIC ART</text>
      </svg>
      <div class="work-block-overlay" style="position:relative;background:none;padding:16px 20px;">
        <p class="work-tag">// Illustration</p>
        <h3 class="work-title">Geometric Abstraction</h3>
        <p class="work-author">Võ Minh Hiếu · Khóa 2023</p>
      </div>
    </div>

    <div class="work-block">
      <svg viewBox="0 0 320 220" style="width:100%;display:block;height:220px;" preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="220" fill="#2e2e2e"/>
        <!-- UI/UX app screen -->
        <rect x="90" y="15" width="140" height="240" rx="12" fill="#080808" stroke="#6b6b6b" stroke-width="1"/>
        <rect x="100" y="35" width="120" height="14" rx="3" fill="#1c1c1c"/>
        <rect x="100" y="58" width="120" height="55" rx="4" fill="#00c2a8" opacity="0.2" stroke="#00c2a8" stroke-width="0.5"/>
        <text x="160" y="84" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="12" font-weight="700" fill="#00c2a8">DASHBOARD</text>
        <rect x="100" y="122" width="55" height="40" rx="3" fill="#1c1c1c"/>
        <rect x="163" y="122" width="57" height="40" rx="3" fill="#1c1c1c"/>
        <rect x="100" y="170" width="120" height="20" rx="3" fill="#ff3c00" opacity="0.8"/>
        <text x="160" y="184" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-size="9" font-weight="700" fill="#f2f2f0">TÁC VỤ MỚI</text>
      </svg>
      <div class="work-block-overlay" style="position:relative;background:none;padding:16px 20px;">
        <p class="work-tag">// UI/UX Design</p>
        <h3 class="work-title">GreenLife App Interface</h3>
        <p class="work-author">Đinh Thị Lan · Khóa 2022</p>
      </div>
    </div>
  </div>
</section>

<!-- =================== CLOSING =================== -->

    <section class="page page-works">
      <div class="page-bar">
        <span class="page-bar-title">${payload.journalTitle} / Gallery</span>
        <span class="page-bar-num">// Works</span>
      </div>
      <div style="padding: 40px;">
        <h2 style="font-family:'${payload.headingFont}', sans-serif; font-size: 60px; color: var(--white); text-transform: uppercase;">Sinh Viên</h2>
        <div class="works-grid">
          ${artworks.map(a => `
            <div class="work-block">
              ${a.coverImageUrl ? `<img src="${a.coverImageUrl}" style="width:100%;height:300px;object-fit:cover;"/>` : `<div style="height:300px; background:var(--gray1)"></div>`}
              <div class="work-block-overlay">
                <div class="work-tag">${a.category}</div>
                <div class="work-title">${a.title}</div>
                <div class="work-author">${a.student}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    <section class="page page-closing">
  <div class="closing-left">
    <div class="closing-bg-text">G</div>
    <div class="closing-left-content">
      <p class="closing-label">// Lời Cảm Ơn — 2025</p>
      <h2 class="closing-title">CẢM<br>ƠN</h2>
      <p style="font-family: '${payload.bodyFont}', sans-serif; font-size:15px; color:rgba(8,8,8,0.7); margin-top:20px; line-height:1.7; max-width:320px;">Tập san GRID là thành quả của hàng trăm giờ lao động sáng tạo, tư duy phản biện và tinh thần không ngại thất bại để tìm ra điều mới.</p>
    </div>
  </div>

  <div class="closing-right">
    <div>
      <p class="mono-line" style="color:var(--accent);">// Ban Thực Hiện</p>
      <div class="credits-grid">
        <div class="credit-cell">
          <label>Chủ Biên</label>
          <ul>
            <li>TS. Nguyễn Minh Anh</li>
            <li>GVC. Trần Phúc Thịnh</li>
          </ul>
        </div>
        <div class="credit-cell">
          <label>Thiết Kế Tập San</label>
          <ul>
            <li>Lê Anh Dũng</li>
            <li>Nguyễn Khánh Vân</li>
          </ul>
        </div>
        <div class="credit-cell">
          <label>Ban Biên Tập</label>
          <ul>
            <li>Trần Bích Ngọc</li>
            <li>Phạm Duy Bảo</li>
            <li>Võ Minh Hiếu</li>
          </ul>
        </div>
        <div class="credit-cell">
          <label>Đơn Vị</label>
          <ul>
            <li>Khoa Thiết Kế</li>
            <li>Đồ Họa · 2025</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="closing-footer">
      <p>GRID · Vol. 01 · MMXXV</p>
      <p>Ấn Bản Giới Hạn · 500 Bản</p>
    </div>
  </div>
</section>

</body>
</html>
`;
}
