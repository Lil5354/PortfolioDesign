import re

with open(r'C:\Users\Admin\.gemini\antigravity\brain\ba3f4b19-fb58-48b2-8b25-fb18b9df0286\.system_generated\steps\2692\content.md', 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'window\.__INITIAL_STATE__ = (\{.*?\});</script>', html, re.DOTALL)
if m:
    urls = re.findall(r'https://[^\"\'\\]+\.(?:jpg|png|webp)', m.group(1))
    for u in list(set(urls))[:10]:
        print(u)
else:
    print("No JSON")
