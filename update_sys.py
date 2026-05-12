import sys
import re

# Read secondary screens file
with open('portfolio-secondary-screens.jsx', 'r', encoding='utf-8') as f:
    sec_content = f.read()

# Extract AboutPage
about_page_match = re.search(r'(export function AboutPage.*?^})', sec_content, re.DOTALL | re.MULTILINE)
if not about_page_match:
    about_page_match = re.search(r'(function AboutPage.*?^})', sec_content, re.DOTALL | re.MULTILINE)

about_page_code = about_page_match.group(1)

# Ensure it is not exported since in portfolio_system.jsx it's just 'function AboutPage'
about_page_code = about_page_code.replace('export function AboutPage', 'function AboutPage')

# Read portfolio_system.jsx
with open('portfolio_system.jsx', 'r', encoding='utf-8') as f:
    sys_content = f.read()

# Replace AboutPage in portfolio_system.jsx
sys_content = re.sub(r'function AboutPage\(\) \{.*?^\}', about_page_code, sys_content, flags=re.DOTALL | re.MULTILINE)

# Add imports for LecturerCard and MajorCard at the top if not present
imports_to_add = "import { LecturerCard } from './components/ui/LecturerCard';\nimport { MajorCard } from './components/ui/MajorCard';\n"
if 'LecturerCard' not in sys_content:
    sys_content = sys_content.replace('import { useState, useRef, useEffect } from "react";', 
                                      'import { useState, useRef, useEffect } from "react";\n' + imports_to_add)

# Add shortcut in PortalPage
shortcut = """            <div onClick={() => setPage("about")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Globe size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Giới thiệu (About)</h3>
              </div>
              <p className="text-[#666666] text-xs">Trang thông tin về Khoa và giảng viên</p>
            </div>"""
            
sys_content = sys_content.replace('Trang Gallery Tổng hợp</h3>\n              </div>\n              <p className="text-[#666666] text-xs">Hiển thị toàn bộ tác phẩm trên hệ thống</p>\n            </div>', 
                                  'Trang Gallery Tổng hợp</h3>\n              </div>\n              <p className="text-[#666666] text-xs">Hiển thị toàn bộ tác phẩm trên hệ thống</p>\n            </div>\n' + shortcut)

with open('portfolio_system.jsx', 'w', encoding='utf-8') as f:
    f.write(sys_content)
print('Done!')
