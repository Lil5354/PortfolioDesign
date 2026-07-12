import sys
with open('portfolio_system.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("getSetting('watermark_text') || getSetting('siteName') || \"UEF\"", "\"UEF\"")
content = content.replace("getSetting('siteName') || ", "")
content = content.replace("getSetting('siteDescription') || ", "")

with open('portfolio_system.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed portfolio_system.jsx")
