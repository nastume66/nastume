import json
p='/Users/nastume/.openclaw/workspace/natsume-book/src/data/episodes.json'
with open(p,encoding='utf-8') as f:data=json.load(f)
map_titles={
'第三季':['妖异之名','浮春之乡','虚假的朋友','幼时光景','藏于仓库之物','非人之物','祓除师','小狐狸的时钟','切过秋风','破碎的镜子','映照之物','归去之处','夏目游记帐'],
'第四季':['被囚的夏目','东方之森','渺小之物','代答','向逝去的你','玻璃的彼端','在人与妖之间','迷惘之时','月分祭','被祭祀的神明','一张照片','记忆之门','遥远的归途']
}
for s in data:
    if s['season'] in map_titles:
        zh=map_titles[s['season']]
        for i,ep in enumerate(s['episodes']):
            if i < len(zh):
                ep['titleZh']=zh[i]
with open(p,'w',encoding='utf-8') as f:
    json.dump(data,f,ensure_ascii=False,indent=2);f.write('\n')
print('ok')
