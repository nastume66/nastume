from pathlib import Path
import re

base = Path('/Users/nastume/.openclaw/workspace/output/openclaw-en')
src = base / 'openclaw-aialiang-complete.html'
out = base / 'openclaw-aialiang-complete-clean.html'

html = src.read_text(encoding='utf-8', errors='ignore')

# 1) Remove per-section URL meta lines
html = re.sub(r'<div class="meta">https?://[^<]+</div>', '', html)

# 2) Replace top header/meta with cleaner cover
html = re.sub(r'<h1>.*?</h1>', '<h1>OpenClaw 教程合集（整理版）</h1>', html, count=1, flags=re.S)
html = re.sub(r'<div class="meta">页面数：[^<]+</div>', '<div class="meta">按目录整理 · 适合连续阅读 · 仅学习交流</div>', html, count=1)

# 3) Add simple copyright page block after header
insert = '''
<div style="margin:16px 0 24px;padding:14px 16px;border:1px solid #e5e7eb;border-radius:10px;background:#fafafa;">
  <div style="font-weight:600;margin-bottom:6px;">使用说明</div>
  <div style="color:#444;line-height:1.7;">本资料为公开教程内容整理版，仅用于学习与交流，不代表官方发布，不构成商业授权。</div>
</div>
'''
html = html.replace('<div class="toc">', insert + '<div class="toc">', 1)

# 4) Slightly improve readability
html = html.replace('line-height:1.7', 'line-height:1.8')
html = html.replace('max-width:980px', 'max-width:1000px')
html = html.replace('font-size:25px', 'font-size:24px')

out.write_text(html, encoding='utf-8')
print(out)
