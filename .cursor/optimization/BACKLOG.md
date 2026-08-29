# 优化待办

状态：`[ ]` 未做 · `[x]` 已完成 · `[-]` 取消

## P0 — 必须先做

- [x] p0-restore-fetch-scripts：恢复 `scripts/fetch-news.js` 与 `scripts/update.sh`，工作流不再因缺文件失败
- [x] p0-fix-refresh-mock：刷新按钮改为重新拉取 `data/news.json`，禁止注入虚构资讯
- [x] p0-fix-pages-base-path：Logo / 资源在 GitHub Pages 子目录下可用
- [x] p0-fix-deploy-job-race：抓取与部署放在同一 job，部署产物含最新 JSON

## P1 — 产品可用

- [x] p1-real-rss-verified：在 CI 或本地验证至少 3 个 RSS 源可抓到近 7 天条目；失败源可降级
- [x] p1-news-schema：`validate-news.js` 作为质量门禁，拒绝缺字段 / 非法 URL
- [x] p1-seo-basics：canonical、Open Graph、twitter card、主题色
- [x] p1-a11y-basics：按钮 aria-label、弹窗 dialog、搜索标签、可见焦点、跳过导航
- [x] p1-dark-category-contrast：深色主题下分类色对比度可读
- [x] p1-empty-error-states：JSON 加载失败有明确错误态，而不是默默用过期缓存冒充「今日」

## P2 — 体验与内容

- [x] p2-more-sources：增加 Hacker News Algolia、OpenAI / Google AI blog 等稳定源
- [x] p2-translation-fallback：可选翻译 API + 缓存；失败保留英文，不再写「需翻译」污染标题
- [x] p2-relative-time：按 `date`/`publishedAt` 实时计算「x 小时前」
- [x] p2-keyboard-list：列表可用键盘打开详情，焦点回到触发项
- [x] p2-mobile-nav：窄屏导航不挤压 Logo，搜索在移动端易用
- [x] p2-og-image-and-favicon：真实 favicon / apple-touch-icon，而不是仅 emoji data URI

## P3 — 最佳效果

- [x] p3-pwa-offline：manifest + service worker，离线可读最近缓存
- [x] p3-sitemap-robots：静态 sitemap.xml / robots.txt
- [ ] p3-performance：字体与 CSS 不阻塞首屏，Lighthouse 性能 ≥ 90
- [x] p3-content-dedup：跨源标题相似度去重，热门按源权重而非随机
- [x] p3-images：RSS 封面图（防热链失败回退 emoji）
- [x] p3-readme-live-url：README 换成真实 Pages 地址与优化闭环说明
