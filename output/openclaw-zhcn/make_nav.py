from pathlib import Path
import re
from collections import defaultdict

base=Path('/Users/nastume/.nvm/versions/node/v24.13.0/lib/node_modules/openclaw/docs/zh-CN')
out=Path('/Users/nastume/.openclaw/workspace/output/openclaw-zhcn')
out.mkdir(parents=True,exist_ok=True)
files=sorted([p for p in base.rglob('*') if p.is_file() and p.suffix.lower() in {'.md','.mdx'}])

def title_from_text(text, fallback):
    for line in text.splitlines():
        s=line.strip()
        if s.startswith('#'):
            return re.sub(r'^#+\s*','',s)
    return fallback

groups=defaultdict(list)
for p in files:
    rel=p.relative_to(base)
    group=rel.parts[0] if len(rel.parts)>1 else 'root'
    groups[group].append(rel)

md=[]
md.append('# OpenClaw 中文文档导航版（目录+摘要）')
md.append('')
md.append('> 说明：基于 `docs/zh-CN` 自动生成。正文原文汇编见同目录 `OpenClaw-zhCN-原文汇编.*`。')
md.append('')
md.append(f'- 文档总数（md/mdx）：**{len(files)}**')
md.append('')
md.append('## 目录总览')
for g in sorted(groups):
    md.append(f'- {g} ({len(groups[g])})')
md.append('')

for g in sorted(groups):
    md.append(f'## {g}')
    for rel in groups[g]:
        p=base/rel
        text=p.read_text(encoding='utf-8', errors='ignore')
        title=title_from_text(text, rel.stem)
        summary=''
        for line in text.splitlines():
            s=line.strip()
            if not s or s.startswith('#') or s.startswith('---') or s.startswith('import '):
                continue
            summary=s
            break
        if len(summary)>100:
            summary=summary[:100]+'…'
        md.append(f'- **{title}**')
        md.append(f'  路径：`{rel.as_posix()}`')
        if summary:
            md.append(f'  摘要：{summary}')
    md.append('')

(out/'OpenClaw-zhCN-导航版.md').write_text('\n'.join(md),encoding='utf-8')

html=['<html><head><meta charset="utf-8"><style>body{font-family:-apple-system,Segoe UI,Arial;padding:28px;line-height:1.5}code{background:#f5f5f5;padding:1px 4px;border-radius:4px}h1,h2{page-break-after:avoid}p{margin:6px 0}</style></head><body>']
for line in md:
    if line.startswith('# '): html.append(f'<h1>{line[2:]}</h1>')
    elif line.startswith('## '): html.append(f'<h2>{line[3:]}</h2>')
    elif line.startswith('- '): html.append(f'<p>• {line[2:]}</p>')
    elif line.startswith('  路径：'): html.append(f'<p style="margin-left:24px">{line.strip()}</p>')
    elif line.startswith('  摘要：'): html.append(f'<p style="margin-left:24px;color:#444">{line.strip()}</p>')
    elif line.startswith('> '): html.append(f'<blockquote>{line[2:]}</blockquote>')
    elif line.strip()=='' : html.append('<br>')
    else: html.append(f'<p>{line}</p>')
html.append('</body></html>')
(out/'OpenClaw-zhCN-导航版.html').write_text('\n'.join(html),encoding='utf-8')
print('OK')