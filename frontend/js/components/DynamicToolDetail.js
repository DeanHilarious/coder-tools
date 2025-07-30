// 动态工具详情组件
const DynamicToolDetail = {
  template: `
    <div>
      <component 
        v-if="currentComponent" 
        :is="currentComponent" 
        :tool-id="toolId"
      />
      <div v-else class="container mx-auto px-4 py-8">
        <div class="flex items-center justify-center h-64">
          <div class="text-center">
            <i class="fas fa-spinner fa-spin text-4xl text-[#165DFF] mb-4"></i>
            <p class="text-[#94A3B8]">加载工具中...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const { ref, computed, watch, onMounted } = Vue;
    const route = VueRouter.useRoute();
    const currentComponent = ref(null);
    
    const toolId = computed(() => route.params.id);
    
    // 加载工具组件
    const loadTool = async (id) => {
      try {
        currentComponent.value = null; // 显示加载状态
        const component = await ToolLoader.loadToolComponent(id);
        currentComponent.value = component;
      } catch (error) {
        console.error('加载工具失败:', error);
        currentComponent.value = ToolLoader.getPlaceholderComponent(id);
      }
    };
    
    // 监听路由变化
    watch(toolId, (newId) => {
      if (newId) {
        loadTool(newId);
      }
    }, { immediate: true });
    
    return {
      currentComponent,
      toolId
    };
  }
}; 