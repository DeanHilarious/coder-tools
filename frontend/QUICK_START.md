# 🚀 快速启动指南

## 1分钟启动项目

### 方式1：一键启动（推荐）

```bash
cd frontend
./start.sh
```

### 方式2：使用npm

```bash
cd frontend
npm start
```

### 方式3：手动选择工具

```bash
# 选择一个你喜欢的工具
npx serve -s . -l 8000              # 简单快速
npx live-server --port=8000         # 支持热重载  
npx http-server -p 8000 -c-1        # 经典选择
```

## 📱 访问地址

启动后访问：**http://localhost:8000**

## 🛠️ 开发工具安装

如果没有前端开发工具，快速安装：

```bash
# 安装推荐工具（选择一个即可）
npm install -g serve              # 最简单
npm install -g live-server        # 支持热重载
npm install -g http-server        # 最常用

# 或者一次性安装所有
npm run install-tools
```

## 🎯 功能验证

1. **JSON格式化测试**：
   - 访问首页，点击"JSON格式化"
   - 点击"加载示例"按钮
   - 点击"格式化"按钮
   - 查看格式化结果

2. **主题切换测试**：
   - 点击导航栏右上角的月亮/太阳图标
   - 确认主题正常切换

3. **响应式测试**：
   - 调整浏览器窗口大小
   - 确认移动端菜单正常工作

## ❓ 常见问题

### Q: 为什么不能直接双击HTML文件？
A: 项目使用了ES模块，需要HTTP服务器运行以避免CORS限制。

### Q: 启动失败怎么办？
A: 确保你有Node.js环境，然后运行：
```bash
npm install -g http-server
http-server -p 8000 -c-1
```

### Q: 端口被占用怎么办？
A: 启动脚本会自动尝试8001端口，或手动指定：
```bash
npx serve -s . -l 8001
```

## 🔧 故障排除

1. **检查Node.js环境**：
   ```bash
   node --version
   npm --version
   ```

2. **清除缓存**：
   ```bash
   # 清除浏览器缓存，或使用无痕模式
   ```

3. **权限问题**：
   ```bash
   chmod +x start.sh  # macOS/Linux
   ```

## 🎉 开始开发

现在你可以：
- 修改 `js/components/` 中的组件
- 在 `js/config/tools.js` 中添加新工具
- 自定义样式和功能

Happy Coding! 🎈 