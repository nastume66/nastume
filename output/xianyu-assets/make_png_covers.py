from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

out = Path('/Users/nastume/.openclaw/workspace/output/xianyu-assets')
out.mkdir(parents=True, exist_ok=True)
W,H = 1242,1660

# fonts
font_paths = [
    '/System/Library/Fonts/PingFang.ttc',
    '/System/Library/Fonts/STHeiti Light.ttc',
    '/System/Library/Fonts/Hiragino Sans GB.ttc',
]

def get_font(size):
    for p in font_paths:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            pass
    return ImageFont.load_default()

# 1) OpenClaw cover
img = Image.new('RGB', (W,H), '#0b1224')
d = ImageDraw.Draw(img)
for y in range(H):
    c = int(30 + (y/H)*70)
    d.line([(0,y),(W,y)], fill=(8, 24, min(255, c+80)))

d.text((70,120), '🦞 小龙虾 OpenClaw 从入门到精通', font=get_font(56), fill='#9ec5ff')
d.text((70,235), '完整教程 · 安装答疑 · 实战落地', font=get_font(44), fill='#dbeafe')

d.rounded_rectangle((70,350,1170,980), radius=30, fill='#12203d', outline='#2f63d8', width=3)
features = [
    '✅ 覆盖安装 / 配置 / 渠道接入 / CLI / 自动化',
    '✅ 代码块、图片、表格完整保留',
    '✅ 目录化阅读，章节清晰',
    '✅ 适合新手快速上手 + 进阶查阅',
    '✅ 附安装问题答疑服务',
]
y = 430
for f in features:
    d.text((120,y), f, font=get_font(42), fill='white')
    y += 100

d.rounded_rectangle((70,1060,610,1220), radius=20, fill='#f59e0b')
d.text((120,1118), '¥1 限时体验', font=get_font(64), fill='#111827')
d.text((70,1530), '交付：PDF + 售后答疑（下单后私信）', font=get_font(36), fill='#cfe4ff')
img.save(out/'openclaw-封面图.png')

# 2) Key content cover
img2 = Image.new('RGB', (W,H), '#111827')
d2 = ImageDraw.Draw(img2)
d2.text((70,120), '重点内容一览', font=get_font(72), fill='white')
d2.text((70,220), 'OpenClaw 教程核心模块', font=get_font(40), fill='#93c5fd')

cards = [
    ('01 入门与环境准备', '快速理解架构、系统要求、安装方式'),
    ('02 渠道接入实操', 'WhatsApp / Discord / Telegram 配置路径'),
    ('03 CLI 命令应用', '常用命令、诊断命令、日志定位'),
    ('04 自动化与心跳', 'Cron 定时任务、流程自动化思路'),
    ('05 常见报错处理', '安装卡住、依赖冲突、连接异常排查'),
]
box_y = 320
for title,sub in cards:
    d2.rounded_rectangle((70,box_y,1170,box_y+220), radius=24, fill='#1f2937', outline='#374151', width=2)
    d2.text((110,box_y+40), title, font=get_font(48), fill='#e5e7eb')
    d2.text((110,box_y+120), sub, font=get_font(34), fill='#9ca3af')
    box_y += 250

img2.save(out/'openclaw-重点内容图.png')
print(out/'openclaw-封面图.png')
print(out/'openclaw-重点内容图.png')