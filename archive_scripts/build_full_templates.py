import os
import re

def process_asymmetrical():
    with open('tapsan_anpham_thietke.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Escape backticks first
    html = html.replace('`', '\\`')

    # Replace CSS variables
    html = re.sub(r'--ink:\s*#[0-9a-fA-F]+;', r'--ink: ${payload.backgroundColor};', html)
    html = re.sub(r'--cream:\s*#[0-9a-fA-F]+;', r'--cream: ${payload.textColor};', html)
    html = re.sub(r'--gold:\s*#[0-9a-fA-F]+;', r'--gold: ${payload.primaryColor};', html)
    html = re.sub(r'--crimson:\s*#[0-9a-fA-F]+;', r'--crimson: ${payload.secondaryColor};', html)

    html = re.sub(r'font-family:\s*\\?\'Playfair Display\\?\',\s*serif;', r"font-family: '${payload.headingFont}', serif;", html)
    html = re.sub(r'font-family:\s*\\?\'Cormorant Garamond\\?\',\s*serif;', r"font-family: '${payload.bodyFont}', serif;", html)
    html = re.sub(r'font-family:\s*\\?\'Space Mono\\?\',\s*monospace;', r"font-family: '${payload.monoFont}', monospace;", html)

    html = html.replace('>GRAPHICA<', '>${payload.journalTitle}<')
    html = html.replace('Triển Lãm Đồ Họa Thường Niên — Xuất Bản Số VII', '${payload.journalSubtitle}')
    html = html.replace('Khoa Mỹ Thuật Ứng Dụng &nbsp;·&nbsp; Năm Học 2024 – 2025', '${payload.departmentName} &nbsp;&middot;&nbsp; ${payload.academicYear}')
    html = html.replace('VII &middot; 2025', '${payload.editionNumber} &middot; 2025')
    html = html.replace('<div class="cover-bg-letter">G</div>', '<div class="cover-bg-letter">${payload.bgLetter || \'G\'}</div>')

    foreword_pattern = r'(<div class="body-text">).*?(</div>\s*<div class="divider">)'
    html = re.sub(foreword_pattern, r'\1${payload.forewordText}\2', html, flags=re.DOTALL)

    closing_start = html.find('<section class="page page-closing"')
    
    spreads_template = r"""
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
    """
    
    html = html[:closing_start] + spreads_template + html[closing_start:]

    js_content = f"""export function renderAsymmetrical(payload, artworks) {{\n  return `{html}`;\n}}\n"""
    with open('components/catalog/templates/asymmetrical.js', 'w', encoding='utf-8') as f:
        f.write(js_content)


def process_classic():
    with open('tapsan_classic.html', 'r', encoding='utf-8') as f:
        html = f.read()

    html = html.replace('`', '\\`')

    html = re.sub(r'--ivory:\s*#[0-9a-fA-F]+;', r'--ivory: ${payload.backgroundColor};', html)
    html = re.sub(r'--ink:\s*#[0-9a-fA-F]+;', r'--ink: ${payload.textColor};', html)
    html = re.sub(r'--gold:\s*#[0-9a-fA-F]+;', r'--gold: ${payload.primaryColor};', html)
    html = re.sub(r'--rust:\s*#[0-9a-fA-F]+;', r'--rust: ${payload.secondaryColor};', html)

    html = re.sub(r'font-family:\s*\\?\'IM Fell English\\?\',\s*serif;', r"font-family: '${payload.headingFont}', serif;", html)
    html = re.sub(r'font-family:\s*\\?\'Libre Baskerville\\?\',\s*serif;', r"font-family: '${payload.bodyFont}', serif;", html)
    html = re.sub(r'font-family:\s*\\?\'Josefin Sans\\?\',\s*sans-serif;', r"font-family: '${payload.monoFont}', sans-serif;", html)

    html = html.replace('>FORMA<', '>${payload.journalTitle}<')
    html = html.replace('Tập San Ấn Phẩm Thiết Kế Đồ Họa', '${payload.journalSubtitle}')
    
    colophon_start = html.find('<section class="page page-colophon"')
    
    spreads_template = r"""
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
    """
    
    html = html[:colophon_start] + spreads_template + html[colophon_start:]
    
    js_content = f"""export function renderClassic(payload, artworks) {{\n  return `{html}`;\n}}\n"""
    with open('components/catalog/templates/classic.js', 'w', encoding='utf-8') as f:
        f.write(js_content)


def process_modern():
    with open('tapsan_modern.html', 'r', encoding='utf-8') as f:
        html = f.read()

    html = html.replace('`', '\\`')

    html = re.sub(r'--black:\s*#[0-9a-fA-F]+;', r'--black: ${payload.backgroundColor};', html)
    html = re.sub(r'--white:\s*#[0-9a-fA-F]+;', r'--white: ${payload.textColor};', html)
    html = re.sub(r'--accent:\s*#[0-9a-fA-F]+;', r'--accent: ${payload.primaryColor};', html)
    html = re.sub(r'--accent2:\s*#[0-9a-fA-F]+;', r'--accent2: ${payload.secondaryColor};', html)

    html = re.sub(r'font-family:\s*\\?\'Barlow Condensed\\?\',\s*sans-serif;', r"font-family: '${payload.headingFont}', sans-serif;", html)
    html = re.sub(r'font-family:\s*\\?\'Barlow\\?\',\s*sans-serif;', r"font-family: '${payload.bodyFont}', sans-serif;", html)
    html = re.sub(r'font-family:\s*\\?\'IBM Plex Mono\\?\',\s*monospace;', r"font-family: '${payload.monoFont}', monospace;", html)

    html = html.replace('>ĐỒ HỌA MỚI<', '>${payload.journalTitle}<')
    
    colophon_start = html.find('<section class="page page-closing"')
    
    spreads_template = r"""
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
    """
    
    html = html[:colophon_start] + spreads_template + html[colophon_start:]
    
    js_content = f"""export function renderModern(payload, artworks) {{\n  return `{html}`;\n}}\n"""
    with open('components/catalog/templates/modern.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

process_asymmetrical()
process_classic()
process_modern()
print("Templates perfectly generated with syntax fix.")
