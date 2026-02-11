# 友人之庭（Natsume Book）

《夏目友人帐》主题网站，基于 Next.js + Tailwind。

线上地址：<https://nastume.vercel.app/>

## 已完成功能

- 首页横幅 + 主题文案区
- 角色图鉴（点击卡片弹出详情）
- 剧集时间线
- 友人帐留言（浏览器本地存储）
- 日间/夜间主题切换
- 基础 SEO（title/description/open graph）

## 本地开发

```bash
npm install
npm run dev
```

打开：<http://localhost:3000>

## 内容维护（最重要）

网站内容已抽到 JSON，后续改文案不需要改组件代码：

- `src/data/home.json`：首页横幅、金句、功能卡片
- `src/data/characters.json`：角色列表
- `src/data/episodes.json`：剧集时间线

改完后提交并 push，Vercel 会自动部署。

## 图片资源建议

建议把图片放到：

- `public/images/characters/`
- `public/images/banners/`

现在 `src/data/characters.json` 已经接好 `image` 字段，你可以直接替换文件路径，例如：

```json
{
  "name": "猫咪老师（斑）",
  "image": "/images/characters/nyanko.jpg"
}
```

## 安全注意

- 不要把任何 API Key 写入代码
- 敏感信息只放 `.env.local`
- `.env*` 不要提交到仓库
