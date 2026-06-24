# JustLive - 聚合直播平台

基于 Next.js 16 的多平台直播聚合应用。

## 技术栈

- **框架**: Next.js 16 + React 19 + TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **数据库**: Vercel Postgres + Prisma 7
- **认证**: NextAuth.js v5
- **部署**: Vercel

## 支持平台

- 斗鱼 (Douyu)
- 虎牙 (Huya) - 开发中
- B站 (Bilibili) - 开发中
- 网易CC (Netease) - 开发中

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

配置以下环境变量：

```env
# 数据库
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 初始化数据库

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 1. 连接数据库

在 Vercel 项目中添加 Postgres 数据库：

```bash
vercel link
vercel postgres create
```

### 2. 配置环境变量

在 Vercel Dashboard 设置：

- `NEXTAUTH_SECRET`: 随机生成的密钥
- `NEXTAUTH_URL`: 你的部署域名

### 3. 部署

```bash
vercel deploy --prod
```

### 4. 执行数据库迁移

```bash
npx prisma migrate deploy
```

## 功能特性

- ✅ 多平台直播聚合
- ✅ 用户认证与关注
- ✅ 直播间搜索
- ✅ 响应式设计
- 🚧 直播播放器（开发中）
- 🚧 弹幕功能（开发中）

## 项目结构

```
justlive-next/
├── app/              # Next.js App Router
├── components/       # React 组件
├── lib/              # 工具函数与客户端
├── types/            # TypeScript 类型
├── prisma/           # 数据库 Schema
└── public/           # 静态资源
```

## License

MIT
