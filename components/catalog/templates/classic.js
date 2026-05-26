export function renderClassic(payload, artworks) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>FORMA — ${payload.journalSubtitle} 2025 · Classic</title>
<link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Josefin+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --ivory: ${payload.backgroundColor};
    --parchment: #ede6d3;
    --ink: ${payload.textColor};
    --sepia:   #5c4a2a;
    --gold: ${payload.primaryColor};
    --gold2:   #d4af6a;
    --rust: ${payload.secondaryColor};
    --sage:    #4a5c47;
    --rule:    #c8b89a;
    --white:   #fffdf8;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  body {
    background: var(--ivory);
    color: var(--ink);
    font-family: '${payload.bodyFont}', serif;
    overflow-x: hidden;
  }

  /* ===================== COVER ===================== */
  .cover {
    width: 100%;
    min-height: 100vh;
    background: var(--ink);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    page-break-after: always;
  }

  /* Symmetrical ornamental border */
  .cover-frame {
    position: absolute;
    inset: 30px;
    border: 1px solid rgba(184,150,62,0.4);
    pointer-events: none;
  }
  .cover-frame::before {
    content: '';
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(184,150,62,0.15);
  }

  /* Corner ornaments */
  .corner {
    position: absolute;
    width: 40px;
    height: 40px;
    border-color: var(--gold);
    border-style: solid;
    opacity: 0.7;
  }
  .corner-tl { top: 30px; left: 30px; border-width: 2px 0 0 2px; }
  .corner-tr { top: 30px; right: 30px; border-width: 2px 2px 0 0; }
  .corner-bl { bottom: 30px; left: 30px; border-width: 0 0 2px 2px; }
  .corner-br { bottom: 30px; right: 30px; border-width: 0 2px 2px 0; }

  .cover-inner {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 60px 80px;
    max-width: 900px;
  }

  .cover-vol {
    font-family: '${payload.monoFont}', sans-serif;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 8px;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 40px;
    opacity: 0;
    animation: riseUp 0.9s ease 0.3s forwards;
  }

  /* Central ornament SVG */
  .cover-ornament {
    margin: 0 auto 32px;
    opacity: 0;
    animation: fadeIn 1.2s ease 0.5s forwards;
  }

  .cover-title {
    font-family: '${payload.headingFont}', serif;
    font-size: clamp(80px, 14vw, 180px);
    color: var(--ivory);
    line-height: 0.85;
    letter-spacing: -1px;
    margin-bottom: 0;
    opacity: 0;
    animation: riseUp 1s ease 0.7s forwards;
  }

  .cover-title-sub {
    font-family: '${payload.headingFont}', serif;
    font-size: clamp(14px, 2.2vw, 24px);
    font-style: italic;
    color: var(--gold2);
    letter-spacing: 6px;
    margin-top: 12px;
    margin-bottom: 36px;
    opacity: 0;
    animation: riseUp 1s ease 0.9s forwards;
  }

  /* Horizontal rule with diamond */
  .divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 28px auto;
    max-width: 400px;
    opacity: 0;
    animation: fadeIn 1s ease 1s forwards;
  }
  .divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--gold));
  }
  .divider-line.right {
    background: linear-gradient(to left, transparent, var(--gold));
  }
  .divider-diamond {
    width: 8px;
    height: 8px;
    background: var(--gold);
    transform: rotate(45deg);
  }

  /* Large illustrative SVG on cover */
  .cover-illustration {
    width: clamp(200px, 40vw, 420px);
    margin: 24px auto;
    opacity: 0;
    animation: fadeIn 1.4s ease 1s forwards;
  }

  .cover-tagline {
    font-family: '${payload.monoFont}', sans-serif;
    font-size: 11px;
    font-weight: 300;
    letter-spacing: 5px;
    color: rgba(248,244,236,0.5);
    text-transform: uppercase;
    opacity: 0;
    animation: fadeIn 1s ease 1.2s forwards;
  }

  .cover-meta {
    position: absolute;
    bottom: 55px;
    left: 0; right: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 70px;
    z-index: 3;
    opacity: 0;
    animation: fadeIn 1s ease 1.4s forwards;
  }
  .cover-meta span {
    font-family: '${payload.monoFont}', sans-serif;
    font-size: 9px;
    letter-spacing: 4px;
    color: rgba(184,150,62,0.6);
    text-transform: uppercase;
  }

  @keyframes riseUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ===================== PAGES ===================== */
  .page {
    width: 100%;
    min-height: 100vh;
    padding: 80px 80px;
    position: relative;
    overflow: hidden;
    page-break-after: always;
  }

  .page-number {
    position: absolute;
    bottom: 40px;
    font-family: '${payload.monoFont}', sans-serif;
    font-size: 9px;
    letter-spacing: 4px;
    color: var(--gold);
    text-transform: uppercase;
  }
  .page-number.left  { left: 80px; }
  .page-number.right { right: 80px; }

  /* Running header */
  .running-head {
    position: absolute;
    top: 40px;
    left: 0; right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }
  .running-head span {
    font-family: '${payload.monoFont}', sans-serif;
    font-size: 9px;
    letter-spacing: 5px;
    color: var(--rule);
    text-transform: uppercase;
  }
  .running-head-rule {
    width: 60px;
    height: 1px;
    background: var(--rule);
  }

  /* Section labels */
  .sec-label {
    font-family: '${payload.monoFont}', sans-serif;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 6px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .sec-label::before, .sec-label::after {
    content: '◆';
    font-size: 6px;
    color: var(--gold2);
  }

  /* ===================== LOI MO DAU ===================== */
  .page-foreword {
    background: var(--white);
    display: grid;
    grid-template-columns: 1fr 3px 1fr;
    gap: 0 60px;
    align-items: center;
  }

  .rule-vertical {
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--rule), transparent);
    height: 70%;
    align-self: center;
    justify-self: center;
  }

  .foreword-left { text-align: right; padding-right: 20px; }
  .foreword-right { padding-left: 20px; }

  .drop-cap::first-letter {
    font-family: '${payload.headingFont}', serif;
    float: left;
    font-size: 5.5em;
    line-height: 0.8;
    margin-right: 12px;
    margin-top: 6px;
    color: var(--rust);
  }

  h1.classic { font-family: '${payload.headingFont}', serif; font-size: clamp(36px, 4vw, 58px); line-height: 1.05; color: var(--ink); margin-bottom: 20px; }
  h2.classic { font-family: '${payload.headingFont}', serif; font-size: clamp(24px, 2.5vw, 36px); line-height: 1.1; color: var(--ink); margin-bottom: 16px; }
  h3.classic { font-family: '${payload.monoFont}', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: var(--sepia); margin-bottom: 12px; }

  p.body-text {
    font-size: 15px;
    line-height: 1.85;
    color: var(--sepia);
    margin-bottom: 18px;
  }

  .ornamental-quote {
    font-family: '${payload.headingFont}', serif;
    font-size: clamp(22px, 2.5vw, 32px);
    font-style: italic;
    color: var(--rust);
    line-height: 1.35;
    padding: 28px 0;
    border-top: 1px solid var(--rule);
    border-bottom: 1px solid var(--rule);
    text-align: center;
    margin: 30px 0;
  }
  .ornamental-quote cite {
    display: block;
    font-family: '${payload.monoFont}', sans-serif;
    font-size: 10px;
    letter-spacing: 4px;
    font-style: normal;
    color: var(--gold);
    margin-top: 10px;
    text-transform: uppercase;
  }

  /* ===================== TABLE OF CONTENTS ===================== */
  .page-toc {
    background: var(--parchment);
  }

  .toc-header {
    text-align: center;
    margin-bottom: 60px;
    padding-bottom: 30px;
    border-bottom: 1px solid var(--rule);
  }

  .toc-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  .toc-col {
    padding: 0 40px;
  }
  .toc-col:first-child {
    border-right: 1px solid var(--rule);
    padding-right: 60px;
  }
  .toc-col:last-child {
    padding-left: 60px;
  }

  .toc-entry {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: baseline;
    gap: 0 12px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(200,184,154,0.4);
  }
  .toc-num {
    font-family: '${payload.headingFont}', serif;
    font-size: 22px;
    color: var(--gold);
    line-height: 1;
    min-width: 32px;
  }
  .toc-title-wrap { flex: 1; }
  .toc-title-wrap h4 {
    font-family: '${payload.bodyFont}', serif;
    font-size: 14px;
    color: var(--ink);
    margin-bottom: 3px;
  }
  .toc-title-wrap p {
    font-family: '${payload.monoFont}', sans-serif;
    font-size: 9px;
    letter-spacing: 3px;
    color: var(--rule);
    text-transform: uppercase;
  }
  .toc-dots {
    flex: 1;
    border-bottom: 1px dotted var(--rule);
    margin: 0 10px 4px;
    min-width: 30px;
  }
  .toc-page {
    font-family: '${payload.headingFont}', serif;
    font-size: 16px;
    color: var(--sepia);
  }

  /* ===================== BODY (WORKS) ===================== */
  .page-body {
    background: var(--white);
  }

  .works-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 40px;
    margin-top: 40px;
  }

  .work-card {
    border: 1px solid var(--rule);
    background: var(--ivory);
    transition: box-shadow 0.3s;
  }
  .work-card:hover {
    box-shadow: 4px 4px 0 var(--gold2);
  }

  .work-img {
    width: 100%;
    aspect-ratio: 4/3;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--ink);
    border-bottom: 1px solid var(--rule);
  }

  .work-info {
    padding: 20px;
  }
  .work-info h4 {
    font-family: '${payload.headingFont}', serif;
    font-size: 18px;
    color: var(--ink);
    margin-bottom: 6px;
  }
  .work-info p {
    font-family: '${payload.monoFont}', sans-serif;
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .work-info small {
    font-size: 12px;
    color: var(--sepia);
    line-height: 1.6;
  }

  /* Featured work: 2/3 + 1/3 */
  .works-featured {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
    margin-top: 40px;
  }
  .work-card-featured .work-img {
    aspect-ratio: 16/9;
  }

  /* ===================== COLOPHON ===================== */
  .page-colophon {
    background: var(--ink);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .colophon-ornament { margin-bottom: 32px; }

  .colophon-title {
    font-family: '${payload.headingFont}', serif;
    font-size: clamp(40px, 6vw, 80px);
    color: var(--ivory);
    line-height: 1;
    margin-bottom: 8px;
  }
  .colophon-sub {
    font-family: '${payload.monoFont}', sans-serif;
    font-size: 10px;
    letter-spacing: 6px;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 40px;
  }

  .colophon-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    max-width: 700px;
    width: 100%;
    border: 1px solid rgba(184,150,62,0.3);
    margin-bottom: 48px;
  }
  .colophon-cell {
    padding: 28px 24px;
    border-right: 1px solid rgba(184,150,62,0.3);
    text-align: center;
  }
  .colophon-cell:last-child { border-right: none; }
  .colophon-cell h5 {
    font-family: '${payload.monoFont}', sans-serif;
    font-size: 9px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 8px;
  }
  .colophon-cell p {
    font-family: '${payload.headingFont}', serif;
    font-size: 15px;
    color: var(--ivory);
    font-style: italic;
    line-height: 1.5;
  }

  .colophon-closing {
    font-family: '${payload.monoFont}', sans-serif;
    font-size: 9px;
    letter-spacing: 4px;
    color: rgba(184,150,62,0.4);
    text-transform: uppercase;
  }
</style>
</head>
<body>

<!-- ═══════════════ COVER ═══════════════ -->
<section class="cover">
  <div class="cover-frame"></div>
  <div class="corner corner-tl"></div>
  <div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div>
  <div class="corner corner-br"></div>

  <div class="cover-inner">
    <p class="cover-vol">Ấn Phẩm Thiết Kế Đồ Họa &nbsp;·&nbsp; Số I &nbsp;·&nbsp; MMXXV</p>

    <!-- Central geometric ornament -->
    <svg class="cover-ornament" width="120" height="40" viewBox="0 0 120 40">
      <line x1="0" y1="20" x2="45" y2="20" stroke="#b8963e" stroke-width="0.8"/>
      <polygon points="55,10 65,20 55,30 45,20" fill="none" stroke="#b8963e" stroke-width="0.8"/>
      <polygon points="60,14 68,20 60,26 52,20" fill="#b8963e" fill-opacity="0.3"/>
      <line x1="75" y1="20" x2="120" y2="20" stroke="#b8963e" stroke-width="0.8"/>
    </svg>

    <h1 class="cover-title">${payload.journalTitle}</h1>
    <p class="cover-title-sub">${payload.journalSubtitle}</p>

    <!-- Decorative illustration -->
    <svg class="cover-illustration" viewBox="0 0 420 260" xmlns="http://www.w3.org/2000/svg">
      <!-- Background panel -->
      <rect x="20" y="20" width="380" height="220" fill="none" stroke="#b8963e" stroke-width="0.6" opacity="0.4"/>
      <!-- Columns Symmetrical -->
      <rect x="60" y="50" width="4" height="160" fill="#b8963e" opacity="0.3"/>
      <rect x="356" y="50" width="4" height="160" fill="#b8963e" opacity="0.3"/>
      <!-- Central medallion -->
      <circle cx="210" cy="130" r="70" fill="none" stroke="#b8963e" stroke-width="1" opacity="0.5"/>
      <circle cx="210" cy="130" r="52" fill="none" stroke="#b8963e" stroke-width="0.5" opacity="0.4"/>
      <circle cx="210" cy="130" r="34" fill="rgba(184,150,62,0.08)"/>
      <!-- Star / compass rose -->
      <polygon points="210,66 215,122 210,130 205,122" fill="#b8963e" opacity="0.5"/>
      <polygon points="210,194 215,138 210,130 205,138" fill="#b8963e" opacity="0.5"/>
      <polygon points="146,130 202,125 210,130 202,135" fill="#b8963e" opacity="0.5"/>
      <polygon points="274,130 218,125 210,130 218,135" fill="#b8963e" opacity="0.5"/>
      <!-- Diagonal cross -->
      <polygon points="162,76 208,124 210,130 204,126" fill="#b8963e" opacity="0.3"/>
      <polygon points="258,76 212,124 210,130 216,126" fill="#b8963e" opacity="0.3"/>
      <polygon points="162,184 208,136 210,130 204,134" fill="#b8963e" opacity="0.3"/>
      <polygon points="258,184 212,136 210,130 216,134" fill="#b8963e" opacity="0.3"/>
      <!-- Center jewel -->
      <circle cx="210" cy="130" r="10" fill="#b8963e" opacity="0.5"/>
      <circle cx="210" cy="130" r="5" fill="#d4af6a"/>
      <!-- Flourishes left & right -->
      <path d="M90,100 Q130,130 90,160" fill="none" stroke="#b8963e" stroke-width="0.8" opacity="0.4"/>
      <path d="M330,100 Q290,130 330,160" fill="none" stroke="#b8963e" stroke-width="0.8" opacity="0.4"/>
    </svg>

    <div class="divider">
      <div class="divider-line"></div>
      <div class="divider-diamond"></div>
      <div class="divider-line right"></div>
    </div>
    <p class="cover-tagline">Khoa Thiết Kế Đồ Họa &nbsp;·&nbsp; Triển Lãm Thường Niên</p>
  </div>

  <div class="cover-meta">
    <span>Hội Đồng Thiết Kế</span>
    <span>Năm Học 2024–2025</span>
    <span>Ấn Bản Giới Hạn</span>
  </div>
</section>

<!-- ═══════════════ LỜI MỞ ĐẦU ═══════════════ -->
<section class="page page-foreword">
  <div class="running-head">
    <div class="running-head-rule"></div>
    <span>Forma &nbsp;·&nbsp; Lời Mở Đầu</span>
    <div class="running-head-rule"></div>
  </div>

  <div class="foreword-left">
    <div class="sec-label">Tiếng Nói Của Khoa</div>
    <h1 class="classic">Nghệ Thuật<br><em>Là Ngôn Ngữ<br>Vượt Thời Gian</em></h1>
    <div class="divider" style="justify-content: flex-end; margin: 20px 0;">
      <div class="divider-line" style="max-width: 80px;"></div>
      <div class="divider-diamond"></div>
    </div>
    <p class="body-text">Trải qua nhiều thế kỷ, thiết kế đồ họa luôn là cầu nối giữa tư duy và cảm xúc — nơi ý tưởng được chưng cất thành hình ảnh, màu sắc và ngôn ngữ thị giác.</p>
    <p class="body-text">Tập san FORMA là minh chứng cho hành trình sáng tạo không ngừng nghỉ của các thế hệ sinh viên Khoa Thiết Kế Đồ Họa.</p>

    <!-- Author portrait placeholder -->
    <svg viewBox="0 0 200 200" width="180" style="margin-top:24px; float:right; border: 1px solid var(--rule); padding: 4px; background: var(--parchment);">
      <circle cx="100" cy="80" r="36" fill="#5c4a2a" opacity="0.2"/>
      <ellipse cx="100" cy="160" rx="52" ry="32" fill="#5c4a2a" opacity="0.15"/>
      <rect x="70" y="110" width="60" height="8" rx="2" fill="#5c4a2a" opacity="0.1"/>
      <text x="100" y="188" text-anchor="middle" font-family="'Josefin Sans', sans-serif" font-size="9" fill="#b8963e" letter-spacing="2">TS. MINH ANH</text>
    </svg>
  </div>

  <div class="rule-vertical"></div>

  <div class="foreword-right">
    <blockquote class="ornamental-quote">
      "Thiết kế không chỉ là vẻ đẹp — đó là sự giao thoa hoàn hảo giữa chức năng và thẩm mỹ, nơi từng đường nét đều mang một ý nghĩa."
      <cite>— Ban Biên Tập Forma 2025</cite>
    </blockquote>
    <p class="body-text drop-cap">Năm học 2024–2025 đánh dấu một chương mới trong hành trình phát triển của Khoa. Các sinh viên đã vươn ra ngoài ranh giới quen thuộc, khám phá những ngôn ngữ thiết kế mới — từ hệ thống nhận diện thương hiệu tinh tế đến những bộ ấn phẩm đậm chất thể nghiệm.</p>
    <p class="body-text">Mỗi tác phẩm trong tập san này là một câu chuyện riêng, một cuộc đối thoại giữa người tạo ra và người chiêm ngưỡng — nơi sự cổ điển và đương đại hội tụ trong nét bút tài hoa.</p>
    <p class="body-text">Chúng tôi trân trọng giới thiệu FORMA — triển lãm ấn phẩm thiết kế đồ họa thường niên, một không gian tôn vinh sự sáng tạo, tài năng và tâm huyết của các sinh viên xuất sắc.</p>
    <div class="divider" style="margin: 28px 0 0;">
      <div class="divider-diamond"></div>
      <div class="divider-line right" style="max-width: 80px;"></div>
    </div>
  </div>

  <div class="page-number right">Forma &nbsp;·&nbsp; Trang 02</div>
</section>

<!-- ═══════════════ MỤC LỤC ═══════════════ -->
<section class="page page-toc">
  <div class="running-head">
    <div class="running-head-rule"></div>
    <span>Forma &nbsp;·&nbsp; Mục Lục</span>
    <div class="running-head-rule"></div>
  </div>

  <div class="toc-header">
    <div class="sec-label" style="justify-content: center;">◆</div>
    <h2 class="classic" style="text-align:center; margin-bottom: 10px;">Nội Dung Triển Lãm</h2>
    <p style="font-family: '${payload.monoFont}', sans-serif; font-size:10px; letter-spacing:4px; color:var(--rule); text-align:center; text-transform:uppercase;">${payload.journalSubtitle} &nbsp;·&nbsp; 2025</p>
  </div>

  <div class="toc-grid">
    <div class="toc-col">
      <div class="toc-entry">
        <span class="toc-num">01</span>
        <div class="toc-title-wrap">
          <h4>Lời Mở Đầu</h4>
          <p>Tiếng nói của khoa</p>
        </div>
        <span class="toc-page">02</span>
      </div>
      <div class="toc-entry">
        <span class="toc-num">02</span>
        <div class="toc-title-wrap">
          <h4>Nhận Diện Thương Hiệu</h4>
          <p>Brand Identity Design</p>
        </div>
        <span class="toc-page">06</span>
      </div>
      <div class="toc-entry">
        <span class="toc-num">03</span>
        <div class="toc-title-wrap">
          <h4>Thiết Kế Ấn Phẩm</h4>
          <p>Print & Publication</p>
        </div>
        <span class="toc-page">12</span>
      </div>
      <div class="toc-entry">
        <span class="toc-num">04</span>
        <div class="toc-title-wrap">
          <h4>Minh Họa & Typography</h4>
          <p>Illustration & Type</p>
        </div>
        <span class="toc-page">20</span>
      </div>
    </div>

    <div class="toc-col">
      <div class="toc-entry">
        <span class="toc-num">05</span>
        <div class="toc-title-wrap">
          <h4>Thiết Kế Bao Bì</h4>
          <p>Packaging Design</p>
        </div>
        <span class="toc-page">28</span>
      </div>
      <div class="toc-entry">
        <span class="toc-num">06</span>
        <div class="toc-title-wrap">
          <h4>Motion & Digital</h4>
          <p>Thiết Kế Số & Chuyển Động</p>
        </div>
        <span class="toc-page">36</span>
      </div>
      <div class="toc-entry">
        <span class="toc-num">07</span>
        <div class="toc-title-wrap">
          <h4>Tác Phẩm Đặc Biệt</h4>
          <p>Dự Án Tốt Nghiệp</p>
        </div>
        <span class="toc-page">44</span>
      </div>
      <div class="toc-entry">
        <span class="toc-num">08</span>
        <div class="toc-title-wrap">
          <h4>Lời Cảm Ơn</h4>
          <p>Ghi Nhận & Tri Ân</p>
        </div>
        <span class="toc-page">52</span>
      </div>
    </div>
  </div>

  <!-- Decorative central illustration -->
  <div style="text-align:center; margin-top: 50px;">
    <svg viewBox="0 0 400 80" width="400" style="opacity:0.35;">
      <line x1="0" y1="40" x2="150" y2="40" stroke="#b8963e" stroke-width="0.8"/>
      <polygon points="160,30 175,40 160,50 145,40" fill="none" stroke="#b8963e" stroke-width="0.8"/>
      <polygon points="200,24 215,40 200,56 185,40" fill="none" stroke="#b8963e" stroke-width="1"/>
      <circle cx="200" cy="40" r="6" fill="#b8963e"/>
      <polygon points="240,30 255,40 240,50 225,40" fill="none" stroke="#b8963e" stroke-width="0.8"/>
      <line x1="250" y1="40" x2="400" y2="40" stroke="#b8963e" stroke-width="0.8"/>
    </svg>
  </div>

  <div class="page-number right">Forma &nbsp;·&nbsp; Mục Lục</div>
</section>

<!-- ═══════════════ BODY – WORKS ═══════════════ -->
<section class="page page-body" style="background: var(--white);">
  <div class="running-head">
    <div class="running-head-rule"></div>
    <span>Forma &nbsp;·&nbsp; Ấn Phẩm Nổi Bật</span>
    <div class="running-head-rule"></div>
  </div>

  <div style="text-align:center; margin-bottom: 40px; padding-top: 20px;">
    <div class="sec-label" style="justify-content:center;">Chương 02</div>
    <h2 class="classic">Nhận Diện Thương Hiệu<br><em>& Ấn Phẩm Nổi Bật</em></h2>
    <div class="divider"><div class="divider-line"></div><div class="divider-diamond"></div><div class="divider-line right"></div></div>
  </div>

  <!-- Featured work -->
  <div class="works-featured">
    <div class="work-card work-card-featured">
      <div class="work-img">
        <svg viewBox="0 0 560 315" style="width:100%;height:100%;">
          <rect width="560" height="315" fill="#1a1410"/>
          <rect x="30" y="30" width="500" height="255" fill="none" stroke="#b8963e" stroke-width="0.5" opacity="0.3"/>
          <!-- Brand system mockup -->
          <rect x="60" y="60" width="180" height="80" fill="#b8963e" opacity="0.15" rx="2"/>
          <text x="150" y="95" text-anchor="middle" font-family="serif" font-size="28" fill="#b8963e" font-style="italic">Aurum</text>
          <text x="150" y="115" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#d4af6a" letter-spacing="4">JEWELLERY</text>
          <rect x="260" y="60" width="240" height="195" fill="none" stroke="#b8963e" stroke-width="0.5" opacity="0.3"/>
          <!-- Business card mockup -->
          <rect x="275" y="75" width="100" height="60" rx="2" fill="#b8963e" opacity="0.08" stroke="#b8963e" stroke-width="0.5" opacity="0.4"/>
          <text x="325" y="100" text-anchor="middle" font-family="serif" font-size="10" fill="#d4af6a" font-style="italic">Aurum</text>
          <text x="325" y="114" text-anchor="middle" font-family="sans-serif" font-size="5" fill="#c8b89a" letter-spacing="2">JEWELLERY CO.</text>
          <!-- Color palette swatches -->
          <rect x="275" y="150" width="28" height="28" fill="#1a1410"/>
          <rect x="307" y="150" width="28" height="28" fill="#b8963e"/>
          <rect x="339" y="150" width="28" height="28" fill="#f8f4ec"/>
          <rect x="371" y="150" width="28" height="28" fill="#5c4a2a"/>
          <!-- Label -->
          <rect x="60" y="155" width="180" height="100" fill="none" stroke="#b8963e" stroke-width="0.3" opacity="0.2"/>
          <text x="150" y="185" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#b8963e" letter-spacing="3">THIẾT KẾ NỔI BẬT</text>
          <text x="150" y="205" text-anchor="middle" font-family="serif" font-size="14" fill="#f8f4ec">NHẬN DIỆN THƯƠNG HIỆU</text>
          <text x="150" y="225" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#5c4a2a">Cao Thị Phương Linh · 2025</text>
        </svg>
      </div>
      <div class="work-info">
        <p>Nhận Diện Thương Hiệu · Thiết Kế Xuất Sắc</p>
        <h4>Aurum Jewellery — Hệ Thống Nhận Diện Toàn Diện</h4>
        <small>Dự án xây dựng hệ thống nhận diện thương hiệu cho chuỗi trang sức cao cấp, kết hợp ngôn ngữ thị giác cổ điển với phong cách đương đại tinh tế.</small>
      </div>
    </div>

    <div style="display:flex; flex-direction:column; gap:24px;">
      <div class="work-card">
        <div class="work-img" style="aspect-ratio: 4/3;">
          <svg viewBox="0 0 280 210" style="width:100%;height:100%;">
            <rect width="280" height="210" fill="#2c3e50"/>
            <rect x="20" y="20" width="100" height="170" rx="4" fill="#4a5c47" opacity="0.4"/>
            <rect x="20" y="20" width="100" height="170" rx="4" fill="none" stroke="#b8963e" stroke-width="0.5" opacity="0.4"/>
            <text x="70" y="55" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#b8963e" letter-spacing="2">TERRA</text>
            <text x="70" y="70" text-anchor="middle" font-family="serif" font-size="5" fill="#c8b89a" letter-spacing="1">ORGANIC GOODS</text>
            <rect x="28" y="85" width="84" height="1" fill="#b8963e" opacity="0.4"/>
            <text x="70" y="105" text-anchor="middle" font-family="serif" font-size="9" fill="#f8f4ec" font-style="italic">Purely</text>
            <text x="70" y="119" text-anchor="middle" font-family="serif" font-size="9" fill="#f8f4ec" font-style="italic">from Earth</text>
            <!-- Packaging right side -->
            <rect x="140" y="30" width="120" height="150" rx="2" fill="#f8f4ec" opacity="0.07"/>
            <ellipse cx="200" cy="80" rx="40" ry="40" fill="none" stroke="#b8963e" stroke-width="0.5" opacity="0.5"/>
            <text x="200" y="77" text-anchor="middle" font-family="serif" font-size="12" fill="#d4af6a">Terra</text>
            <text x="200" y="93" text-anchor="middle" font-family="sans-serif" font-size="5" fill="#c8b89a" letter-spacing="2">ORGANIC</text>
          </svg>
        </div>
        <div class="work-info">
          <p>Bao Bì · Thiết Kế Sáng Tạo</p>
          <h4>Terra Organic — Packaging</h4>
          <small>Nguyễn Đức Minh · Khóa 2021</small>
        </div>
      </div>

      <div class="work-card">
        <div class="work-img" style="aspect-ratio: 4/3;">
          <svg viewBox="0 0 280 210" style="width:100%;height:100%;">
            <rect width="280" height="210" fill="#1a1410"/>
            <!-- Poster design -->
            <rect x="40" y="15" width="200" height="180" fill="none" stroke="#b8963e" stroke-width="0.5" opacity="0.3"/>
            <text x="140" y="50" text-anchor="middle" font-family="serif" font-size="28" fill="#b8963e" font-style="italic">Jazz</text>
            <text x="140" y="70" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#c8b89a" letter-spacing="5">FESTIVAL 2025</text>
            <!-- Abstract instruments -->
            <ellipse cx="140" cy="130" rx="35" ry="50" fill="none" stroke="#d4af6a" stroke-width="0.8" opacity="0.5"/>
            <line x1="140" y1="80" x2="140" y2="180" stroke="#b8963e" stroke-width="0.5" opacity="0.5"/>
            <line x1="105" y1="130" x2="175" y2="130" stroke="#b8963e" stroke-width="0.5" opacity="0.5"/>
            <circle cx="140" cy="130" r="8" fill="#b8963e" opacity="0.4"/>
            <text x="140" y="195" text-anchor="middle" font-family="sans-serif" font-size="6" fill="#5c4a2a" letter-spacing="2">POSTER · MINH HỌA</text>
          </svg>
        </div>
        <div class="work-info">
          <p>Poster · Typography</p>
          <h4>Jazz Festival — Thiết Kế Poster</h4>
          <small>Trần Thị Lan Anh · Khóa 2022</small>
        </div>
      </div>
    </div>
  </div>

  <!-- Second row of works -->
  <div class="works-grid" style="margin-top: 32px;">
    <div class="work-card">
      <div class="work-img">
        <svg viewBox="0 0 320 240" style="width:100%;height:100%;">
          <rect width="320" height="240" fill="#f8f4ec"/>
          <rect x="20" y="20" width="280" height="200" fill="none" stroke="#5c4a2a" stroke-width="0.5" opacity="0.2"/>
          <!-- Book mockup -->
          <rect x="60" y="40" width="90" height="160" fill="#2c3e50"/>
          <rect x="60" y="40" width="6" height="160" fill="#1a1410"/>
          <text x="110" y="110" text-anchor="middle" font-family="serif" font-size="11" fill="#b8963e" font-style="italic">Việt Nam</text>
          <text x="110" y="126" text-anchor="middle" font-family="serif" font-size="11" fill="#b8963e" font-style="italic">Xưa & Nay</text>
          <rect x="170" y="40" width="90" height="160" fill="#8b3a1e"/>
          <rect x="170" y="40" width="6" height="160" fill="#5c2010"/>
          <text x="215" y="114" text-anchor="middle" font-family="serif" font-size="10" fill="#f8f4ec" font-style="italic">Sài Gòn</text>
          <text x="215" y="130" text-anchor="middle" font-family="serif" font-size="10" fill="#f8f4ec" font-style="italic">Ký Ức</text>
        </svg>
      </div>
      <div class="work-info">
        <p>Ấn Phẩm · Sách</p>
        <h4>Việt Nam Xưa & Nay — Book Design</h4>
        <small>Phạm Minh Tuấn · Khóa 2021</small>
      </div>
    </div>

    <div class="work-card">
      <div class="work-img">
        <svg viewBox="0 0 320 240" style="width:100%;height:100%;">
          <rect width="320" height="240" fill="#1a1410"/>
          <!-- Typography poster -->
          <text x="30" y="80" font-family="serif" font-size="60" fill="none" stroke="#b8963e" stroke-width="0.8" opacity="0.6">T</text>
          <text x="90" y="140" font-family="serif" font-size="60" fill="none" stroke="#b8963e" stroke-width="0.8" opacity="0.4">Y</text>
          <text x="170" y="200" font-family="serif" font-size="60" fill="none" stroke="#b8963e" stroke-width="0.8" opacity="0.6">P</text>
          <text x="235" y="120" font-family="serif" font-size="60" fill="none" stroke="#b8963e" stroke-width="0.8" opacity="0.3">O</text>
          <text x="160" y="130" text-anchor="middle" font-family="sans-serif" font-size="8" fill="#d4af6a" letter-spacing="4">TYPOGRAPHY IN MOTION</text>
        </svg>
      </div>
      <div class="work-info">
        <p>Typography · Thể Nghiệm</p>
        <h4>TYPO — Thư Pháp Đương Đại</h4>
        <small>Lê Hoàng Nam · Khóa 2023</small>
      </div>
    </div>

    <div class="work-card">
      <div class="work-img">
        <svg viewBox="0 0 320 240" style="width:100%;height:100%;">
          <rect width="320" height="240" fill="#4a5c47"/>
          <!-- UI mockup -->
          <rect x="30" y="25" width="260" height="190" rx="8" fill="#f8f4ec" opacity="0.06" stroke="#f8f4ec" stroke-width="0.5" opacity="0.2"/>
          <rect x="30" y="25" width="260" height="28" rx="8" fill="#2c3e50" opacity="0.5"/>
          <circle cx="46" cy="39" r="5" fill="#8b3a1e" opacity="0.6"/>
          <circle cx="60" cy="39" r="5" fill="#b8963e" opacity="0.6"/>
          <circle cx="74" cy="39" r="5" fill="#4a5c47" opacity="0.6"/>
          <rect x="46" y="70" width="120" height="8" rx="2" fill="#b8963e" opacity="0.5"/>
          <rect x="46" y="86" width="80" height="4" rx="1" fill="#f8f4ec" opacity="0.2"/>
          <rect x="46" y="106" width="100" height="50" rx="4" fill="#b8963e" opacity="0.1" stroke="#b8963e" stroke-width="0.5" opacity="0.3"/>
          <text x="96" y="136" text-anchor="middle" font-family="sans-serif" font-size="7" fill="#d4af6a" letter-spacing="2">UI DESIGN</text>
        </svg>
      </div>
      <div class="work-info">
        <p>Digital · UI/UX</p>
        <h4>EcoTrack — Thiết Kế Giao Diện</h4>
        <small>Hoàng Thị Mai · Khóa 2022</small>
      </div>
    </div>
  </div>

  <div class="page-number right">Forma &nbsp;·&nbsp; Ấn Phẩm Nổi Bật</div>
</section>

<!-- ═══════════════ COLOPHON / LỜI CẢM ƠN ═══════════════ -->

    <section class="page page-body" style="background: var(--white);">
      <div class="running-head">
        <div class="running-head-rule"></div>
        <span>${payload.journalTitle} &nbsp;&middot;&nbsp; Tác Phẩm Sinh Viên</span>
        <div class="running-head-rule"></div>
      </div>
      <div style="text-align:center; margin-bottom: 40px; padding-top: 20px;">
        <div class="sec-label" style="justify-content:center;">Gallery</div>
        <h2 class="classic">Danh sách<br><em>Tác Phẩm</em></h2>
        <div class="divider"><div class="divider-line"></div><div class="divider-diamond"></div><div class="divider-line right"></div></div>
      </div>
      
      <div class="works-grid">
      ${artworks.map((a, i) => `
        <div class="work-card">
          <div class="work-img">
             ${a.coverImageUrl ? `<img src="${a.coverImageUrl}" style="width:100%;height:100%;object-fit:cover;" />` : `<div style="color:var(--ivory)">IMG</div>`}
          </div>
          <div class="work-info">
            <p>${a.category}</p>
            <h4>${a.title}</h4>
            <small>${a.student}</small>
          </div>
        </div>
      `).join('')}
      </div>
    </section>
    <section class="page page-colophon">
  <svg class="colophon-ornament" viewBox="0 0 200 60" width="200" opacity="0.7">
    <line x1="0" y1="30" x2="70" y2="30" stroke="#b8963e" stroke-width="0.8"/>
    <polygon points="80,20 95,30 80,40 65,30" fill="none" stroke="#b8963e" stroke-width="0.8"/>
    <polygon points="95,24 110,30 95,36 80,30" fill="#b8963e" fill-opacity="0.4"/>
    <polygon points="110,20 125,30 110,40 95,30" fill="none" stroke="#b8963e" stroke-width="0.8"/>
    <line x1="130" y1="30" x2="200" y2="30" stroke="#b8963e" stroke-width="0.8"/>
  </svg>

  <h1 class="colophon-title">${payload.journalTitle}</h1>
  <p class="colophon-sub">${payload.journalSubtitle} · 2025</p>

  <div class="colophon-grid">
    <div class="colophon-cell">
      <h5>Chủ Biên</h5>
      <p>TS. Nguyễn Minh Anh<br>GV. Trần Phúc Thịnh</p>
    </div>
    <div class="colophon-cell">
      <h5>Năm Xuất Bản</h5>
      <p>Năm Học<br>2024 – 2025</p>
    </div>
    <div class="colophon-cell">
      <h5>Đơn Vị</h5>
      <p>Khoa Thiết Kế<br>Đồ Họa</p>
    </div>
  </div>

  <!-- Final divider ornament -->
  <svg viewBox="0 0 300 40" width="300" style="margin-bottom: 32px; opacity: 0.4;">
    <line x1="0" y1="20" x2="120" y2="20" stroke="#b8963e" stroke-width="0.8"/>
    <circle cx="150" cy="20" r="10" fill="none" stroke="#b8963e" stroke-width="0.8"/>
    <circle cx="150" cy="20" r="4" fill="#b8963e"/>
    <line x1="180" y1="20" x2="300" y2="20" stroke="#b8963e" stroke-width="0.8"/>
  </svg>

  <p class="colophon-closing">Ấn Bản Giới Hạn &nbsp;·&nbsp; Bản Quyền Thuộc Về Khoa Thiết Kế Đồ Họa &nbsp;·&nbsp; MMXXV</p>
</section>

</body>
</html>
`;
}
