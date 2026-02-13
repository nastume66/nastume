import json
p='/Users/nastume/.openclaw/workspace/natsume-book/src/data/episodes.json'
with open(p,encoding='utf-8') as f:data=json.load(f)
zh=[
'被夺走的友人帐','融于春日','妖怪退治 温泉之行','雏，孵化','约定之树','少女之阵','不可呼唤','不死的思念','樱并木的他','暂居之屋','咒术师之会','废屋的少年','人与妖'
]
for s in data:
    if s.get('season')=='第二季':
        for i,ep in enumerate(s['episodes']):
            if i < len(zh):
                ep['titleZh']=zh[i]
with open(p,'w',encoding='utf-8') as f:
    json.dump(data,f,ensure_ascii=False,indent=2);f.write('\n')
print('ok')
