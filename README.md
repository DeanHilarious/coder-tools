# 程序员工具网站 (Nuts Tools)

一个基于Django + Vue3开发的程序员工具集合网站，提供常用的开发工具如SVG转PNG、JSON格式化、字符串加解密等。

## 技术栈

### 后端
- **Django 4.2**: Web框架
- **Django REST Framework**: API开发
- **PostgreSQL**: 主数据库
- **Redis**: 缓存和会话存储
- **Celery**: 异步任务处理
- **Docker**: 容器化部署

### 前端
- **Vue 3**: 前端框架
- **Vite**: 构建工具
- **Vue Router**: 路由管理
- **Pinia**: 状态管理
- **Tailwind CSS**: 样式框架
- **Element Plus**: UI组件库

## 项目结构

```
nuts-tools/
├── backend/                    # Django后端
│   ├── config/                # 项目配置
│   ├── apps/                  # 应用模块
│   │   ├── core/             # 核心模块
│   │   ├── tools/            # 工具管理
│   │   ├── users/            # 用户管理
│   │   └── analytics/        # 数据分析
│   ├── static/               # 静态文件
│   ├── media/                # 媒体文件
│   └── requirements.txt      # Python依赖
├── frontend/                  # Vue3前端
│   ├── src/
│   │   ├── components/       # 组件
│   │   ├── views/           # 页面
│   │   ├── router/          # 路由
│   │   ├── store/           # 状态管理
│   │   ├── utils/           # 工具函数
│   │   └── api/             # API接口
│   ├── public/              # 公共文件
│   └── package.json         # 前端依赖
├── docker-compose.yml        # Docker编排
├── nginx.conf               # Nginx配置
└── docs/                    # 文档
```

## 功能特性

### 核心功能
- **工具分类管理**: 按类型组织工具
- **工具动态加载**: 支持插件化工具添加
- **文件处理**: 支持文件上传和转换
- **实时处理**: 文本工具实时预览
- **历史记录**: 保存用户操作历史
- **收藏夹**: 用户可收藏常用工具

### 工具类型
1. **文件转换**: SVG转PNG、PDF转图片等
2. **文本处理**: JSON格式化、Base64编解码等
3. **加密解密**: MD5、SHA256、AES等
4. **开发工具**: 正则表达式测试、Color Picker等
5. **系统工具**: 时间戳转换、URL编解码等

## 数据库设计

### 核心表结构
- **工具分类表**: 管理工具分类
- **工具信息表**: 存储工具元数据
- **用户表**: 用户信息管理
- **使用记录表**: 工具使用统计
- **收藏表**: 用户收藏管理

## 部署说明

### 开发环境
1. 克隆项目
2. 启动后端：`cd backend && python manage.py runserver`
3. 启动前端：`cd frontend && npm run dev`

### 生产环境
使用Docker Compose一键部署：
```bash
docker-compose up -d
```

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

MIT License 