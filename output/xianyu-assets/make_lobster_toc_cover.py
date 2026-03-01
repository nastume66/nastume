from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import re

out = Path('/Users/nastume/.openclaw/workspace/output/xianyu-assets')
out.mkdir(parents=True, exist_ok=True)
W,H = 1242,1660

font_paths = [
    '/System/Library/Fonts/PingFang.ttc',
    '/System/Library/Fonts/STHeiti Light.ttc',
    '/System/Library/Fonts/Hiragino Sans GB.ttc',
]

def F(size):
    for p in font_paths:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            pass
    return ImageFont.load_default()

# Build TOC preview from tutorial_links.txt
links_file = Path('/Users/nastume/.openclaw/workspace/output/openclaw-en/tutorial_links.txt')
lines = [x.strip() for x in links_file.read_text(encoding='utf-8').splitlines() if x.strip()]

chapter_names = {
    1:'开始指南',2:'帮助中心',3:'安装与更新',4:'CLI命令行',5:'核心概念',6:'网关与运维',
    7:'Web界面',8:'通讯渠道',9:'模型提供商',10:'自动化与钩子',11:'工具与技能',
    12:'节点与媒体',13:'平台支持',14:'macOS伴侣应用',15:'参考与模板'
}

chapters = {}
for u in lines:
    slug = u.split('/tutorial/')[-1].replace('.html','')
    # try infer chapter number by known prefixes in this compiled site naming
    m = re.match(r'(\d+)\.(\d+)', slug)
    # no explicit number in slug, infer via sequence from known nav list order
    # here we use existing link order and text mapping unavailable, so just use canonical 1..15 list

# We'll display fixed chapter preview list (high readability)
preview = [
    '第1章  开始指南（1.1 - 1.10）',
    '第2章  帮助中心（2.1 - 2.3）',
    '第3章  安装与更新（3.1 - 3.12）',
    '第4章  CLI命令行（4.1 - 4.36）',
    '第5章  核心概念（5.1 - 5.29）',
    '第6章  网关与运维（6.1 - 6.30）',
    '第7章  Web界面（7.1 - 7.5）',
    '第8章  通讯渠道（8.1 - 8.18）',
    '第9章  模型提供商（9.1 - 9.13）',
    '第10章 自动化与钩子（10.1 - 10.8）',
    '第11章 工具与技能（11.1 - 11.23）',
    '第12章 节点与媒体（12.1 - 12.7）',
    '第13章 平台支持（13.1 - 13.11）',
    '第14章 macOS伴侣应用（14.1 - 14.18）',
    '第15章 参考与模板（15.1 - 15.14）',
]

img = Image.new('RGB',(W,H),'#0b1020')
d = ImageDraw.Draw(img)

# gradient-ish background bars
for i in range(0,H,8):
    c = 18 + int(35*(i/H))
    d.rectangle((0,i,W,i+8), fill=(8,18,c+40))

# lobster icon + title (no price)
d.text((70,90), '🦞', font=F(100), fill='#fb7185')
d.text((170,108), '小龙虾 OpenClaw 从入门到精通', font=F(56), fill='#e2e8f0')
d.text((70,190), '完整教程目录预览（可内部跳转）', font=F(36), fill='#93c5fd')

# TOC card
d.rounded_rectangle((60,260,1182,1540), radius=26, fill='#111827', outline='#334155', width=3)
d.text((95,315), '教程目录预览', font=F(50), fill='#f8fafc')

y=390
for line in preview:
    d.text((95,y), f'• {line}', font=F(34), fill='#d1d5db')
    y += 72

# footer badge (no price)
d.rounded_rectangle((60,1560,1182,1635), radius=14, fill='#1d4ed8')
d.text((95,1608), '含代码块 / 图片 / 表格 ｜ 附安装答疑服务', font=F(32), fill='white')

out_path = out/'openclaw-小龙虾封面-目录预览.png'
img.save(out_path)
print(out_path)
