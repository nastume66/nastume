from pathlib import Path
import re

base = Path('/Users/nastume/.openclaw/workspace/output/openclaw-en')
src = base / 'openclaw-aialiang-lobster-clean4.html'
out = base / 'openclaw-aialiang-lobster-clean5.html'

html = src.read_text(encoding='utf-8', errors='ignore')

# 标题把“小龙虾”放在 OpenClaw 前面
html = re.sub(r'<h1>.*?</h1>', '<h1>🦞 小龙虾 OpenClaw 从入门到精通</h1>', html, count=1, flags=re.S)

# 删除“最后更新”类行（兼容中文/英文）
html = re.sub(r'<[^>]*>\s*(最后更新|最后修改|Last\s*updated|Updated\s*on)\s*[:：]?.*?</[^>]+>', '', html, flags=re.I)

out.write_text(html, encoding='utf-8')
print(out)
