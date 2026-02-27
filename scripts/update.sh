#!/bin/bash

# AI 资讯更新工作流脚本
# 由 GitHub Actions 调用，每天自动运行

set -e

echo "🤖 AI 深观察 - 自动更新任务"
echo "=============================="
echo ""

# 进入脚本目录
cd "$(dirname "$0")"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    exit 1
fi

echo "📦 Node.js 版本: $(node -v)"
echo ""

# 运行抓取脚本
echo "🚀 开始抓取最新资讯..."
node fetch-news.js

# 检查是否成功
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 资讯抓取成功！"
    
    # 如果有新数据，触发 Git 提交
    if [ -f "../data/news.json" ]; then
        echo "📁 数据文件已更新"
    fi
else
    echo ""
    echo "⚠️ 抓取过程中有错误，但继续执行"
fi

echo ""
echo "🎉 任务完成！"
