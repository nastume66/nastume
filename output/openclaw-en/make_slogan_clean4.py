from pathlib import Path
import re

base = Path('/Users/nastume/.openclaw/workspace/output/openclaw-en')
src = base / 'openclaw-aialiang-lobster-clean3.html'
out = base / 'openclaw-aialiang-lobster-clean4.html'

html = src.read_text(encoding='utf-8', errors='ignore')

# remove previous subtitle line if present
html = re.sub(r'<p style="font-size:16px;color:#333;margin:8px 0 16px;">.*?</p>', '', html, flags=re.S)

# add slogan line only
html = html.replace('</h1>', '</h1><p style="font-size:16px;color:#2b2b2b;margin:8px 0 16px;">你的 24 小时个人助理养成手册</p>', 1)

out.write_text(html, encoding='utf-8')
print(out)
