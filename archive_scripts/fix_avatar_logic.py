# -*- coding: utf-8 -*-
import sys
import re

with open('components/MessageDropdown.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    const otherEmail = msg.recipientSlug || msg.senderEmail || "uef-design-gallery";
    const otherAvatarUrl = isMe ? msg.recipientAvatarUrl : msg.senderAvatarUrl;"""

replacement = """    const otherEmail = msg.recipientSlug || msg.senderEmail || "uef-design-gallery";
    const otherAvatarUrl = msg.senderAvatarUrl;"""

new_content = content.replace(target, replacement)

if new_content != content:
    with open('components/MessageDropdown.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS MessageDropdown')
else:
    print('FAILED MessageDropdown')

with open('portfolio_system.jsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

target2 = """      const otherEmail = msg.recipientSlug || msg.senderEmail || "uef-design-gallery";
      const otherAvatarUrl = isMe ? msg.recipientAvatarUrl : msg.senderAvatarUrl;"""

replacement2 = """      const otherEmail = msg.recipientSlug || msg.senderEmail || "uef-design-gallery";
      const otherAvatarUrl = msg.senderAvatarUrl;"""

new_content2 = content2.replace(target2, replacement2)

if new_content2 != content2:
    with open('portfolio_system.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content2)
    print('SUCCESS portfolio_system')
else:
    print('FAILED portfolio_system')
