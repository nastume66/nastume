from urllib.request import urlopen
from urllib.parse import urljoin
from html import escape
from pathlib import Path
import re

OUT = Path('/Users/nastume/.openclaw/workspace/output/openclaw-en')
links = [x.strip() for x in (OUT/'tutorial_links.txt').read_text(encoding='utf-8').splitlines() if x.strip()]

CHAPTER_NAMES = {
    1:'开始指南',2:'帮助中心',3:'安装与更新',4:'CLI命令行',5:'核心概念',6:'网关与运维',
    7:'Web界面',8:'通讯渠道',9:'模型提供商',10:'自动化与钩子',11:'工具与技能',
    12:'节点与媒体',13:'平台支持',14:'macOS伴侣应用',15:'参考与模板'
}

def fetch(url):
    return urlopen(url, timeout=45).read().decode('utf-8', errors='ignore')

def abs_url(u, base):
    return urljoin(base, u)

rows=[]
failed=[]
for i,url in enumerate(links,1):
    try:
        page=fetch(url)
        m_h1 = re.search(r'<h1[^>]*>(.*?)</h1>', page, flags=re.S)
        h1 = re.sub('<[^<]+?>','',m_h1.group(1)).strip() if m_h1 else f'{i}. 未命名'
        m = re.search(r'<article[^>]*>(.*?)</article>', page, flags=re.S)
        if not m:
            m = re.search(r'<main[^>]*>(.*?)</main>', page, flags=re.S)
        body = m.group(1) if m else page
        rows.append({'url':url,'h1':h1,'body':body})
    except Exception as e:
        failed.append((url,str(e)))

# map anchors
for i,r in enumerate(rows,1):
    r['anchor']=f'sec-{i}'
url2anchor={r['url']:r['anchor'] for r in rows}

# parse numbering from h1 like 1.2 xxx
num_re = re.compile(r'^(\d+)\.(\d+)\s*(.*)$')
for r in rows:
    m=num_re.match(r['h1'])
    if m:
        r['ch']=int(m.group(1)); r['sub']=int(m.group(2)); r['title']=m.group(3).strip() or r['h1']
    else:
        r['ch']=0; r['sub']=0; r['title']=r['h1']

# rewrite links in body to internal anchors; keep assets absolute
for r in rows:
    body = r['body']
    body = re.sub(r'<button[^>]*>\s*复制\s*</button>', '', body, flags=re.S)
    body = re.sub(r'<script[^>]*>.*?</script>', '', body, flags=re.S)
    body = re.sub(r'<nav[^>]*>.*?</nav>', '', body, flags=re.S)

    def repl(m):
        attr, val = m.group(1), m.group(2)
        full = abs_url(val, r['url'])
        if attr=='href' and full in url2anchor:
            return f'href="#{url2anchor[full]}"'
        return f'{attr}="{full}"'

    body = re.sub(r'(src|href)="([^"]+)"', repl, body)
    r['body']=body

# build chapter grouped toc
chapters={}
for r in rows:
    chapters.setdefault(r['ch'],[]).append(r)

parts=[]
parts.append('<!doctype html><html><head><meta charset="utf-8"><title>OpenClaw 教程全集（目录编号版）</title>')
parts.append('''<style>
@page { size: A4; margin: 18mm 14mm; }
body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;line-height:1.72;color:#111;margin:0;background:#fff}
.wrap{max-width:980px;margin:0 auto;padding:24px}
h1{font-size:32px;margin:0 0 8px}
.meta{color:#666;margin-bottom:14px}
.toc{background:#f6f8fa;border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;margin:16px 0 24px}
.toc h3{margin:12px 0 6px;font-size:18px}
.toc a{text-decoration:none;color:#0b57d0}
.section{margin:28px 0 44px;page-break-inside:avoid}
.section h2{font-size:24px;border-bottom:1px solid #ececec;padding-bottom:8px}
img{max-width:100%;height:auto;border:1px solid #eee;border-radius:6px;margin:8px 0}
pre{background:#0f172a;color:#e5e7eb;padding:12px;border-radius:8px;overflow:auto;font-size:12px;line-height:1.5}
code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:7px 8px}
</style></head><body><div class="wrap">''')
parts.append('<h1>OpenClaw 完整教程（目录编号版）</h1>')
parts.append('<div class="meta">按网站左侧目录结构整理；代码块、图片、表格保留；目录链接跳转到PDF内部章节</div>')
parts.append('<div class="toc"><b>目录</b>')
for ch in sorted([k for k in chapters.keys() if k>0]):
    cname=CHAPTER_NAMES.get(ch, f'第{ch}章')
    parts.append(f'<h3>第{ch}章 {escape(cname)}</h3><ol>')
    for r in sorted(chapters[ch], key=lambda x:x['sub']):
        label=f"{ch}.{r['sub']} {r['title']}"
        parts.append(f'<li><a href="#{r["anchor"]}">{escape(label)}</a></li>')
    parts.append('</ol>')
parts.append('</div>')

for r in rows:
    label = f"{r['ch']}.{r['sub']} {r['title']}" if r['ch']>0 else r['h1']
    parts.append(f'<div class="section" id="{r["anchor"]}"><h2>{escape(label)}</h2>{r["body"]}</div>')

if failed:
    parts.append('<h2>Failed Pages</h2><ul>')
    for u,e in failed:
        parts.append(f'<li>{escape(u)} - {escape(e)}</li>')
    parts.append('</ul>')

parts.append('</div></body></html>')

html_path=OUT/'openclaw-aialiang-complete-indexed.html'
html_path.write_text(''.join(parts),encoding='utf-8')
(OUT/'openclaw-aialiang-indexed-failed.txt').write_text('\n'.join([f'{u} | {e}' for u,e in failed]),encoding='utf-8')
print(html_path)
print('sections',len(rows),'failed',len(failed))