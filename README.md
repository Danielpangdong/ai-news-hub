# 🤖 AI 深观察

> 每日精选全球最有价值的 AI 资讯与洞见

**在线访问**: https://[your-username].github.io/ai-news-hub/

---

## ✨ 特性

- 🎨 **虎嗅网风格设计** - 专业资讯聚合网站
- 📱 **响应式布局** - 完美适配手机、平板、桌面
- 🌙 **深色/浅色模式** - 自动切换，护眼阅读
- 🔍 **智能搜索** - 支持标题、摘要、标签搜索
- 🏷️ **分类筛选** - 行业动态、产品发布、技术突破、深度观点
- ⚡ **自动更新** - 每日两次自动抓取最新资讯
- 💾 **本地缓存** - 离线也能浏览历史内容

---

## 🚀 快速开始

### 1. Fork 本仓库

点击右上角的 "Fork" 按钮，将仓库复制到你的 GitHub 账户。

### 2. 启用 GitHub Pages

1. 进入仓库的 **Settings** → **Pages**
2. 在 "Build and deployment" 部分：
   - Source: 选择 **GitHub Actions**
3. 等待首次部署完成（约 2-3 分钟）

### 3. 访问网站

部署完成后，你的网站将可在以下地址访问：
```
https://[your-username].github.io/ai-news-hub/
```

---

## 🔄 自动更新机制

### 定时任务

GitHub Actions 每天自动运行两次（北京时间）：
- **08:00** - 早间更新
- **20:00** - 晚间更新

### 手动更新

你也可以随时手动触发更新：
1. 进入仓库的 **Actions** 标签
2. 选择 "Deploy and Update" 工作流
3. 点击 **Run workflow**

---

## 📁 项目结构

```
ai-news-hub/
├── index.html              # 主页面
├── styles.css              # 样式文件
├── script.js               # 交互逻辑
├── data/
│   └── news.json           # 新闻数据（自动生成）
├── scripts/
│   ├── fetch-news.js       # 新闻抓取脚本
│   └── update.sh           # 更新工作流脚本
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 配置
└── README.md               # 本文件
```

---

## 📰 数据来源

- TechCrunch AI
- The Verge
- MIT Technology Review
- Wired
- Ars Technica

---

## 🛠️ 自定义

### 修改 RSS 源

编辑 `scripts/fetch-news.js` 中的 `RSS_SOURCES` 数组：

```javascript
const RSS_SOURCES = [
    {
        name: 'Your Source Name',
        url: 'https://example.com/feed.xml',
        category: 'industry',
        parser: 'rss2'
    }
];
```

### 修改样式

编辑 `styles.css`，修改 CSS 变量即可调整主题：

```css
:root {
    --primary: #e74c3c;      /* 主色调 */
    --bg-primary: #fff;       /* 背景色 */
    --text-primary: #1a1a1a;  /* 文字色 */
}
```

---

## 📄 License

MIT License - 自由使用、修改和分发

---

## 🙏 致谢

- 设计灵感来自 [虎嗅网](https://www.huxiu.com/)
- 部署方案基于 GitHub Pages
