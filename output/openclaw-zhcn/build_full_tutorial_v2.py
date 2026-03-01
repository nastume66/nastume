from pathlib import Path
import re
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

BASE = Path('/Users/nastume/.nvm/versions/node/v24.13.0/lib/node_modules/openclaw/docs/zh-CN')
OUT = Path('/Users/nastume/.openclaw/workspace/output/openclaw-zhcn')
OUT.mkdir(parents=True, exist_ok=True)

files = [p for p in BASE.rglob('*') if p.is_file() and p.suffix.lower() in {'.md', '.mdx'}]

# Better reading order (fallback to alphabetical inside each section)
SECTION_ORDER = [
    'start','install','concepts','channels','providers','tools','cli','automation','nodes','web','gateway','platforms','plugins','diagnostics','debug','security','reference','experiments'
]
order_map = {k:i for i,k in enumerate(SECTION_ORDER)}

def sort_key(p: Path):
    rel = p.relative_to(BASE)
    sec = rel.parts[0] if len(rel.parts)>1 else 'zzz'
    return (order_map.get(sec, 999), sec, rel.as_posix())

files = sorted(files, key=sort_key)

pdfmetrics.registerFont(TTFont('CN', '/System/Library/Fonts/STHeiti Light.ttc', subfontIndex=0))
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='T', parent=styles['Title'], fontName='CN', fontSize=22, leading=28, spaceAfter=14))
styles.add(ParagraphStyle(name='H1', parent=styles['Heading1'], fontName='CN', fontSize=17, leading=24, spaceBefore=10, spaceAfter=8))
styles.add(ParagraphStyle(name='H2', parent=styles['Heading2'], fontName='CN', fontSize=14, leading=20, spaceBefore=8, spaceAfter=6))
styles.add(ParagraphStyle(name='B', parent=styles['BodyText'], fontName='CN', fontSize=11.5, leading=19, spaceAfter=4))
styles.add(ParagraphStyle(name='Meta', parent=styles['BodyText'], fontName='CN', fontSize=9.5, leading=14, textColor='#666666'))


def first_title(text: str, fallback: str):
    m = re.search(r'^#\s+(.+)$', text, flags=re.M)
    if m:
        return m.group(1).strip()
    return fallback.replace('-', ' ').strip()


def clean_markdown(text: str):
    text = re.sub(r'^---\n.*?\n---\n', '', text, flags=re.S)
    lines = []
    in_code = False
    for raw in text.splitlines():
        s = raw.rstrip()
        st = s.strip()
        if st.startswith('```'):
            in_code = not in_code
            continue
        if st.startswith(('import ', 'export ')):
            continue
        if not st:
            lines.append(('blank',''))
            continue

        if in_code:
            lines.append(('body', '代码：' + s))
            continue

        if st.startswith('# '):
            lines.append(('h1', st[2:].strip())); continue
        if st.startswith('## '):
            lines.append(('h2', st[3:].strip())); continue
        if st.startswith('### '):
            lines.append(('h2', st[4:].strip())); continue

        if re.match(r'^[-*+]\s+', st):
            st = '• ' + re.sub(r'^[-*+]\s+', '', st)
        if re.match(r'^\d+\.\s+', st):
            st = '• ' + re.sub(r'^\d+\.\s+', '', st)
        st = re.sub(r'^>\s*', '', st)

        st = re.sub(r'!\[([^\]]*)\]\([^\)]*\)', r'\1', st)
        st = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'\1（\2）', st)
        st = re.sub(r'`([^`]+)`', r'\1', st)
        st = st.replace('**', '').replace('__', '').replace('*', '')
        st = st.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        if st.strip():
            lines.append(('body', st.strip()))
    # trim repeated blanks
    compact=[]
    prev_blank=True
    for t,v in lines:
      if t=='blank':
        if not prev_blank:
          compact.append((t,v))
        prev_blank=True
      else:
        compact.append((t,v)); prev_blank=False
    return compact

entries=[]
for p in files:
    raw=p.read_text(encoding='utf-8', errors='ignore')
    rel=p.relative_to(BASE)
    sec=rel.parts[0] if len(rel.parts)>1 else '其他'
    title=first_title(raw, rel.stem)
    entries.append((sec, title, clean_markdown(raw)))

story=[]
story.append(Paragraph('OpenClaw 中文完整教程', styles['T']))
story.append(Paragraph('基于官方中文文档全量提取整理（连续阅读版）', styles['Meta']))
story.append(Paragraph(f'文档数量：{len(entries)}', styles['Meta']))
story.append(Spacer(1,8))
story.append(PageBreak())

# TOC by section/title (no .md paths)
story.append(Paragraph('目录', styles['H1']))
cur=None
idx=1
for sec,title,_ in entries:
    if sec!=cur:
        cur=sec
        story.append(Spacer(1,4))
        story.append(Paragraph(f'【{sec}】', styles['H2']))
    story.append(Paragraph(f'{idx}. {title}', styles['B']))
    idx+=1
story.append(PageBreak())

idx=1
for sec,title,blocks in entries:
    head=[Paragraph(f'第 {idx} 篇 · {title}', styles['H1']), Paragraph(f'章节：{sec}', styles['Meta']), Spacer(1,6)]
    body=[]
    for t,v in blocks:
        if t=='blank':
            body.append(Spacer(1,4))
        elif t=='h1':
            body.append(Paragraph(v, styles['H1']))
        elif t=='h2':
            body.append(Paragraph(v, styles['H2']))
        else:
            body.append(Paragraph(v, styles['B']))
    story.append(KeepTogether(head))
    story.extend(body)
    story.append(PageBreak())
    idx+=1

pdf_path = OUT / 'OpenClaw-zhCN-完整教程-v2.pdf'
doc = SimpleDocTemplate(str(pdf_path), pagesize=A4, leftMargin=42, rightMargin=42, topMargin=34, bottomMargin=30)
doc.build(story)
print(pdf_path)
