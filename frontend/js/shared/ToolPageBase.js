// 基础工具页面组件
const ToolPageBase = {
  props: {
    toolId: {
      type: String,
      required: true
    }
  },
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center mb-6">
        <button class="btn-primary px-4 py-2 mr-4" @click="$router.push('/')">
          <i class="fas fa-arrow-left mr-2"></i>返回首页
        </button>
        <div>
          <h2 class="text-2xl font-bold">{{ toolInfo.name }}</h2>
          <p class="text-[#94A3B8]">{{ toolInfo.description }}</p>
        </div>
      </div>
      
      <!-- 工具内容插槽 -->
      <slot></slot>
      
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
  `,
  setup(props) {
    const { computed } = Vue;
    
    const toolInfo = computed(() => {
      const tool = getToolById(props.toolId);
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
      return category.tools.filter(tool => tool.id !== props.toolId).slice(0, 3);
    });
    
    return {
      toolInfo,
      relatedTools
    };
  }
}; 