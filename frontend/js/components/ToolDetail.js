// 工具详情路由组件
const ToolDetail = {
  template: `
    <div>
      <JsonFormatterTool v-if="toolId === 'json-formatter'" />
      <div v-else class="container mx-auto px-4 py-8">
        <div class="flex items-center mb-6">
          <button class="btn-primary px-4 py-2 mr-4" @click="$router.push('/')">
            <i class="fas fa-arrow-left mr-2"></i>返回首页
          </button>
          <div>
            <h2 class="text-2xl font-bold">{{ toolInfo.name }}</h2>
            <p class="text-[#94A3B8]">{{ toolInfo.description }}</p>
          </div>
        </div>
        
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
        
        <!-- 相关工具推荐 -->
        <div class="card p-6 mt-8">
          <h3 class="text-lg font-semibold mb-4">相关工具推荐</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              v-for="tool in relatedTools" 
              :key="tool.id"
              class="card p-4 hover:bg-[#383850] cursor-pointer relative"
              @click="$router.push('/tool/' + tool.id)"
            >
              <div class="flex items-center justify-between mb-2">
                <i :class="tool.icon + ' text-[#165DFF] text-lg'"></i>
                <span v-if="tool.implemented" class="text-xs bg-green-500 text-white px-2 py-1 rounded">
                  可用
                </span>
              </div>
              <h4 class="font-semibold mb-1">{{ tool.name }}</h4>
              <p class="text-sm text-[#94A3B8]">{{ tool.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  components: {
    JsonFormatterTool
  },
  setup() {
    const { computed } = Vue;
    const { showMessage } = useNotification();
    const route = VueRouter.useRoute();
    const toolId = computed(() => route.params.id);
    
    const toolInfo = computed(() => {
      const tool = getToolById(toolId.value);
      return tool || {
        name: '未知工具',
        description: '工具不存在',
        icon: 'fas fa-question',
        category: 'unknown'
      };
    });
    
    const relatedTools = computed(() => {
      const currentTool = toolInfo.value;
      if (!currentTool.category) return [];
      
      const category = getCategoryById(currentTool.category);
      if (!category) return [];
      
      // 返回同分类的其他工具
      return category.tools.filter(tool => tool.id !== toolId.value).slice(0, 3);
    });
    
    const requestFeature = () => {
      showMessage('功能需求已提交，我们会尽快开发！', 'success');
    };
    
    return {
      toolId,
      toolInfo,
      relatedTools,
      requestFeature
    };
  }
}; 