// 动态工具加载系统
const ToolLoader = {
  // 工具组件缓存
  toolComponents: {},
  
  // 动态加载工具组件
  async loadToolComponent(toolId) {
    // 如果已经加载过，直接返回
    if (this.toolComponents[toolId]) {
      return this.toolComponents[toolId];
    }
    
    try {
      // 动态加载工具组件脚本
      await this.loadScript(`js/tools/${toolId}.js`);
      
      // 获取加载的组件
      const component = window[this.getComponentName(toolId)];
      
      if (component) {
        this.toolComponents[toolId] = component;
        return component;
      } else {
        throw new Error(`工具组件 ${toolId} 未找到`);
      }
    } catch (error) {
      console.error(`加载工具组件失败: ${toolId}`, error);
      return this.getPlaceholderComponent(toolId);
    }
  },
  
  // 加载脚本
  loadScript(src) {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载过
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },
  
  // 获取组件名称
  getComponentName(toolId) {
    // 将 kebab-case 转换为 PascalCase
    return toolId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('') + 'Tool';
  },
  
  // 获取占位符组件（用于未实现的工具）
  getPlaceholderComponent(toolId) {
    const tool = getToolById(toolId);
    
    return {
      template: `
        <tool-page-base :tool-id="toolId">
          <div class="card p-8 text-center">
            <i :class="toolInfo.icon + ' text-6xl text-[#165DFF] mb-4'"></i>
            <h3 class="text-xl font-semibold mb-2">{{ toolInfo.name }}</h3>
            <p class="text-[#94A3B8] mb-4">{{ toolInfo.description }}</p>
            <div class="mb-6">
              <span class="inline-block bg-yellow-500 text-white px-4 py-2 rounded-full mb-2">
                <i class="fas fa-hammer mr-2"></i>
                开发中
              </span>
            </div>
            
            <div class="bg-[#1E1E2E] p-6 rounded-lg text-left mb-6">
              <h4 class="text-lg font-semibold mb-3 text-[#165DFF]">开发计划</h4>
              <div class="space-y-2 text-sm">
                <div class="flex items-center text-green-400">
                  <i class="fas fa-check mr-2"></i>
                  <span>需求分析和设计</span>
                </div>
                <div class="flex items-center text-yellow-400">
                  <i class="fas fa-clock mr-2"></i>
                  <span>核心功能开发</span>
                </div>
                <div class="flex items-center text-gray-400">
                  <i class="fas fa-circle mr-2"></i>
                  <span>测试和优化</span>
                </div>
                <div class="flex items-center text-gray-400">
                  <i class="fas fa-circle mr-2"></i>
                  <span>发布上线</span>
                </div>
              </div>
            </div>
            
            <div class="flex justify-center space-x-4">
              <button @click="requestFeature" class="btn-primary px-6 py-2">
                <i class="fas fa-lightbulb mr-2"></i>
                提交需求
              </button>
              <button @click="$router.push('/')" class="border border-[#165DFF] text-[#165DFF] hover:bg-[#165DFF] hover:text-white px-6 py-2 rounded">
                <i class="fas fa-home mr-2"></i>
                返回首页
              </button>
            </div>
          </div>
        </tool-page-base>
      `,
      components: {
        ToolPageBase
      },
      props: {
        toolId: String
      },
      setup(props) {
        const { computed } = Vue;
        const { showMessage } = useNotification();
        
        const toolInfo = computed(() => {
          return getToolById(props.toolId) || {
            name: '未知工具',
            description: '工具不存在',
            icon: 'fas fa-question'
          };
        });
        
        const requestFeature = () => {
          showMessage('功能需求已提交，我们会尽快开发！', 'success');
        };
        
        return {
          toolInfo,
          requestFeature
        };
      }
    };
  }
}; 