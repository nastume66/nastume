import json, os, urllib.request

base='/Users/nastume/.openclaw/workspace/natsume-book/public/images'
os.makedirs(base+'/characters', exist_ok=True)
os.makedirs(base+'/episodes', exist_ok=True)
os.makedirs(base+'/banners', exist_ok=True)

def get_json(url):
    with urllib.request.urlopen(url, timeout=30) as r:
        return json.loads(r.read().decode())

def download(url, path):
    if not url:
        return False
    try:
        urllib.request.urlretrieve(url, path)
        return True
    except Exception:
        return False

res=get_json('https://api.jikan.moe/v4/anime?q=Natsume%20Yuujinchou&limit=5')['data']
anime=res[0]
for a in res:
    if a.get('type')=='TV':
        anime=a
        break
anime_id=anime['mal_id']
banner=anime.get('images',{}).get('jpg',{}).get('large_image_url') or anime.get('images',{}).get('jpg',{}).get('image_url')
download(banner, base+'/banners/home-banner-healing.jpg')

chars=get_json(f'https://api.jikan.moe/v4/anime/{anime_id}/characters')['data']
want=[('Natsume Takashi','natsume-healing.jpg'),('Madara','nyanko-healing.jpg'),('Natori Shuuichi','natori-healing.jpg'),('Tanuma Kaname','tanuma-healing.jpg')]
found={}
for item in chars:
    name=item.get('character',{}).get('name','')
    img=item.get('character',{}).get('images',{}).get('jpg',{}).get('image_url')
    for key,f in want:
        if key.lower() in name.lower() and f not in found and download(img, base+'/characters/'+f):
            found[f]=img
for item in chars:
    if len(found)>=4:
        break
    img=item.get('character',{}).get('images',{}).get('jpg',{}).get('image_url')
    for _,f in want:
        if f not in found and download(img, base+'/characters/'+f):
            found[f]=img
            break

for f in ['season1.jpg','season2.jpg','season3.jpg','season4plus.jpg']:
    download(banner, base+'/episodes/'+f)

meta={'anime_id':anime_id,'anime_title':anime.get('title'),'banner_source':banner,'character_sources':found}
with open('/Users/nastume/.openclaw/workspace/natsume-book/src/data/image-sources.json','w') as fp:
    json.dump(meta, fp, ensure_ascii=False, indent=2)
print(json.dumps(meta, ensure_ascii=False))
