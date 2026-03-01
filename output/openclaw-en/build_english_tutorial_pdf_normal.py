from pathlib import Path
import re
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm

DOCS = Path('/Users/nastume/.nvm/versions/node/v24.13.0/lib/node_modules/openclaw/docs')
OUT = Path('/Users/nastume/.openclaw/workspace/output/openclaw-en')
OUT.mkdir(parents=True, exist_ok=True)

files = sorted([p for p in DOCS.rglob('*') if p.is_file() and p.suffix.lower() in {'.md', '.mdx'} and 'zh-CN' not in p.parts])

SECTION_ORDER = ['start','install','concepts','channels','providers','tools','cli','automation','nodes','web','gateway','platforms','plugins','diagnostics','debug','security','reference','experiments']
order = {k:i for i,k in enumerate(SECTION_ORDER)}

def s_key(p: Path):
    rel = p.relative_to(DOCS)
    sec = rel.parts[0] if len(rel.parts)>1 else 'zzz'
    return (order.get(sec, 999), sec, rel.as_posix())

files.sort(key=s_key)

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='T', parent=styles['Title'], fontSize=22, leading=28, spaceAfter=12))
styles.add(ParagraphStyle(name='H1', parent=styles['Heading1'], fontSize=16, leading=22, spaceAfter=8))
styles.add(ParagraphStyle(name='H2', parent=styles['Heading2'], fontSize=13, leading=18, spaceAfter=6))
styles.add(ParagraphStyle(name='B', parent=styles['BodyText'], fontSize=10.5, leading=16, spaceAfter=4))
styles.add(ParagraphStyle(name='CodeBlock', parent=styles['BodyText'], fontName='Courier', fontSize=8.8, leading=12, backColor='#F6F8FA', spaceBefore=2, spaceAfter=2))
styles.add(ParagraphStyle(name='Meta', parent=styles['BodyText'], fontSize=8.5, leading=12, textColor='#666666'))


def remove_frontmatter(t: str):
    return re.sub(r'^---\n.*?\n---\n', '', t, flags=re.S)


def first_h1(t: str, fallback: str):
    m = re.search(r'^#\s+(.+)$', t, flags=re.M)
    return (m.group(1).strip() if m else fallback.replace('-', ' '))


def resolve_asset(url: str, current: Path):
    u = url.strip()
    if u.startswith(('http://', 'https://', 'data:', '#', 'mailto:')):
        return None
    if u.startswith('/'):
        p = DOCS / u.lstrip('/')
    else:
        p = (current.parent / u).resolve()
    return p if p.exists() else None


story = []
story.append(Paragraph('OpenClaw Full Tutorial (English)', styles['T']))
story.append(Paragraph('Complete documentation tutorial edition (normal PDF layout)', styles['Meta']))
story.append(Paragraph(f'Total pages compiled: {len(files)}', styles['Meta']))
story.append(PageBreak())

story.append(Paragraph('Table of Contents', styles['H1']))
for i,p in enumerate(files,1):
    raw = p.read_text(encoding='utf-8', errors='ignore')
    title = first_h1(remove_frontmatter(raw), p.stem)
    rel = p.relative_to(DOCS).as_posix()
    story.append(Paragraph(f'{i}. {title}', styles['B']))
    story.append(Paragraph(rel.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['Meta']))
story.append(PageBreak())

img_exts = {'.png','.jpg','.jpeg','.webp','.gif'}

for i,p in enumerate(files,1):
    rel = p.relative_to(DOCS).as_posix()
    raw = remove_frontmatter(p.read_text(encoding='utf-8', errors='ignore'))
    raw = '\n'.join([ln for ln in raw.splitlines() if not ln.strip().startswith(('import ','export '))])
    title = first_h1(raw, p.stem)

    story.append(Paragraph(f'{i}. {title}'.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['H1']))
    story.append(Paragraph(rel.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['Meta']))

    in_code = False
    for line in raw.splitlines():
        t = line.rstrip('\n')
        s = t.strip()

        if s.startswith('```'):
            in_code = not in_code
            continue

        if in_code:
            text = t.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
            if text.strip() == '':
                text = '&nbsp;'
            story.append(Paragraph(text, styles['CodeBlock']))
            continue

        if not s:
            story.append(Spacer(1, 3))
            continue

        # image markdown
        m_img = re.match(r'!\[([^\]]*)\]\(([^\)]+)\)', s)
        if m_img:
            alt, url = m_img.group(1), m_img.group(2)
            ap = resolve_asset(url, p)
            if ap and ap.suffix.lower() in img_exts:
                try:
                    im = Image(str(ap))
                    max_w = A4[0] - 4*cm
                    if im.drawWidth > max_w:
                        ratio = max_w / float(im.drawWidth)
                        im.drawWidth = max_w
                        im.drawHeight = im.drawHeight * ratio
                    story.append(im)
                    if alt:
                        story.append(Paragraph(f'Figure: {alt}'.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['Meta']))
                except Exception:
                    story.append(Paragraph(f'Image: {url}'.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['Meta']))
            else:
                story.append(Paragraph(f'Image: {url}'.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['Meta']))
            continue

        # headings
        if s.startswith('# '):
            story.append(Paragraph(s[2:].replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['H1']))
            continue
        if s.startswith('## '):
            story.append(Paragraph(s[3:].replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['H2']))
            continue
        if s.startswith('### '):
            story.append(Paragraph(s[4:].replace('&','&amp;').replace('<','&lt;').replace('>','&gt;'), styles['H2']))
            continue

        # lists
        if re.match(r'^[-*+]\s+', s):
            s = '• ' + re.sub(r'^[-*+]\s+', '', s)
        elif re.match(r'^\d+\.\s+', s):
            s = '• ' + re.sub(r'^\d+\.\s+', '', s)

        # links and inline code
        s = re.sub(r'\[([^\]]+)\]\(([^\)]+)\)', r'\1 (\2)', s)
        s = re.sub(r'`([^`]+)`', r'\1', s)
        s = s.replace('**', '').replace('__', '')

        s = s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
        story.append(Paragraph(s, styles['B']))

    story.append(PageBreak())

pdf = OUT / 'OpenClaw-Full-Tutorial-EN-normal.pdf'
doc = SimpleDocTemplate(str(pdf), pagesize=A4, leftMargin=42, rightMargin=42, topMargin=34, bottomMargin=28)
doc.build(story)

print(pdf)
