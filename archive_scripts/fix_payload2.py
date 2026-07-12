# -*- coding: utf-8 -*-
import sys
import re

with open('portfolio_system.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"purpose: thread\.purpose,\s*content: JSON\.stringify\(\{\s*\.\.\.thread\.artworkData,\s*description: text,\s*\}\),"

repl = '''purpose: "message",
          content: text,'''

new_content = re.sub(pattern, repl, content, flags=re.DOTALL)

if new_content != content:
    with open('portfolio_system.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS')
else:
    print('FAILED')
