# -*- coding: utf-8 -*-
import sys
import re

with open('components/MessageDropdown.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    const isMe = msg.senderEmail === userData?.email || msg.senderName?.startsWith("To: ");
    const otherEmail = isMe ? (msg.recipientSlug || "uef-design-gallery") : (msg.senderEmail || "uef-design-gallery");
    const otherAvatarUrl = isMe ? msg.recipientAvatarUrl : msg.senderAvatarUrl;"""

replacement = """    const isMe = msg.senderName?.startsWith("To: ");
    const otherEmail = msg.recipientSlug || msg.senderEmail || "uef-design-gallery";
    const otherAvatarUrl = isMe ? msg.recipientAvatarUrl : msg.senderAvatarUrl;"""

new_content = content.replace(target, replacement)

if new_content != content:
    with open('components/MessageDropdown.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS MessageDropdown')
else:
    print('FAILED MessageDropdown')


with open('portfolio_system.jsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

target2 = """      const isMe = msg.senderEmail === user?.email || msg.senderName?.startsWith("To: ");
      const otherEmail = isMe ? (msg.recipientSlug || "uef-design-gallery") : (msg.senderEmail || "uef-design-gallery");
      const otherAvatarUrl = isMe ? msg.recipientAvatarUrl : msg.senderAvatarUrl;
      const otherName = isMe ? msg.recipientSlug : msg.senderName;"""

replacement2 = """      const isMe = msg.senderName?.startsWith("To: ");
      const otherEmail = msg.recipientSlug || msg.senderEmail || "uef-design-gallery";
      const otherAvatarUrl = isMe ? msg.recipientAvatarUrl : msg.senderAvatarUrl;
      const otherName = isMe ? (msg.recipientSlug || msg.senderName) : msg.senderName;"""

new_content2 = content2.replace(target2, replacement2)

if new_content2 != content2:
    with open('portfolio_system.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content2)
    print('SUCCESS portfolio_system')
else:
    print('FAILED portfolio_system')

