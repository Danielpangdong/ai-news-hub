# 🤖 AI 深观察

每日精选全球 AI 资讯与洞见。

**在线访问**: https://danielpangdong.github.io/ai-news-hub/

---

## 特性

- 虎嗅风格资讯列表，支持深色 / 浅色模式
- 分类筛选与标题、摘要、标签搜索
- GitHub Actions 每天两次抓取公开 RSS，并部署 GitHub Pages
- 质量门禁校验 `data/news.json` 结构
- Cursor Agent 定时任务按 `.cursor/optimization/` 持续改产品本身

---

## 本地运行

```bash
node scripts/validate-news.js
python3 -m http.server 8000 --bind 0.0.0.0
```

浏览器打开 `http://127.0.0.1:8000/`。

手动抓取（需外网访问 RSS）：

```bash
chmod +x scripts/update.sh
./scripts/update.sh
```

关闭标题翻译：`AI_NEWS_TRANSLATE=0 ./scripts/update.sh`

---

## 自动更新

GitHub Actions 工作流 `Deploy and Update`：

- 北京时间 08:00、20:00 各一次
- 同一 job 内抓取、校验、提交、部署，避免「资讯已更新、站点仍是旧 SHA」

质量工作流 `Quality Gate` 每天校验 JSON 与脚本语法。

---

## 持续优化闭环

控制面在 `.cursor/optimization/`：

| 文件 | 作用 |
|------|------|
| `PLAYBOOK.md` | 每轮 Agent 必须执行的协议 |
| `STATE.json` | 阶段、分数、停止条件 |
| `BACKLOG.md` | P0–P3 待办 |

定时任务由本仓库的 Cloud Agent 订阅：阶段一次性任务 + 每日增量 + 每周审计。达标条件见该目录 README。

---

## 数据来源

- TechCrunch AI
- The Verge
- MIT Technology Review
- Wired
- Ars Technica
- OpenAI News
- Google AI Blog
- Hugging Face Blog
- Hacker News（Algolia）
- VentureBeat AI

修改源：编辑 `scripts/fetch-news.js` 中的 `RSS_SOURCES`。

---

## License

MIT
