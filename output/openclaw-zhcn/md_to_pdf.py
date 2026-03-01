from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
import sys

if len(sys.argv)<3:
    print('usage: md_to_pdf.py <in.md> <out.pdf>')
    raise SystemExit(1)

src=Path(sys.argv[1])
out=Path(sys.argv[2])
text=src.read_text(encoding='utf-8', errors='ignore')

pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))
font='STSong-Light'; size=10
w,h=A4
left=36; right=36; top=36; bottom=36; line_h=14
max_width=w-left-right

def wrap_line(s):
    lines=[]; cur=''
    for ch in s:
        if ch=='\t': ch='    '
        trial=cur+ch
        if pdfmetrics.stringWidth(trial,font,size)<=max_width:
            cur=trial
        else:
            if cur:
                lines.append(cur); cur=ch
            else:
                lines.append(trial); cur=''
    lines.append(cur)
    return lines

c=canvas.Canvas(str(out), pagesize=A4)
c.setFont(font,size)
y=h-top
for raw in text.splitlines():
    wrapped=wrap_line(raw) if raw else ['']
    for ln in wrapped:
        if y<bottom:
            c.showPage(); c.setFont(font,size); y=h-top
        c.drawString(left,y,ln)
        y-=line_h
c.save()
print(out)
