from pathlib import Path
import re
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont

BASE = Path('/Users/nastume/.nvm/versions/node/v24.13.0/lib/node_modules/openclaw/docs/zh-CN')
OUT = Path('/Users/nastume/.openclaw/workspace/output/openclaw-zhcn')
OUT.mkdir(parents=True, exist_ok=True)

files = sorted([p for p in BASE.rglob('*') if p.is_file() and p.suffix.lower() in {'.md', '.mdx'}])

pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='CNTitle', parent=styles['Title'], fontName='STSong-Light', fontSize=20, leading=24))
styles.add(ParagraphStyle(name='CNH1', parent=styles['Heading1'], fontName='STSong-Light', fontSize=16, leading=20))
styles.add(ParagraphStyle(name='CNH2', parent=styles['Heading2'], fontName='STSong-Light', fontSize=13, leading=17))
styles.add(ParagraphStyle(name='CNBody', parent=styles['BodyText'], fontName='STSong-Light', fontSize=10.5, leading=15))
styles.add(ParagraphStyle(name='CNMeta', parent=styles['BodyText'], fontName='STSong-Light', fontSize=9, leading=12, textColor='#666666'))


def clean_lines(text: str):
    text = re.sub(r'^---\n.*?\n---\n', '', text, flags=re.S)
    out = []
    in_code = False
    for ln in text.splitlines():
        s = ln.rstrip('\n')
        st = s.strip()
        if st.startswith('```'):
            in_code = not in_code
            continue
        if st.startswith(('import ', 'export ')):
            continue
        if in_code:
            out.append('代码: ' + s)
            continue
        if not st:
            out.append('')
            continue
        # headings
        if st.startswith('# '):
            out.append('@@H1@@' + st[2:].strip())
            continue
        if st.startswith('## '):
            out.append('@@H2@@' + st[3:].strip())
            continue
        if st.startswith('### '):
            out.append('@@H2@@' + st[4:].strip())
            continue
        # list
        if re.match(r'^[-*+]\s+', st):
            st = '• ' + re.sub(r'^[-*+]\s+', '', st)
        if re.match(r'^\d+\.\s+', st):
            st = '• ' + re.sub(r'^\d+\.\s+', '', st)
        # links/images/code
        st = re.sub(r'!\[([^\]]*)\]\([^\)]*\)', r'\1', st)
        st = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'\1（\2）', st)
        st = re.sub(r'`([^`]+)`', r'\1', st)
        st = st.replace('**', '').replace('__', '')
        st = st.replace('<', '&lt;').replace('>', '&gt;')
        out.append(st)
    return out

story = []
story.append(Paragraph('OpenClaw 中文完整教程（基于 docs/zh-CN 全量提取）', styles['CNTitle']))
story.append(Spacer(1, 10))
story.append(Paragraph(f'来源目录：{BASE}', styles['CNMeta']))
story.append(Paragraph(f'文档总数：{len(files)}', styles['CNMeta']))
story.append(PageBreak())

story.append(Paragraph('目录（按文件路径）', styles['CNH1']))
for i, p in enumerate(files, 1):
    rel = p.relative_to(BASE).as_posix().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    story.append(Paragraph(f'{i}. {rel}', styles['CNBody']))
story.append(PageBreak())

for i, p in enumerate(files, 1):
    rel = p.relative_to(BASE).as_posix()
    raw = p.read_text(encoding='utf-8', errors='ignore')
    lines = clean_lines(raw)
    story.append(Paragraph(f'第 {i} 篇：{rel.replace("&", "&amp;")}', styles['CNH1']))
    for ln in lines:
        if not ln:
            story.append(Spacer(1, 4))
            continue
        if ln.startswith('@@H1@@'):
            story.append(Paragraph(ln[6:].replace('&', '&amp;'), styles['CNH1']))
        elif ln.startswith('@@H2@@'):
            story.append(Paragraph(ln[6:].replace('&', '&amp;'), styles['CNH2']))
        else:
            story.append(Paragraph(ln.replace('&', '&amp;'), styles['CNBody']))
    story.append(PageBreak())

pdf_path = OUT / 'OpenClaw-zhCN-完整教程.pdf'
doc = SimpleDocTemplate(str(pdf_path), pagesize=A4, leftMargin=32, rightMargin=32, topMargin=30, bottomMargin=24)
doc.build(story)

# also export plain txt
all_txt = OUT / 'OpenClaw-zhCN-完整教程.txt'
buf = []
for i,p in enumerate(files,1):
    rel = p.relative_to(BASE).as_posix()
    buf.append('='*80)
    buf.append(f'第 {i} 篇：{rel}')
    buf.append('='*80)
    buf.extend(clean_lines(p.read_text(encoding='utf-8', errors='ignore')))
    buf.append('')
all_txt.write_text('\n'.join(buf), encoding='utf-8')

print(pdf_path)
print(all_txt)
