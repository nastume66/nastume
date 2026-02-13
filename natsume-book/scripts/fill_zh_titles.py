import json
p='/Users/nastume/.openclaw/workspace/natsume-book/src/data/episodes.json'
with open(p,encoding='utf-8') as f:data=json.load(f)
for s in data:
    for ep in s.get('episodes',[]):
        if ep.get('titleZh'):
            continue
        t=ep.get('title','')
        ep['titleZh']='特别篇' if ('特別篇' in t or '特别篇' in t) else f"第{ep['no']:02d}话"
with open(p,'w',encoding='utf-8') as f:
    json.dump(data,f,ensure_ascii=False,indent=2)
    f.write('\n')
print('ok')
