# AI 大模型价格对比网站

实时对比主流 AI 模型的输入输出价格与 Coding Plan 收费。

## 🌐 在线访问

部署到 GitHub Pages 后，访问：
```
https://<your-username>.github.io/ai-model-compare/
```

## 📦 项目结构

```
ai-model-compare/
├── src/
│   ├── index.html      # 主页面
│   └── data.js         # 数据加载和渲染逻辑
├── data/
│   └── models.json     # 价格数据（JSON 格式）
├── scripts/
│   └── update-data.js  # 数据更新脚本
├── package.json
└── README.md
```

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动本地服务器
npm run serve

# 访问 http://localhost:3000
```

### 更新数据

```bash
# 手动更新数据
npm run update

# 或直接用 Node 运行
node scripts/update-data.js
```

## 📊 数据说明

### AI 模型价格
- 价格单位：USD / 每百万 Token
- 包含：输入价格、输出价格、上下文窗口
- 覆盖厂商：OpenAI, Anthropic, Google, DeepSeek

### Coding Plan 价格
- 价格单位：USD / 月
- 包含：月费、计费方式、特色功能、使用限制
- 覆盖产品：Cursor, Claude Code, Cline

## 🔄 自动更新

### 方案 1：GitHub Actions（推荐）

创建 `.github/workflows/update-pricing.yml`：

```yaml
name: Update Pricing Data

on:
  schedule:
    # 每天北京时间 3:00 (UTC 19:00)
    - cron: '0 19 * * *'
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run update
      - run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add data/models.json
          git commit -m "chore: update pricing data $(date +%Y-%m-%d)" || echo "No changes"
      - uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          branch: main
```

### 方案 2：本地 Cron

```bash
# 编辑 crontab
crontab -e

# 添加（每天北京时间 3:00，即 UTC 19:00）
0 19 * * * cd /path/to/ai-model-compare && node scripts/update-data.js && git add data/models.json && git commit -m "chore: auto update" && git push
```

## 📤 部署到 GitHub Pages

### 步骤 1：创建 GitHub 账号（需手动）

1. 访问 https://github.com/signup
2. 使用邮箱注册
3. 完成邮箱验证

### 步骤 2：创建仓库

```bash
cd /Users/wangzhongyang/.openclaw/workspace/ai-model-compare

# 初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: AI model pricing comparison website"

# 添加远程仓库（替换为你的用户名）
git remote add origin https://github.com/<your-username>/ai-model-compare.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

### 步骤 3：启用 GitHub Pages

1. 访问仓库设置：https://github.com/<your-username>/ai-model-compare/settings/pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 "main"，Folder 选择 "/ (root)"
4. 点击 Save
5. 等待部署完成（约 1-2 分钟）
6. 访问生成的 URL

### 或使用 src 目录部署

```bash
# 创建 gh-pages 分支
git checkout --orphan gh-pages
git reset --hard

# 只复制 src 和 data 目录
cp -r src/* .
cp -r data .

# 添加文件
git add .
git commit -m "Deploy to GitHub Pages"

# 推送
git push origin gh-pages --force
```

然后在 GitHub Pages 设置中选择 `gh-pages` 分支。

## 🛠️ 扩展

### 添加新模型

编辑 `data/models.json`，在 `aiModels` 数组中添加：

```json
{
  "provider": "厂商名称",
  "model": "模型名称",
  "inputPrice": 0.00,
  "outputPrice": 0.00,
  "contextWindow": "128K",
  "category": "flagship|balanced|fast|economy|legacy|multimodal|reasoning"
}
```

### 添加新套餐

编辑 `data/models.json`，在 `codingPlans` 数组中添加：

```json
{
  "provider": "厂商名称",
  "plan": "套餐名称",
  "price": 0,
  "billing": "monthly|monthly/user|custom|free",
  "features": "特色功能描述",
  "limits": "使用限制"
}
```

## 📝 注意事项

1. **价格准确性**：价格数据可能随时变动，请以各厂商官网为准
2. **更新频率**：建议每日更新一次
3. **数据来源**：生产环境建议集成官方 API 或设置人工审核流程

## 📄 License

MIT License
