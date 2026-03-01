from urllib.request import urlopen
from urllib.parse import urljoin
from html import escape
from pathlib import Path
import re

OUT = Path('/Users/nastume/.openclaw/workspace/output/openclaw-en')
links = [x.strip() for x in (OUT/'tutorial_links.txt').read_text(encoding='utf-8').splitlines() if x.strip()]


def fetch(url):
    return urlopen(url, timeout=40).read().decode('utf-8', errors='ignore')

def absolutize(html, page_url):
    return re.sub(r'(src|href)="([^"]+)"', lambda m: f'{m.group(1)}="{urljoin(page_url,m.group(2))}"', html)

sections=[]
failed=[]
for i,url in enumerate(links,1):
    try:
        page=fetch(url)
        m_title = re.search(r'<h1[^>]*>(.*?)</h1>', page, flags=re.S)
        title = re.sub('<[^<]+?>','',m_title.group(1)).strip() if m_title else f'Page {i}'
        m = re.search(r'<article[^>]*>(.*?)</article>', page, flags=re.S)
        if not m:
            m = re.search(r'<main[^>]*>(.*?)</main>', page, flags=re.S)
        body = m.group(1) if m else page
        # remove nav/footer inside body
        body = re.sub(r'<nav[^>]*>.*?</nav>', '', body, flags=re.S)
        body = re.sub(r'<button[^>]*>\s*复制\s*</button>', '', body, flags=re.S)
        body = re.sub(r'<script[^>]*>.*?</script>', '', body, flags=re.S)
        body = absolutize(body, url)
        sections.append((title,url,body))
    except Exception as e:
        failed.append((url,str(e)))

parts=[]
parts.append('<!doctype html><html><head><meta charset="utf-8"><title>OpenClaw 教程全集</title>')
parts.append('''<style>
body{font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;line-height:1.7;color:#111;margin:0;background:#fff}
.wrap{max-width:980px;margin:0 auto;padding:30px}
h1{font-size:34px;margin:0 0 8px}
.meta{color:#666;margin-bottom:16px}
.toc{background:#f6f8fa;border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;margin:18px 0 26px}
.section{margin:36px 0 54px;page-break-inside:avoid}
.section h2{font-size:25px;border-bottom:1px solid #ececec;padding-bottom:8px}
img{max-width:100%;height:auto;border:1px solid #eee;border-radius:6px;margin:8px 0}
pre{background:#0f172a;color:#e5e7eb;padding:12px;border-radius:8px;overflow:auto;font-size:12px;line-height:1.5}
code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:7px 8px}
</style></head><body><div class="wrap">''')
parts.append('<h1>OpenClaw 完整教程（按左侧目录）</h1>')
parts.append(f'<div class="meta">页面数：{len(sections)} | 代码块与图片保留</div>')
parts.append('<div class="toc"><b>目录</b><ol>')
for i,(title,_,_) in enumerate(sections,1):
    parts.append(f'<li><a href="#s{i}">{escape(title)}</a></li>')
parts.append('</ol></div>')

for i,(title,url,body) in enumerate(sections,1):
    parts.append(f'<div class="section" id="s{i}"><h2>{i}. {escape(title)}</h2><div class="meta">{escape(url)}</div>{body}</div>')

if failed:
    parts.append('<h2>Failed Pages</h2><ul>')
    for u,e in failed:
        parts.append(f'<li>{escape(u)} - {escape(e)}</li>')
    parts.append('</ul>')

parts.append('</div></body></html>')

html_path = OUT/'openclaw-aialiang-complete.html'
html_path.write_text(''.join(parts),encoding='utf-8')
(OUT/'openclaw-aialiang-failed.txt').write_text('\n'.join([f'{u} | {e}' for u,e in failed]),encoding='utf-8')
print(html_path)
print('sections',len(sections),'failed',len(failed))