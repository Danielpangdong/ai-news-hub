# 持续优化闭环

本目录是 `ai-news-hub` 的**自我优化控制面**。Cursor Cloud Agent 按定时任务读取这里的状态，执行下一轮可验证改进，直到质量门槛达标。

## 为什么用这套方案

| 方案 | 原理 | 适用 |
|------|------|------|
| A. Agent 定时器 + 本控制面（当前） | 本对话的 `subscribe_timer` 唤醒 Agent，按 PLAYBOOK 改代码并开/更 PR | 需要判断力的产品与架构改进 |
| B. 仅 GitHub Actions | cron 跑脚本，做抓取、校验、部署 | 机械、可重复的数据与质量门禁 |
| C. 仅 Cursor Automations 控制台 | 在 cursor.com 配独立自动化 | 跨仓库、需独立额度与权限时 |

推荐 **A + B**：Actions 保证资讯每天更新；Agent 定时器持续升级产品本身。

## 文件

- `PLAYBOOK.md`：每一轮必须遵守的执行协议
- `STATE.json`：当前阶段、分数、停止条件（机器可读）
- `BACKLOG.md`：按优先级排列的改进项

## 质量门槛（全部满足才算「最佳效果」）

1. `STATE.json` 中六项分数均 ≥ 90
2. `BACKLOG.md` 中无未完成的 P0 / P1
3. `scripts/fetch-news.js` 在 CI 中能产出合法 `data/news.json`
4. 首页在桌面与窄屏下可完成：浏览、分类、搜索、详情、主题切换

未达标时，每日定时任务必须继续选一项最高优先级工作落地。
