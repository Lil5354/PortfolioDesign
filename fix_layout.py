import sys

file_path = r'c:\TÀI LIỆU NĂM CUỐI VÀ CV\prototype\portfolio_system.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix img.imageUrl to img
content = content.replace('src={img.imageUrl}', 'src={img}')

# Move header block to below images block
header_block = """          {/* Header trong */}
          <div style={{ padding: "32px 40px" }}>
            <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#191919", margin: "0 0 16px 0" }}>{art.title}</h1>
            <p style={{ fontSize: 15, color: "#696969", lineHeight: 1.6, margin: 0 }}>{art.description}</p>
          </div>"""

content = content.replace(header_block + '\n\n', '')

tags_marker = """          {/* Dưới ảnh: Tag & Tool */}"""
if tags_marker in content:
    content = content.replace(tags_marker, header_block + '\n\n' + tags_marker)

# For safety, in case there were no \n\n, let's also try just exact replace
if "Header trong" not in content and header_block in content:
    content = content.replace(header_block, '')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
