import zipfile, re
with zipfile.ZipFile('MINISTRY OF EDUCATION AND TRAINING.docx') as docx:
    xml_content = docx.read('word/document.xml').decode('utf-8')
    text = re.sub('<w:p[^>]*>', '\n', xml_content)
    text = re.sub('<[^>]+>', '', text)
    with open('ministry_extracted.txt', 'w', encoding='utf-8') as f:
        f.write(text)
