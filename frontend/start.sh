#!/bin/bash

# DevTools Vue3 项目启动脚本
echo "🚀 启动 DevTools Vue3 开发服务器..."

# 检查端口是否被占用
PORT=8000
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 $PORT 已被占用，尝试使用端口 8001"
    PORT=8001
fi

# 优先使用前端开发常用的服务器
if command -v npx &> /dev/null; then
    echo "✅ 使用 npx serve 启动服务器..."
    echo "🌐 访问地址: http://localhost:$PORT"
    echo "📝 按 Ctrl+C 停止服务器"
    npx serve -s . -l $PORT
elif command -v http-server &> /dev/null; then
    echo "✅ 使用 http-server 启动服务器..."
    echo "🌐 访问地址: http://localhost:$PORT"
    echo "📝 按 Ctrl+C 停止服务器"
    http-server -p $PORT -c-1
elif command -v live-server &> /dev/null; then
    echo "✅ 使用 live-server 启动服务器（支持热重载）..."
    echo "🌐 访问地址: http://localhost:$PORT"
    echo "📝 按 Ctrl+C 停止服务器"
    live-server --port=$PORT
elif command -v node &> /dev/null; then
    echo "✅ 使用 Node.js 内置服务器..."
    echo "🌐 访问地址: http://localhost:$PORT"
    echo "📝 按 Ctrl+C 停止服务器"
    npx http-server -p $PORT -c-1
elif command -v python3 &> /dev/null; then
    echo "⚠️  未找到前端开发服务器，降级使用 Python3..."
    echo "💡 建议安装: npm install -g http-server 或 npm install -g live-server"
    echo "🌐 访问地址: http://localhost:$PORT"
    echo "📝 按 Ctrl+C 停止服务器"
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "⚠️  未找到前端开发服务器，降级使用 Python..."
    echo "💡 建议安装: npm install -g http-server 或 npm install -g live-server"
    echo "🌐 访问地址: http://localhost:$PORT"
    echo "📝 按 Ctrl+C 停止服务器"
    python -m http.server $PORT
else
    echo "❌ 未找到可用的服务器"
    echo ""
    echo "💡 请安装以下任一工具："
    echo "   npm install -g http-server"
    echo "   npm install -g live-server"
    echo "   npm install -g serve"
    echo ""
    echo "然后使用以下命令启动："
    echo "   http-server -p 8000 -c-1"
    echo "   live-server --port=8000"
    echo "   npx serve -s . -l 8000"
    exit 1
fi 