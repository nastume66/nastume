import json, re
from pathlib import Path

raw = Path('/tmp/natsume_raw.txt').read_text(encoding='utf-8')
blocks = re.findall(r'\{\{Episode list(.*?)\n\}\}', raw, flags=re.S)
num_to_title = {}
for b in blocks:
    m_num = re.search(r'\|\s*EpisodeNumber\s*=\s*(\d+)', b)
    m_title = re.search(r'\|\s*NativeTitle\s*=\s*(.+)', b)
    if not m_num or not m_title:
        continue
    num_to_title[int(m_num.group(1))] = m_title.group(1).strip()

p = Path('/Users/nastume/.openclaw/workspace/natsume-book/src/data/episodes.json')
data = json.loads(p.read_text(encoding='utf-8'))

ranges = [
    range(1, 14),
    range(14, 27),
    range(27, 40),
    range(40, 53),
    range(53, 64),
    range(64, 75),
    range(75, 88),
]

for season, r in zip(data, ranges):
    eps = []
    for i, n in enumerate(r, start=1):
        t = num_to_title.get(n, f'第{i:02d}话')
        eps.append({'no': i, 'title': t})
    season['episodes'] = eps

p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('updated', len(num_to_title), 'episode titles')
