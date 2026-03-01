from pathlib import Path
import re

base = Path('/Users/nastume/.openclaw/workspace/output/openclaw-en')
src = base / 'openclaw-aialiang-complete-mastery.html'
out = base / 'openclaw-aialiang-lobster.html'

html = src.read_text(encoding='utf-8', errors='ignore')

html = re.sub(r'<h1>.*?</h1>', '<h1>🦞 小龙虾带你玩转 OpenClaw</h1>', html, count=1, flags=re.S)
html = re.sub(r'<div class="meta">.*?</div>', '<div class="meta">从 0 到 1 搭建你的 AI 助手 · 跟着小龙虾，一路开挂</div>', html, count=1, flags=re.S)

out.write_text(html, encoding='utf-8')
print(out)
