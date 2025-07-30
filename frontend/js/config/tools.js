// 工具配置
const toolsConfig = {
  categories: [
    {
      id: 'format',
      name: '格式化工具',
      icon: 'fas fa-align-left',
      color: 'text-blue-400',
      tools: [
        {
          id: 'json-formatter',
          name: 'JSON格式化',
          description: '格式化并验证JSON数据，支持缩进和压缩',
          icon: 'fas fa-brackets-curly',
          category: 'format',
          implemented: true
        },
        {
          id: 'xml-formatter',
          name: 'XML格式化',
          description: '格式化XML文档',
          icon: 'fas fa-code',
          category: 'format',
          implemented: false
        },
        {
          id: 'sql-formatter',
          name: 'SQL格式化',
          description: '格式化SQL查询语句',
          icon: 'fas fa-database',
          category: 'format',
          implemented: false
        },
        {
          id: 'css-formatter',
          name: 'CSS格式化',
          description: '格式化CSS样式代码',
          icon: 'fab fa-css3-alt',
          category: 'format',
          implemented: false
        },
        {
          id: 'yaml-formatter',
          name: 'YAML格式化',
          description: '格式化和验证YAML文档，支持YAML与JSON互转',
          icon: 'fas fa-file-alt',
          category: 'format',
          implemented: true
        }
      ]
    },
    {
      id: 'convert',
      name: '转换工具',
      icon: 'fas fa-exchange-alt',
      color: 'text-green-400',
      tools: [
        {
          id: 'svg-to-png',
          name: 'SVG转PNG',
          description: '将SVG矢量图转换为PNG位图',
          icon: 'fas fa-image',
          category: 'convert',
          implemented: true
        },
        {
          id: 'json-to-csv',
          name: 'JSON转CSV',
          description: '将JSON数据转换为CSV格式',
          icon: 'fas fa-table',
          category: 'convert',
          implemented: false
        },
        {
          id: 'markdown-to-html',
          name: 'Markdown转HTML',
          description: '将Markdown文档转换为HTML',
          icon: 'fas fa-file-code',
          category: 'convert',
          implemented: false
        },
        {
          id: 'base64-encoder',
          name: 'Base64编解码',
          description: '对文本进行Base64编码和解码',
          icon: 'fas fa-lock',
          category: 'convert',
          implemented: false
        }
      ]
    },
    {
      id: 'generate',
      name: '生成工具',
      icon: 'fas fa-cogs',
      color: 'text-purple-400',
      tools: [
        {
          id: 'uuid-generator',
          name: 'UUID生成',
          description: '生成唯一标识符，支持多种版本',
          icon: 'fas fa-fingerprint',
          category: 'generate',
          implemented: false
        },
        {
          id: 'password-generator',
          name: '密码生成',
          description: '生成安全的随机密码',
          icon: 'fas fa-key',
          category: 'generate',
          implemented: true
        },
        {
          id: 'qr-code-generator',
          name: '二维码生成',
          description: '生成QR二维码',
          icon: 'fas fa-qrcode',
          category: 'generate',
          implemented: false
        },
        {
          id: 'lorem-ipsum',
          name: '占位文本生成',
          description: '生成Lorem ipsum占位文本',
          icon: 'fas fa-paragraph',
          category: 'generate',
          implemented: false
        }
      ]
    },
    {
      id: 'validate',
      name: '验证工具',
      icon: 'fas fa-check-circle',
      color: 'text-yellow-400',
      tools: [
        {
          id: 'json-validator',
          name: 'JSON验证',
          description: '验证JSON数据格式',
          icon: 'fas fa-check',
          category: 'validate',
          implemented: false
        },
        {
          id: 'regex-tester',
          name: '正则测试',
          description: '测试和调试正则表达式',
          icon: 'fas fa-search',
          category: 'validate',
          implemented: false
        },
        {
          id: 'url-validator',
          name: 'URL验证',
          description: '验证URL格式的有效性',
          icon: 'fas fa-link',
          category: 'validate',
          implemented: false
        },
        {
          id: 'email-validator',
          name: '邮箱验证',
          description: '验证邮箱地址格式',
          icon: 'fas fa-envelope',
          category: 'validate',
          implemented: false
        }
      ]
    },
    {
      id: 'dev',
      name: '开发辅助',
      icon: 'fas fa-tools',
      color: 'text-red-400',
      tools: [
        {
          id: 'color-converter',
          name: '颜色转换',
          description: '在不同颜色格式间转换',
          icon: 'fas fa-palette',
          category: 'dev',
          implemented: false
        },
        {
          id: 'timestamp-converter',
          name: '时间戳转换',
          description: '时间戳与日期格式转换',
          icon: 'fas fa-clock',
          category: 'dev',
          implemented: false
        },
        {
          id: 'unit-converter',
          name: '单位换算',
          description: '各种单位之间的换算',
          icon: 'fas fa-calculator',
          category: 'dev',
          implemented: false
        },
        {
          id: 'hash-generator',
          name: '哈希生成',
          description: '生成MD5、SHA1、SHA256等哈希值',
          icon: 'fas fa-hashtag',
          category: 'dev',
          implemented: false
        },
        {
          id: 'text-diff',
          name: '文本比对',
          description: '比较两个文本的差异，支持行级和字符级对比',
          icon: 'fas fa-not-equal',
          category: 'dev',
          implemented: true
        }
      ]
    },
    {
      id: 'network',
      name: '连接测试',
      icon: 'fas fa-network-wired',
      color: 'text-orange-400',
      tools: [
        {
          id: 'websocket-tester',
          name: 'WebSocket测试',
          description: '测试和调试WebSocket连接，支持实时消息收发',
          icon: 'fas fa-plug',
          category: 'network',
          implemented: true
        },
        {
          id: 'http-requester',
          name: 'HTTP请求测试',
          description: '发送HTTP请求并查看响应结果',
          icon: 'fas fa-globe',
          category: 'network',
          implemented: false
        },
        {
          id: 'ping-test',
          name: 'Ping测试',
          description: '测试网络连通性和延迟',
          icon: 'fas fa-signal',
          category: 'network',
          implemented: false
        },
        {
          id: 'port-scanner',
          name: '端口扫描',
          description: '检测目标主机的开放端口',
          icon: 'fas fa-door-open',
          category: 'network',
          implemented: false
        }
      ]
    }
  ]
};

// 获取所有工具
const getAllTools = () => {
  return toolsConfig.categories.flatMap(category => category.tools);
};

// 根据ID获取工具信息
const getToolById = (id) => {
  const allTools = getAllTools();
  return allTools.find(tool => tool.id === id);
};

// 获取分类信息
const getCategoryById = (id) => {
  return toolsConfig.categories.find(category => category.id === id);
};

// 获取已实现的工具
const getImplementedTools = () => {
  return getAllTools().filter(tool => tool.implemented);
};

// 获取热门工具（优先显示已实现的工具）
const getPopularTools = () => {
  const implementedTools = getAllTools().filter(tool => tool.implemented);
  const notImplementedTools = getAllTools().filter(tool => !tool.implemented);
  
  // 先显示已实现的工具，再显示未实现的工具，总共6个
  return [...implementedTools, ...notImplementedTools].slice(0, 6);
};

// 获取特色工具（返回已实现的工具，最多4个）
const getFeaturedTools = () => {
  return getAllTools().filter(tool => tool.implemented).slice(0, 4);
};

// 搜索工具
const searchTools = (query) => {
  if (!query) return getAllTools();
  
  const searchTerm = query.toLowerCase();
  return getAllTools().filter(tool => 
    tool.name.toLowerCase().includes(searchTerm) ||
    tool.description.toLowerCase().includes(searchTerm) ||
    tool.category.toLowerCase().includes(searchTerm)
  );
}; 