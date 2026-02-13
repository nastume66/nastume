import json
p='/Users/nastume/.openclaw/workspace/natsume-book/src/data/episodes.json'
with open(p,encoding='utf-8') as f:data=json.load(f)
map_titles={
'第五季':['不变的身姿','恶作剧之雨','来自祓除师的信','连锁之影','不可系结之物','无声之谷','遥远的祭火','无可扭曲的世界','行于险路','塔子与滋','致易逝之人'],
'第六季':['月日食','明日绽放','二体大人','相异之瞳','被束缚之物','西村与北本','五目的恩人','终将到来之日','流逝之物','被封闭的房间','重要之物'],
'第七季':['碎片在忧愁','曾经的庭院','十日夜','书页深处','小胡子的宝物','废站·两道轮回','不擅长的两人','月夜下的夏目','阻碍仪式之人','留有约定的屋子','请告诉我名字','自梦路而来','伸出的手']
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
