from pathlib import Path
import re

base = Path('/Users/nastume/.openclaw/workspace/output/openclaw-en')
src = base / 'openclaw-aialiang-complete-indexed.html'
out = base / 'openclaw-aialiang-complete-mastery.html'

html = src.read_text(encoding='utf-8', errors='ignore')

# Title/subtitle
html = re.sub(r'<h1>.*?</h1>', '<h1>OpenClaw 从入门到精通</h1>', html, count=1, flags=re.S)
html = re.sub(r'<div class="meta">.*?</div>', '<div class="meta">完整教程 · 结构化学习路径 · 代码/图片/表格保留</div>', html, count=1, flags=re.S)

# Remove numbering in TOC list items and section headings
# TOC links like 1.2 xxx -> xxx
html = re.sub(r'(<a href="#sec-\d+">)\s*\d+\.\d+\s*', r'\1', html)
# Section headings like <h2>1.2 xxx</h2> -> <h2>xxx</h2>
html = re.sub(r'(<h2>)\s*\d+\.\d+\s*', r'\1', html)

# Chapter headings: 第1章 开始指南 -> 开始指南
html = re.sub(r'<h3>第\d+章\s*([^<]+)</h3>', r'<h3>\1</h3>', html)

out.write_text(html, encoding='utf-8')
print(out)
