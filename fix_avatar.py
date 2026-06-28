# -*- coding: utf-8 -*-
import sys
import re

with open('portfolio_system.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"// Determine the other party's name.*?msg\.senderName\?\.replace\([^\)]+\);"

repl = '''if (!avatarUrl && thread.otherAvatarUrl) avatarUrl = thread.otherAvatarUrl;

                // Determine the other party's name
                let displayName = thread.otherName || thread.otherEmail || "Người dùng ẩn danh";
                if (displayName.startsWith("To: ")) displayName = displayName.replace("To: ", "Gửi đến: ");'''

new_content = re.sub(pattern, repl, content, flags=re.DOTALL)

if new_content != content:
    with open('portfolio_system.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS')
else:
    print('FAILED')
