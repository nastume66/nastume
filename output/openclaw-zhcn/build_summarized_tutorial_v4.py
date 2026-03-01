from pathlib import Path
import re
from collections import defaultdict
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

BASE = Path('/Users/nastume/.nvm/versions/node/v24.13.0/lib/node_modules/openclaw/docs/zh-CN')
OUT = Path('/Users/nastume/.openclaw/workspace/output/openclaw-zhcn')
OUT.mkdir(parents=True, exist_ok=True)

NAV_WORDS = [
    '导航','顺序','跳转','上一页','下一页','目录树','On this page','Table of contents',
    'Edit this page','返回顶部','breadcrumb','mintlify','sidebar','tab', 'docs/zh-CN'
]

SECTION_ORDER = ['start','install','concepts','channels','providers','tools','cli','automation','nodes','web','gateway','platforms','plugins','diagnostics','debug','security','reference','experiments']
order_idx = {k:i for i,k in enumerate(SECTION_ORDER)}

files = [p for p in BASE.rglob('*') if p.is_file() and p.suffix.lower() in {'.md', '.mdx'}]
files.sort(key=lambda p: (order_idx.get(p.relative_to(BASE).parts[0] if len(p.relative_to(BASE).parts)>1 else 'zzz', 999), p.as_posix()))


def clean_text(text: str):
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
        if any(w.lower() in t.lower() for w in NAV_WORDS):
            continue
        if re.search(r'\{#.+\}$', t):
            t = re.sub(r'\{#.+\}$','',t).strip()

        if in_code:
            if t:
                lines.append(('cmd', t))
            continue

        if not t:
            continue

        if t.startswith('# '):
            lines.append(('h1', t[2:].strip())); continue
        if t.startswith('## '):
            lines.append(('h2', t[3:].strip())); continue
        if t.startswith('### '):
            lines.append(('h3', t[4:].strip())); continue

        if re.match(r'^[-*+]\s+', t):
            t = re.sub(r'^[-*+]\s+', '', t)
            lines.append(('bullet', t)); continue
        if re.match(r'^\d+\.\s+', t):
            t = re.sub(r'^\d+\.\s+', '', t)
            lines.append(('bullet', t)); continue

        t = re.sub(r'^>\s*', '', t)
        t = re.sub(r'!\[([^\]]*)\]\([^\)]*\)', r'\1', t)
        t = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'\1', t)
        t = re.sub(r'https?://\S+', '', t)
        t = re.sub(r'`([^`]+)`', r'\1', t)
        t = t.replace('**','').replace('__','').replace('*','')
        t = re.sub(r'\s+', ' ', t).strip()
        if t:
            lines.append(('p', t))
    return lines


def get_title(rel, tokens):
    for k,v in tokens:
        if k=='h1' and len(v) <= 80:
            return v
    return rel.stem.replace('-', ' ').replace('_', ' ')


def summarize(tokens):
    heads = [v for k,v in tokens if k in ('h2','h3')][:3]
    bullets = [v for k,v in tokens if k=='bullet']
    paras = [v for k,v in tokens if k=='p']
    cmds = [v for k,v in tokens if k=='cmd' and (v.startswith(('openclaw','npm','bun','docker','python','gh','curl','git')) or ' --' in v or '/' in v)][:6]

    key_points = []
    for x in bullets + paras:
        if len(x) < 6:
            continue
        if x in key_points:
            continue
        key_points.append(x)
        if len(key_points) >= 8:
            break

    return heads, key_points, cmds

# group by section
by_section = defaultdict(list)
for p in files:
    rel = p.relative_to(BASE)
    sec = rel.parts[0] if len(rel.parts) > 1 else 'other'
    txt = p.read_text(encoding='utf-8', errors='ignore')
    tokens = clean_text(txt)
    if not tokens:
        continue
    title = get_title(rel, tokens)
    heads, points, cmds = summarize(tokens)
    by_section[sec].append((title, heads, points, cmds))

# markdown tutorial
chapter_names = {
    'start':'第一章 入门与总览',
    'install':'第二章 安装与部署',
    'concepts':'第三章 核心概念',
    'channels':'第四章 渠道接入',
    'providers':'第五章 模型与提供商',
    'tools':'第六章 工具体系',
    'cli':'第七章 命令行实战',
    'automation':'第八章 自动化与定时任务',
    'nodes':'第九章 节点能力',
    'web':'第十章 Web 控制台',
    'gateway':'第十一章 网关与系统配置',
    'platforms':'第十二章 平台专项',
    'plugins':'第十三章 插件扩展',
    'diagnostics':'第十四章 诊断与排障',
    'debug':'第十五章 调试',
    'security':'第十六章 安全',
    'reference':'第十七章 参考资料',
    'experiments':'第十八章 实验与进阶'
}

md = []
md.append('# OpenClaw 中文完整教程（总结版）')
md.append('')
md.append('本教程将全部中文资料按学习路径重组为连续教程，去除了导航/跳转类文本，仅保留知识内容与操作要点。')
md.append('')
md.append('## 学习地图')
for sec in SECTION_ORDER:
    if sec in by_section:
        md.append(f'- {chapter_names.get(sec, sec)}（{len(by_section[sec])} 节）')
md.append('')

for sec in SECTION_ORDER:
    if sec not in by_section:
        continue
    md.append(f'\n# {chapter_names.get(sec, sec)}\n')
    for i,(title, heads, points, cmds) in enumerate(by_section[sec],1):
        md.append(f'## {i}. {title}')
        if heads:
            md.append('### 本节覆盖')
            for h in heads:
                md.append(f'- {h}')
        if points:
            md.append('### 关键要点')
            for p in points:
                md.append(f'- {p}')
        if cmds:
            md.append('### 操作示例')
            for c in cmds:
                md.append(f'- {c}')
        md.append('')

md_path = OUT / 'OpenClaw-中文完整教程-总结版-v4.md'
md_path.write_text('\n'.join(md), encoding='utf-8')

# PDF render
pdfmetrics.registerFont(TTFont('CN', '/System/Library/Fonts/STHeiti Light.ttc', subfontIndex=0))
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='T', parent=styles['Title'], fontName='CN', fontSize=22, leading=28, spaceAfter=10))
styles.add(ParagraphStyle(name='H1', parent=styles['Heading1'], fontName='CN', fontSize=17, leading=23, spaceBefore=10, spaceAfter=7))
styles.add(ParagraphStyle(name='H2', parent=styles['Heading2'], fontName='CN', fontSize=14, leading=19, spaceBefore=8, spaceAfter=6))
styles.add(ParagraphStyle(name='B', parent=styles['BodyText'], fontName='CN', fontSize=11.5, leading=18, spaceAfter=4))

story=[]
story.append(Paragraph('OpenClaw 中文完整教程（总结版）', styles['T']))
story.append(Paragraph('按学习路径重组 · 去除导航与跳转文本 · 覆盖全部中文资料', styles['B']))
story.append(PageBreak())

story.append(Paragraph('目录', styles['H1']))
for sec in SECTION_ORDER:
    if sec in by_section:
        story.append(Paragraph(f'{chapter_names.get(sec, sec)}（{len(by_section[sec])} 节）', styles['B']))
story.append(PageBreak())

for sec in SECTION_ORDER:
    if sec not in by_section:
        continue
    story.append(Paragraph(chapter_names.get(sec, sec), styles['H1']))
    for i,(title, heads, points, cmds) in enumerate(by_section[sec],1):
        story.append(Paragraph(f'{i}. {title}'.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['H2']))
        if heads:
            story.append(Paragraph('本节覆盖：', styles['B']))
            for h in heads:
                story.append(Paragraph('• ' + h.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['B']))
        if points:
            story.append(Paragraph('关键要点：', styles['B']))
            for p in points:
                story.append(Paragraph('• ' + p.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['B']))
        if cmds:
            story.append(Paragraph('操作示例：', styles['B']))
            for c in cmds:
                story.append(Paragraph('• ' + c.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['B']))
        story.append(Spacer(1,8))
    story.append(PageBreak())

pdf_path = OUT / 'OpenClaw-中文完整教程-总结版-v4.pdf'
doc = SimpleDocTemplate(str(pdf_path), pagesize=A4, leftMargin=44, rightMargin=44, topMargin=34, bottomMargin=30)
doc.build(story)

print(md_path)
print(pdf_path)
