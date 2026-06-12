import sys
import re

file_path = r'c:\TÀI LIỆU NĂM CUỐI VÀ CV\prototype\portfolio_system.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix tags rendering
content = re.sub(
    r'\{art\.tags\?\.map\(t => \(\s*<span key=\{t\.id\}(.*?)>\s*\{t\.name\}\s*</span>\s*\)\)\}',
    r'{art.tags?.map((t, i) => (\n                  <span key={i}\g<1>>\n                    {t}\n                  </span>\n                ))}',
    content
)

# Fix tools rendering
content = re.sub(
    r'<div style=\{\{ display: "flex", gap: 8 \}\}>\s*<span style=\{\{ background: "#F5F5F5", padding: "6px 12px", borderRadius: 4, fontSize: 13, fontWeight: 500 \}\}>Figma</span>\s*<span style=\{\{ background: "#F5F5F5", padding: "6px 12px", borderRadius: 4, fontSize: 13, fontWeight: 500 \}\}>Photoshop</span>\s*</div>',
    r'''<div style={{ display: "flex", gap: 8 }}>
                {art.toolsUsed?.map((tool, i) => (
                  <span key={i} style={{ background: "#F5F5F5", padding: "6px 12px", borderRadius: 4, fontSize: 13, fontWeight: 500 }}>{tool}</span>
                ))}
              </div>''',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
