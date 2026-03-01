from pathlib import Path
import re

base = Path('/Users/nastume/.openclaw/workspace/output/openclaw-en')
src = base / 'openclaw-aialiang-lobster-clean2.html'
out = base / 'openclaw-aialiang-lobster-clean3.html'

html = src.read_text(encoding='utf-8', errors='ignore')

# Remove all small meta text blocks
html = re.sub(r'<div class="meta">.*?</div>', '', html, flags=re.S)

# Remove breadcrumb/nav fragments that may appear as tiny text in page body
html = re.sub(r'<nav[^>]*>.*?</nav>', '', html, flags=re.S)
html = re.sub(r'<header[^>]*>.*?</header>', '', html, flags=re.S)
html = re.sub(r'<footer[^>]*>.*?</footer>', '', html, flags=re.S)

# Remove likely tiny utility classes if present from source snippets
html = re.sub(r'<[^>]*class="[^"]*(text-xs|text-sm|breadcrumb|prose-sm|opacity-70)[^"]*"[^>]*>.*?</[^>]+>', '', html, flags=re.S)

# Add one clean subtitle under title
html = html.replace('</h1>', '</h1><p style="font-size:16px;color:#333;margin:8px 0 16px;">完整教程版｜仅保留正文、代码、图片与表格</p>', 1)

out.write_text(html, encoding='utf-8')
print(out)
