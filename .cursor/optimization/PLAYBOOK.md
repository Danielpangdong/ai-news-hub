# 优化轮次协议

你是 `ai-news-hub` 的持续优化 Agent。每次被定时器唤醒，必须完整走完下面步骤，不要只汇报计划。

## 0. 启动检查

1. 读取 `.cursor/optimization/STATE.json` 与 `BACKLOG.md`。
2. 若 `stopRequested` 为 true，或六项分数均 ≥ 90 且无未完成 P0/P1：
   - 将 `status` 设为 `completed`
   - 取消每日增量定时器（保留每周审计）
   - 更新 Goal 为 complete
   - 结束本轮
3. 确认工作分支为 `cursor/continuous-optimization-loop-dc56`（若不存在则从 `main` 创建同名分支，后缀保持 `-dc56`）。
4. `git pull` 后基于最新 `main` rebase 或合并，避免分叉。

## 1. 选任务（只做一项主任务）

按顺序选**一项**：

1. `BACKLOG.md` 中未完成的最高优先级（P0 > P1 > P2）
2. 若本轮 `assignedPhase` 有未完成项，做该阶段
3. 否则选分数最低的维度，做能提升该分数的最小完整改动

禁止同一轮同时大改管线、视觉和文案。可以附带不超过 20 行的必要修复。

## 2. 实施标准

- 改动能独立验证：脚本可跑、页面可点、JSON 可校验
- 禁止占位符、TODO、假数据冒充真实资讯
- `scripts/fetch-news.js` 失败时必须保留旧数据并返回非零以外的可观测日志；只有「零条且无法读写」才应让 CI 失败
- 前端路径按 GitHub Pages 子目录 ` /ai-news-hub/` 与本地根路径两种情况都可用
- 密钥只来自环境变量；翻译 API 失败必须回退到英文原文
- 用户输入（搜索）只用于过滤，写入 DOM 前必须转义

## 3. 验证

按改动类型选择：

- 脚本：`node scripts/validate-news.js`；有网络时再跑 `node scripts/fetch-news.js`
- 前端：用静态服务器打开首页，走一遍分类 / 搜索 / 弹窗 / 主题 / 刷新
- 工作流：确认 YAML 语法与权限合理

## 4. 更新控制面

编辑 `STATE.json`：

- `cycle` + 1
- `lastRunAt` 设为 ISO 时间
- `lastChange` 写本轮做了什么
- 按证据上调相关分数（每次最多 +8，禁止无证据拉满）
- 把完成项移入 `completedIds`
- 若定时器将过期，重新订阅同名定时器

同步勾掉 `BACKLOG.md` 已完成项。

## 5. 提交与 PR

1. `git add` / `git commit` / `git push -u origin <branch>`
2. 用仓库的 PR 工具更新已有 PR，不要新开平行 PR（除非原 PR 已关闭）
3. 订阅该 PR 的 CI；失败则修复后再推

## 6. 定时器维护

- 每日增量：`opt-daily-improve`
- 每周审计：`opt-weekly-audit`
- 阶段一次性任务过期后不要重建，除非该阶段仍未完成

订阅失效时，用相同 `name` 与协议中的 prompt 重新订阅。
