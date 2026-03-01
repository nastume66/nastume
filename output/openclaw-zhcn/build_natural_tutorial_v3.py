from pathlib import Path
import re
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

BASE = Path('/Users/nastume/.nvm/versions/node/v24.13.0/lib/node_modules/openclaw/docs/zh-CN')
OUT = Path('/Users/nastume/.openclaw/workspace/output/openclaw-zhcn')
OUT.mkdir(parents=True, exist_ok=True)

SECTIONS = [
    ('start', '第一章：快速开始'),
    ('install', '第二章：安装与部署'),
    ('channels', '第三章：消息渠道接入'),
    ('providers', '第四章：模型与提供商配置'),
    ('tools', '第五章：工具体系与调用'),
    ('cli', '第六章：命令行实战'),
    ('automation', '第七章：自动化与定时任务'),
    ('nodes', '第八章：节点能力与远程设备'),
    ('web', '第九章：Web 与控制面板'),
    ('platforms', '第十章：平台专项说明'),
]


def collect_files(section_dir: str):
    p = BASE / section_dir
    if not p.exists():
        return []
    files = [x for x in p.rglob('*') if x.is_file() and x.suffix.lower() in {'.md', '.mdx'}]
    files = [x for x in files if x.name.lower() not in {'readme.md', 'index.mdx'}]
    return sorted(files, key=lambda x: x.as_posix())


def cleanup(text: str) -> list:
    text = re.sub(r'^---\n.*?\n---\n', '', text, flags=re.S)
    lines = []
    in_code = False
    for raw in text.splitlines():
        s = raw.rstrip()
        t = s.strip()
        if t.startswith('```'):
            in_code = not in_code
            continue
        if t.startswith(('import ', 'export ')):
            continue
        if not t:
            lines.append(('blank',''))
            continue
        if in_code:
            lines.append(('code', s))
            continue

        if t.startswith('# '):
            lines.append(('h1', t[2:].strip())); continue
        if t.startswith('## '):
            lines.append(('h2', t[3:].strip())); continue
        if t.startswith('### '):
            lines.append(('h3', t[4:].strip())); continue

        if re.match(r'^[-*+]\s+', t):
            t = '• ' + re.sub(r'^[-*+]\s+', '', t)
        if re.match(r'^\d+\.\s+', t):
            t = '• ' + re.sub(r'^\d+\.\s+', '', t)

        t = re.sub(r'^>\s*', '', t)
        t = re.sub(r'!\[([^\]]*)\]\([^\)]*\)', r'\1', t)
        t = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'\1', t)
        t = re.sub(r'https?://\S+', '', t)
        t = re.sub(r'`([^`]+)`', r'\1', t)
        t = t.replace('**', '').replace('__', '').replace('*', '')

        # remove website-ish labels
        for bad in ['docs/zh-CN', 'mintlify', 'docs.json', 'OpenClaw docs', '官方文档链接', '文档站点']:
            t = t.replace(bad, '')

        t = t.strip()
        if t:
            lines.append(('p', t))

    # collapse duplicate blanks
    compact = []
    prev_blank = True
    for k,v in lines:
        if k == 'blank':
            if not prev_blank:
                compact.append((k,v))
            prev_blank = True
        else:
            compact.append((k,v))
            prev_blank = False
    return compact


def first_title(text: str, fallback: str):
    m = re.search(r'^#\s+(.+)$', text, flags=re.M)
    if m:
        return m.group(1).strip()
    return fallback.replace('-', ' ').replace('_', ' ').strip()

chapters = []
for sec_dir, sec_name in SECTIONS:
    files = collect_files(sec_dir)
    if not files:
        continue
    docs = []
    for f in files:
        raw = f.read_text(encoding='utf-8', errors='ignore')
        title = first_title(raw, f.stem)
        blocks = cleanup(raw)
        if blocks:
            docs.append((title, blocks))
    if docs:
        chapters.append((sec_name, docs))

# output markdown (natural tutorial)
md = []
md.append('# OpenClaw 中文实战教程')
md.append('')
md.append('这是一份连续阅读版本的教程，按学习路径组织：从入门到部署、从渠道到工具、从命令行到自动化。')
md.append('')
md.append('## 学习路线')
for i, (cname, docs) in enumerate(chapters, 1):
    md.append(f'{i}. {cname}（{len(docs)}节）')
md.append('')

for cname, docs in chapters:
    md.append(f'\n# {cname}\n')
    for i, (title, blocks) in enumerate(docs, 1):
        md.append(f'## {i}. {title}')
        for k, v in blocks:
            if k == 'blank':
                md.append('')
            elif k == 'h1':
                md.append(f'### {v}')
            elif k in ('h2','h3'):
                md.append(f'#### {v}')
            elif k == 'code':
                md.append('代码：' + v)
            else:
                md.append(v)
        md.append('')

md_path = OUT / 'OpenClaw-中文实战教程-v3.md'
md_path.write_text('\n'.join(md), encoding='utf-8')

# PDF
pdfmetrics.registerFont(TTFont('CN', '/System/Library/Fonts/STHeiti Light.ttc', subfontIndex=0))
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='T', parent=styles['Title'], fontName='CN', fontSize=22, leading=28, spaceAfter=12))
styles.add(ParagraphStyle(name='H1', parent=styles['Heading1'], fontName='CN', fontSize=17, leading=23, spaceBefore=10, spaceAfter=7))
styles.add(ParagraphStyle(name='H2', parent=styles['Heading2'], fontName='CN', fontSize=14, leading=20, spaceBefore=8, spaceAfter=5))
styles.add(ParagraphStyle(name='B', parent=styles['BodyText'], fontName='CN', fontSize=11.5, leading=19, spaceAfter=5))

story = []
story.append(Paragraph('OpenClaw 中文实战教程', styles['T']))
story.append(Paragraph('入门 · 安装 · 渠道 · 工具 · CLI · 自动化 · 节点能力', styles['B']))
story.append(PageBreak())

story.append(Paragraph('目录', styles['H1']))
idx = 1
for cname, docs in chapters:
    story.append(Paragraph(cname, styles['H2']))
    for title, _ in docs:
        txt = f'{idx}. {title}'.replace('&', '&amp;').replace('<','&lt;').replace('>','&gt;')
        story.append(Paragraph(txt, styles['B']))
        idx += 1
story.append(PageBreak())

for cname, docs in chapters:
    story.append(Paragraph(cname.replace('&','&amp;'), styles['H1']))
    for i, (title, blocks) in enumerate(docs, 1):
        story.append(Paragraph(f'{i}. {title}'.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['H2']))
        for k, v in blocks:
            if k == 'blank':
                story.append(Spacer(1, 3))
            elif k in ('h1','h2','h3'):
                story.append(Paragraph(v.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['H2']))
            elif k == 'code':
                txt = ('代码：' + v).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
                story.append(Paragraph(txt, styles['B']))
            else:
                txt = v.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
                story.append(Paragraph(txt, styles['B']))
        story.append(Spacer(1, 8))
    story.append(PageBreak())

pdf_path = OUT / 'OpenClaw-中文实战教程-v3.pdf'
doc = SimpleDocTemplate(str(pdf_path), pagesize=A4, leftMargin=44, rightMargin=44, topMargin=36, bottomMargin=30)
doc.build(story)

print(md_path)
print(pdf_path)
