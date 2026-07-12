# -*- coding: utf-8 -*-
import sys
import re

with open('components/MessageDropdown.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"content: \(activeChat\.purpose ===.*?purpose:.*?,"

repl = '''content: selectedAttachment
                   ? JSON.stringify({ 
                       description: replyText, 
                       artworkId: selectedAttachment.id,
                       artworkTitle: selectedAttachment.title,
                       artworkImage: selectedAttachment.coverImageUrl || selectedAttachment.coverUrl,
                       attachedArtwork: {
                           artworkId: selectedAttachment.id,
                           title: selectedAttachment.title,
                           coverUrl: selectedAttachment.coverImageUrl || selectedAttachment.coverUrl
                       }
                     })
                   : replyText,
          purpose: selectedAttachment ? "feedback" : "message",'''

new_content = re.sub(pattern, repl, content, flags=re.DOTALL)

if new_content != content:
    with open('components/MessageDropdown.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS')
else:
    print('FAILED')
