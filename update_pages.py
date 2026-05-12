import re

with open('portfolio_system.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

with open('LandingPage.jsx', 'r', encoding='utf-8') as f:
    new_landing = f.read()

# Extract just the function from new_landing
match = re.search(r'(export function LandingPage\(.*?^})', new_landing, re.DOTALL | re.MULTILINE)
if match:
    new_landing_func = match.group(1).replace('export function', 'function')
    
    # Replace in content
    old_landing_match = re.search(r'(function LandingPage\(.*?^})', content, re.DOTALL | re.MULTILINE)
    if old_landing_match:
        content = content.replace(old_landing_match.group(1), new_landing_func)
        
        # Now fix AboutPage
        about_old = """          <div className="rounded-2xl overflow-hidden mb-8 border border-gray-100 shadow-sm flex flex-col">
            <div className="h-20 bg-[#F9A8D4]"></div>
            <div className="h-20 bg-[#93C5FD]"></div>
            <div className="h-20 bg-[#86EFAC]"></div>
            <div className="h-20 bg-[#FDE047]"></div>
          </div>"""
        
        about_new = """          <div className="mb-8">
            <MasonryGrid items={artworks.slice(0, 6)} showHover={true} />
          </div>"""
          
        content = content.replace(about_old, about_new)
        
        with open('portfolio_system.jsx', 'w', encoding='utf-8') as out:
            out.write(content)
        print('Successfully replaced LandingPage and updated AboutPage.')
    else:
        print('Could not find old LandingPage.')
else:
    print('Could not extract new LandingPage.')
