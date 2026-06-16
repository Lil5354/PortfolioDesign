import zipfile
import re

def extract_text_from_docx(file_path):
    with zipfile.ZipFile(file_path) as docx:
        xml_content = docx.read('word/document.xml').decode('utf-8')
        text = re.sub('<[^>]+>', ' ', xml_content)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

try:
    text = extract_text_from_docx(r'c:\TÀI LIỆU NĂM CUỐI VÀ CV\UEF_Design_Gallery_Final_edited.docx')
    with open(r'c:\TÀI LIỆU NĂM CUỐI VÀ CV\baibao1.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Extracted 1")
except Exception as e:
    print(e)

try:
    text2 = extract_text_from_docx(r'c:\TÀI LIỆU NĂM CUỐI VÀ CV\HTKH.docx')
    with open(r'c:\TÀI LIỆU NĂM CUỐI VÀ CV\baibao2.txt', 'w', encoding='utf-8') as f:
        f.write(text2)
    print("Extracted 2")
except Exception as e:
    print(e)
