import re

with open('portfolio_system.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all placeholder={...} and placeholder="..." with empty string on AuthPage and RegisterPage.
# Actually we can just do string replacements safely.
replacements = [
    'placeholder={t("lastNamePlaceholder")}',
    'placeholder={t("firstNamePlaceholder")}',
    'placeholder="example@gmail.com"',
    'placeholder={t("passwordPlaceholder")}',
    'placeholder="09xxxxxxxxx"',
    'placeholder="sv@uef.edu.vn"',
    'placeholder="••••••••"',
]

for r in replacements:
    content = content.replace(r, "")

with open('portfolio_system.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
