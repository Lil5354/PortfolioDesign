# -*- coding: utf-8 -*-
import sys

with open('portfolio_system.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """      const outboxMsg = {
        ...newMsgData,
        senderName: `To: ${recipientSlug}`,
        isRead: true
      };"""

replacement = """      const outboxMsg = {
        ...newMsgData,
        senderName: `To: ${recipientSlug}`,
        recipientSlug: recipientSlug,
        isRead: true
      };"""

new_content = content.replace(target, replacement)

if new_content != content:
    with open('portfolio_system.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS')
else:
    print('FAILED')
