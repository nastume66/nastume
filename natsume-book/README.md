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

## 博客后台（可编辑 + 可持久化）

已新增：

- `/blog`：博客列表（优先读 Supabase）
- `/blog/[slug]`：文章详情
- `/admin`：后台编辑器（登录后可新建/编辑/删除）

### Supabase 配置步骤

1. 新建 Supabase 项目
2. 在 SQL Editor 执行：`supabase/schema.sql`
3. 如需“每个账号只看/改自己的文章”，再执行：`supabase/author-migration.sql`
3. 在 Vercel / 本地环境变量添加：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon-key
```

4. 创建存储桶（用于博客图片上传）：
   - Supabase → Storage → New bucket
   - 名称：`blog-images`
   - 设为 Public（便于前台直接展示）

5. 安装依赖并重新部署：

```bash
npm install
npm run build
```

> 未配置 Supabase 时，博客会自动回退到 `src/data/posts.json` 的静态数据。

## 内容维护（静态兜底）

网站仍保留 JSON 内容源（作为兜底和离线编辑）：

- `src/data/home.json`：首页横幅、金句、功能卡片
- `src/data/characters.json`：角色列表
- `src/data/episodes.json`：剧集时间线
- `src/data/posts.json`：博客静态兜底数据

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
