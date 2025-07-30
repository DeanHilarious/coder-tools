# 🛠️ DevTools - 程序员工具集

> 基于 Vue3 构建的现代化程序员工具集，提供 JSON 格式化、代码转换、生成工具等功能

[![Vue](https://img.shields.io/badge/Vue-3.3+-green.svg)](https://vuejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Static](https://img.shields.io/badge/Static-部署-ready-brightgreen.svg)](https://github.com/example/nuts-tools)

## ✨ 特性

- 🚀 **零构建部署** - 纯静态文件，无需编译，直接部署
- 📱 **响应式设计** - 完美支持桌面端和移动端
- 🎨 **主题切换** - 支持明暗主题，护眼舒适
- 🔧 **模块化架构** - Vue3 组件化，易于维护和扩展
- ⚡ **实时验证** - JSON 实时语法检查
- 💾 **本地存储** - 自动保存工作内容
- ⌨️ **快捷键支持** - 提升操作效率
- 🔍 **智能搜索** - 快速找到需要的工具

## 🚀 快速开始

### 方式一：使用启动脚本（推荐）

```bash
# 克隆项目
git clone <repository-url>
cd coder-tools/frontend

# 启动开发服务器
./start.sh
```

### 方式二：使用 npm 脚本

```bash
# 进入项目目录
cd coder-tools/frontend

# 启动开发服务器
npm start        # 使用 serve 启动
npm run dev      # 使用 live-server 启动（支持热重载）
npm run serve    # 使用 http-server 启动
```

### 方式三：手动启动

```bash
# 安装全局工具（可选）
npm install -g serve live-server http-server

# 启动服务器
npx serve -s . -l 8000              # 推荐，简单快速
npx live-server --port=8000         # 支持热重载
npx http-server -p 8000 -c-1        # 经典选择
```

### 访问应用

打开浏览器访问：`http://localhost:8000`

> ⚠️ **为什么需要服务器？**
> 
> 由于项目使用了 ES 模块和动态导入，浏览器的 CORS 策略要求必须通过 HTTP(S) 协议访问，不能直接双击 HTML 文件打开。

## 🛠️ 已实现工具

### 📝 格式化工具
- ✅ **JSON 格式化** - 格式化并验证 JSON 数据，支持缩进和压缩
- ✅ **YAML 格式化** - 格式化和验证 YAML 文档，支持 YAML 与 JSON 互转

### 🔄 转换工具
- ✅ **SVG 转 PNG** - 将 SVG 矢量图转换为 PNG 位图

### 🔧 生成工具
- ✅ **密码生成器** - 生成安全的随机密码

### 🌐 网络工具
- ✅ **WebSocket 测试** - 测试和调试 WebSocket 连接，支持实时消息收发

### 📊 开发辅助
- ✅ **文本比对** - 比较两个文本的差异，支持行级和字符级对比

## 🏗️ 项目结构

```
frontend/
├── index.html                 # 主 HTML 文件
├── package.json              # 项目配置
├── start.sh                  # 启动脚本
├── README.md                 # 说明文档
├── js/
│   ├── components/           # Vue 组件
│   │   ├── AppLayout.js      # 主布局组件
│   │   ├── AppNavigation.js  # 导航组件
│   │   ├── HomePage.js       # 首页组件
│   │   ├── JsonFormatterTool.js  # JSON 格式化工具
│   │   ├── ToolDetail.js     # 工具详情组件
│   │   └── ...               # 其他工具组件
│   ├── config/
│   │   └── tools.js          # 工具配置
│   ├── shared/
│   │   ├── ToolLoader.js     # 工具加载器
│   │   └── ToolPageBase.js   # 工具页面基类
│   ├── tools/                # 具体工具实现
│   │   ├── json-formatter.js
│   │   ├── password-generator.js
│   │   ├── svg-to-png.js
│   │   ├── text-diff.js
│   │   ├── websocket-tester.js
│   │   └── yaml-formatter.js
│   └── utils/
│       └── composables.js    # 可复用函数
└── Dockerfile               # Docker 配置
```

## 🛠️ 技术栈

- **Vue 3** - 前端框架（通过 CDN 引入）
- **Vue Router 4** - 路由管理
- **Tailwind CSS** - 样式框架（通过 CDN 引入）
- **Highlight.js** - 代码高亮
- **Font Awesome** - 图标库
- **ES Modules** - 现代模块化开发

## 🔧 开发指南

### 添加新工具

1. **配置工具信息**
   ```javascript
   // 在 js/config/tools.js 中添加工具配置
   {
     id: 'new-tool',
     name: '新工具',
     description: '工具描述',
     icon: 'fas fa-icon',
     category: 'category-id',
     implemented: true
   }
   ```

2. **创建工具组件**
   ```javascript
   // 在 js/tools/ 中创建工具实现
   const NewTool = {
     template: `
       <div class="container mx-auto px-4 py-8">
         <!-- 工具内容 -->
       </div>
     `,
     setup() {
       // 使用组合式 API
       return {
         // 返回响应式数据和方法
       };
     }
   };
   ```

3. **注册工具**
   ```javascript
   // 在 js/shared/ToolLoader.js 中注册工具
   import NewTool from '../tools/new-tool.js';
   // 添加到工具映射中
   ```

### 组件开发规范

- 使用 Vue 3 组合式 API
- 遵循现有的颜色方案和样式
- 确保移动端适配
- 支持明暗主题
- 添加适当的错误处理

## 🚀 部署

### 静态文件部署

这是一个纯静态文件项目，部署非常简单：

```bash
# 直接将 frontend 目录上传到任何静态文件服务器
# 支持以下平台：
# - Nginx/Apache
# - GitHub Pages
# - Netlify
# - Vercel
# - Surge.sh
# - 腾讯云静态网站托管
# - 阿里云 OSS 静态网站托管
```

### Docker 部署

```bash
# 构建镜像
docker build -t devtools-frontend .

# 运行容器
docker run -p 8080:80 devtools-frontend
```

### 部署优势

- ✅ **零构建时间** - 无需编译，直接部署
- ✅ **极小体积** - 只有源码文件
- ✅ **高性能** - 静态文件，CDN 友好
- ✅ **兼容性好** - 支持所有现代浏览器
- ✅ **部署简单** - 任何静态服务器都可以

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

- 项目主页：[GitHub Repository]
- 问题反馈：[GitHub Issues]
- 邮箱：dev@example.com

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐️**

</div> 