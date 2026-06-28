# -*- coding: utf-8 -*-
import sys
import re

with open('UEFGallery.API/Controllers/MessagesController.cs', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"recipientSlug = \"\",\s*senderName = m\.SenderName,"

repl = """recipientSlug = "",
                  senderName = m.SenderName.StartsWith("To: ") 
                               ? "To: " + (_context.Users.Where(u => u.Email == m.SenderEmail).Select(u => u.FullName).FirstOrDefault() ?? m.SenderName.Replace("To: ", "").Trim())
                               : (_context.Users.Where(u => u.Email == m.SenderEmail).Select(u => u.FullName).FirstOrDefault() ?? m.SenderName),"""

new_content = re.sub(pattern, repl, content)

if new_content != content:
    with open('UEFGallery.API/Controllers/MessagesController.cs', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('SUCCESS')
else:
    print('FAILED')
