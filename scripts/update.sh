#!/usr/bin/env bash
# AI 资讯更新入口，由 GitHub Actions 与本地定时任务调用。
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
    echo "错误: 未安装 Node.js" >&2
    exit 1
fi

echo "AI 深观察 - 更新资讯"
echo "Node.js $(node -v)"

node scripts/fetch-news.js
node scripts/validate-news.js

echo "更新完成"
