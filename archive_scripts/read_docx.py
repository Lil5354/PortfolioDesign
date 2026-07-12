import zipfile
import xml.etree.ElementTree as ET
import sys

def read_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.XML(xml_content)
            
            # The XML namespaces usually used in word documents
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            # Extract text from all <w:t> elements
            texts = tree.findall('.//w:t', namespaces)
            return ' '.join([t.text for t in texts if t.text])
    except Exception as e:
        return f"Error: {e}"

if __name__ == '__main__':
    file_path = sys.argv[1]
    with open('output_docx.txt', 'w', encoding='utf-8') as f:
        f.write(read_docx(file_path))
