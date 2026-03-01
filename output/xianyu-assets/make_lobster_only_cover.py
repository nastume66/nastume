from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

out = Path('/Users/nastume/.openclaw/workspace/output/xianyu-assets')
out.mkdir(parents=True, exist_ok=True)
W,H=1242,1660
img = Image.new('RGB',(W,H),'#0f172a')
d = ImageDraw.Draw(img)

# gradient bars
for y in range(0,H,6):
    c = 20 + int(60*(y/H))
    d.rectangle((0,y,W,y+6), fill=(10,20,c))

# fonts
def F(size):
    for p in ['/System/Library/Fonts/PingFang.ttc','/System/Library/Fonts/STHeiti Light.ttc']:
        try:
            return ImageFont.truetype(p,size)
        except Exception:
            pass
    return ImageFont.load_default()

# lobster only cover style
d.text((W//2-110,460),'🦞',font=F(240),fill='#fb7185')
d.text((W//2-220,760),'小龙虾封面',font=F(72),fill='#f8fafc')

out_path = out/'openclaw-小龙虾封面-纯图.png'
img.save(out_path)
print(out_path)
