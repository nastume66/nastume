from urllib.request import urlopen
from urllib.parse import urljoin
from html import escape
import re
from pathlib import Path

START = 'https://openclaw.aialiang.com/tutorial/start-openclaw.html'
BASE = 'https://openclaw.aialiang.com/tutorial/'
OUT = Path('/Users/nastume/.openclaw/workspace/output/openclaw-en')
OUT.mkdir(parents=True, exist_ok=True)


def fetch(url):
    return urlopen(url, timeout=30).read().decode('utf-8', errors='ignore')

index_html = fetch(START)

# collect left-nav links from this page
hrefs = re.findall(r'href="([^"]+\.html)"', index_html)
links = []
seen = set()
for h in hrefs:
    full = urljoin(START, h)
    if '/tutorial/' not in full:
        continue
    if full in seen:
        continue
    seen.add(full)
    links.append(full)

# keep order from sidebar; ensure start page first
if START in links:
    links.remove(START)
links = [START] + links


def clean_html_block(block, page_url):
    # remove copy buttons/scripts
    block = re.sub(r'<button[^>]*>\s*复制\s*</button>', '', block, flags=re.S)
    block = re.sub(r'<script[^>]*>.*?</script>', '', block, flags=re.S)
    # absolutize src/href
    block = re.sub(r'(src|href)="([^"]+)"', lambda m: f'{m.group(1)}="{urljoin(page_url, m.group(2))}"', block)
    return block

sections = []
fail = []
for i, url in enumerate(links, 1):
    try:
        html = fetch(url)
        # title from h1
        m_h1 = re.search(r'<h1[^>]*>(.*?)</h1>', html, flags=re.S)
        title = re.sub('<[^<]+?>', '', m_h1.group(1)).strip() if m_h1 else f'Page {i}'
        # article content
        m_article = re.search(r'<article[^>]*>(.*?)</article>', html, flags=re.S)
        if m_article:
            body = m_article.group(1)
        else:
            m_main = re.search(r'<main[^>]*>(.*?)</main>', html, flags=re.S)
            body = m_main.group(1) if m_main else html
        body = clean_html_block(body, url)
        sections.append((title, url, body))
    except Exception as e:
        fail.append((url, str(e)))

out_html = OUT / 'openclaw-aialiang-full-tutorial.html'
manifest = OUT / 'openclaw-aialiang-manifest.txt'

parts = []
parts.append('<!doctype html><html><head><meta charset="utf-8">')
parts.append('<title>OpenClaw Tutorial Complete PDF Source</title>')
parts.append('''<style>
body{font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif; line-height:1.7; color:#111; margin:0}
.wrap{max-width:960px; margin:0 auto; padding:28px}
h1{font-size:34px; margin-bottom:8px}
.meta{color:#666; margin-bottom:18px}
.toc{background:#f6f8fa; border:1px solid #e5e7eb; border-radius:8px; padding:14px 18px; margin-bottom:22px}
.section{margin:34px 0 48px; page-break-inside:avoid}
.section h2{font-size:26px; border-bottom:1px solid #eee; padding-bottom:8px}
img{max-width:100%; height:auto; border:1px solid #eee; border-radius:6px; margin:8px 0}
pre{background:#0f172a; color:#e5e7eb; padding:12px; border-radius:8px; overflow:auto; font-size:12px; line-height:1.5}
code{font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
table{border-collapse:collapse; width:100%}
th,td{border:1px solid #ddd; padding:6px 8px}
</style></head><body><div class="wrap">''')
parts.append('<h1>OpenClaw 完整教程</h1>')
parts.append(f'<div class="meta">来源：{escape(BASE)} ｜ 页面总数：{len(sections)} ｜ 代码块和图片保留</div>')
parts.append('<div class="toc"><b>目录</b><ol>')
for i, (title, url, _) in enumerate(sections,1):
    parts.append(f'<li><a href="#sec-{i}">{escape(title)}</a></li>')
parts.append('</ol></div>')
for i, (title, url, body) in enumerate(sections,1):
    parts.append(f'<div class="section" id="sec-{i}">')
    parts.append(f'<h2>{i}. {escape(title)}</h2>')
    parts.append(f'<div class="meta">{escape(url)}</div>')
    parts.append(body)
    parts.append('</div>')
parts.append('</div></body></html>')

out_html.write_text(''.join(parts), encoding='utf-8')
manifest.write_text('\n'.join([f'{i}. {t} | {u}' for i,(t,u,_) in enumerate(sections,1)] + ['','FAILED:'] + [f'{u} | {e}' for u,e in fail]), encoding='utf-8')

print(out_html)
print(manifest)
print('sections', len(sections), 'failed', len(fail))