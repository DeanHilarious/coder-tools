# 项目架构文档

## 📁 文件结构

```
frontend/
├── index.html              # 主页面
├── js/
│   ├── components/         # 核心组件
│   │   ├── AppLayout.js    # 应用布局
│   │   ├── AppNavigation.js # 导航组件
│   │   ├── HomePage.js     # 首页组件
│   │   └── DynamicToolDetail.js # 动态工具详情组件
│   ├── shared/            # 共享组件和工具
│   │   ├── ToolPageBase.js # 工具页面基础组件
│   │   └── ToolLoader.js   # 动态工具加载器
│   ├── tools/             # 工具组件 (按需加载)
│   │   ├── json-formatter.js
│   │   ├── password-generator.js
│   │   └── ...
│   ├── config/            # 配置文件
│   │   └── tools.js       # 工具配置
│   └── utils/             # 工具函数
│       └── composables.js # 可复用的组合式函数
└── package.json
```

## 🏗️ 架构设计

### 1. 模块化架构

**优势：**
- 每个工具都是独立的Vue组件
- 按需加载，提高性能
- 易于维护和扩展
- 代码复用性高

### 2. 核心组件

#### ToolPageBase.js
- 提供工具页面的基础模板
- 包含通用的页面结构（头部、相关工具推荐）
- 通过插槽系统允许工具组件自定义内容

#### ToolLoader.js
- 动态加载工具组件
- 组件缓存机制，避免重复加载
- 自动处理加载失败的情况
- 为未实现的工具提供占位符组件

#### DynamicToolDetail.js
- 动态工具详情页面
- 根据路由参数加载对应的工具组件
- 显示加载状态

### 3. 工具组件开发

#### 创建新工具的步骤：

1. **在 `js/tools/` 目录下创建新文件**
   ```javascript
   // 例如：js/tools/my-tool.js
   const MyToolTool = {
     template: `
       <tool-page-base :tool-id="toolId">
         <!-- 工具内容 -->
       </tool-page-base>
     `,
     components: {
       ToolPageBase
     },
     props: {
       toolId: {
         type: String,
         default: 'my-tool'
       }
     },
     setup(props) {
       // 工具逻辑
     }
   };
   
   // 🚨 重要：必须暴露组件到全局
   window.MyToolTool = MyToolTool;
   ```

2. **在 `js/config/tools.js` 中配置工具**
   ```javascript
   {
     id: 'my-tool',
     name: '我的工具',
     description: '工具描述',
     icon: 'fas fa-tools',
     category: 'dev',
     implemented: true
   }
   ```

3. **组件会自动加载** - 无需修改其他文件

### 4. 命名约定

- **工具ID**: kebab-case (例如: `json-formatter`)
- **组件名**: PascalCase + Tool 后缀 (例如: `JsonFormatterTool`)
- **文件名**: 与工具ID相同 (例如: `json-formatter.js`)

### 5. 工具组件模板

```javascript
const ToolNameTool = {
  template: `
    <tool-page-base :tool-id="toolId">
      <!-- 工具特定内容 -->
    </tool-page-base>
  `,
  components: {
    ToolPageBase
  },
  props: {
    toolId: {
      type: String,
      default: 'tool-name'
    }
  },
  setup(props) {
    const { ref, computed } = Vue;
    const { showMessage } = useNotification();
    
    // 工具逻辑
    
    return {
      // 返回模板需要的数据和方法
    };
  }
};

// 🚨 重要：暴露组件到全局，供 ToolLoader 使用
window.ToolNameTool = ToolNameTool;
```

## 🚀 部署和维护

### 开发新工具
1. 复制现有工具组件作为模板
2. 修改工具逻辑和界面
3. 更新工具配置
4. 测试功能

### 性能优化
- 组件按需加载
- 已加载的组件会被缓存
- 最小化全局依赖

### 扩展性
- 新增工具无需修改核心代码
- 支持无限数量的工具
- 每个工具都可以有独特的功能和界面

## 📚 可复用组件

### useNotification()
- 显示消息提示
- 支持不同类型：success, warning, error, info

### useClipboard()
- 复制文本到剪贴板
- 自动显示复制成功提示

### useDownload()
- 下载文件
- 支持不同文件类型

### useTheme()
- 主题切换
- 本地存储记忆用户偏好

## 💡 最佳实践

1. **工具组件应该是自包含的**
2. **使用 ToolPageBase 提供一致的用户体验**
3. **合理使用可复用的组合式函数**
4. **为工具提供清晰的错误处理**
5. **支持键盘快捷键提升用户体验**

这个架构设计使得添加新工具变得非常简单，同时保持了代码的清晰性和可维护性。 