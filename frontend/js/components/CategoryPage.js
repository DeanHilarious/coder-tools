// 分类页面组件
const CategoryPage = {
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- 返回按钮和面包屑 -->
      <div class="flex items-center mb-8">
        <button 
          @click="$router.go(-1)"
          class="btn-primary px-4 py-2 mr-4"
        >
          <i class="fas fa-arrow-left mr-2"></i>返回
        </button>
        <nav class="text-sm">
          <router-link to="/" class="text-[#94A3B8] hover:text-[#165DFF]">首页</router-link>
          <span class="mx-2 text-[#94A3B8]">/</span>
          <span class="text-[#E2E8F0]">{{ categoryInfo?.name || '分类' }}</span>
        </nav>
      </div>

      <!-- 分类标题和描述 -->
      <div v-if="categoryInfo" class="mb-8">
        <div class="flex items-center mb-4">
          <div class="w-16 h-16 rounded-full bg-[#165DFF]/10 flex items-center justify-center mr-6">
            <i :class="categoryInfo.icon + ' text-2xl'" :style="{ color: categoryInfo.color.replace('text-', '') }"></i>
          </div>
          <div>
            <h1 class="text-3xl font-bold mb-2">{{ categoryInfo.name }}</h1>
            <p class="text-[#94A3B8]">共 {{ categoryTools.length }} 个工具，其中 {{ implementedCount }} 个可用</p>
          </div>
        </div>
      </div>

      <!-- 工具状态筛选 -->
      <div class="flex items-center space-x-4 mb-6">
        <span class="text-sm text-[#94A3B8]">筛选：</span>
        <button 
          @click="filterStatus = 'all'"
          class="px-3 py-1 rounded text-sm"
          :class="filterStatus === 'all' ? 'bg-[#165DFF] text-white' : 'border border-[#165DFF] text-[#165DFF]'"
        >
          全部 ({{ categoryTools.length }})
        </button>
        <button 
          @click="filterStatus = 'implemented'"
          class="px-3 py-1 rounded text-sm"
          :class="filterStatus === 'implemented' ? 'bg-green-500 text-white' : 'border border-green-500 text-green-500'"
        >
          可用 ({{ implementedCount }})
        </button>
        <button 
          @click="filterStatus = 'development'"
          class="px-3 py-1 rounded text-sm"
          :class="filterStatus === 'development' ? 'bg-yellow-500 text-white' : 'border border-yellow-500 text-yellow-500'"
        >
          开发中 ({{ developmentCount }})
        </button>
      </div>

      <!-- 工具列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="tool in filteredTools" 
          :key="tool.id"
          class="card p-6 hover:bg-[#383850] cursor-pointer tool-card transition-all duration-200"
          :class="{ 'opacity-50': !tool.implemented }"
          @click.stop="goToTool(tool)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center">
              <i :class="tool.icon + ' text-2xl text-[#165DFF] mr-3'"></i>
              <div>
                <h3 class="text-lg font-semibold">{{ tool.name }}</h3>
                <p class="text-sm text-[#94A3B8] mt-1">{{ tool.description }}</p>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-2">
              <span 
                v-if="tool.implemented" 
                class="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full"
              >
                可用
              </span>
              <span 
                v-else 
                class="inline-block bg-yellow-500 text-white text-xs px-2 py-1 rounded-full"
              >
                开发中
              </span>
            </div>
          </div>
          
          <div class="flex items-center justify-between text-sm text-[#94A3B8]">
            <span>{{ getCategoryName(tool.category) }}</span>
            <span v-if="tool.implemented" class="text-[#165DFF]">
              点击使用 <i class="fas fa-arrow-right ml-1"></i>
            </span>
            <span v-else class="text-yellow-500">
              敬请期待
            </span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredTools.length === 0" class="text-center py-12">
        <i class="fas fa-search text-4xl text-[#94A3B8] mb-4"></i>
        <h3 class="text-xl font-semibold mb-2">暂无工具</h3>
        <p class="text-[#94A3B8]">该分类下暂时没有符合条件的工具</p>
      </div>

      <!-- 相关分类推荐 -->
      <div v-if="relatedCategories.length > 0" class="mt-12">
        <h2 class="text-xl font-bold mb-6">相关分类</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="category in relatedCategories" 
            :key="category.id"
            class="card p-4 hover:bg-[#383850] cursor-pointer tool-card"
            @click="$router.push('/category/' + category.id)"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-[#165DFF]/10 flex items-center justify-center mr-3">
                <i :class="category.icon + ' text-[#165DFF]'"></i>
              </div>
              <div>
                <h3 class="font-semibold">{{ category.name }}</h3>
                <p class="text-xs text-[#94A3B8]">{{ category.tools.length }} 个工具</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const { ref, computed, onMounted } = Vue;
    const { useRoute, useRouter } = VueRouter;
    const route = useRoute();
    const router = useRouter();
    const { showMessage } = useNotification();
    
    const filterStatus = ref('all');
    const categoryId = computed(() => route.params.id);
    
    // 获取分类信息
    const categoryInfo = computed(() => {
      return getCategoryById(categoryId.value);
    });
    
    // 获取分类下的所有工具（已实现的工具排在前面）
    const categoryTools = computed(() => {
      if (!categoryInfo.value) return [];
      const tools = categoryInfo.value.tools || [];
      
      // 将已实现和未实现的工具分开，然后合并
      const implementedTools = tools.filter(tool => tool.implemented);
      const notImplementedTools = tools.filter(tool => !tool.implemented);
      
      return [...implementedTools, ...notImplementedTools];
    });
    
    // 已实现工具数量
    const implementedCount = computed(() => {
      return categoryTools.value.filter(tool => tool.implemented).length;
    });
    
    // 开发中工具数量  
    const developmentCount = computed(() => {
      return categoryTools.value.filter(tool => !tool.implemented).length;
    });
    
    // 筛选后的工具（保持已实现工具优先的排序）
    const filteredTools = computed(() => {
      let tools = [];
      
      if (filterStatus.value === 'all') {
        tools = categoryTools.value;
      } else if (filterStatus.value === 'implemented') {
        tools = categoryTools.value.filter(tool => tool.implemented);
      } else if (filterStatus.value === 'development') {
        tools = categoryTools.value.filter(tool => !tool.implemented);
      } else {
        tools = categoryTools.value;
      }
      
      return tools;
    });
    
    // 相关分类（排除当前分类）
    const relatedCategories = computed(() => {
      return toolsConfig.categories
        .filter(cat => cat.id !== categoryId.value)
        .slice(0, 3);
    });
    
    // 获取分类名称
    const getCategoryName = (catId) => {
      const category = getCategoryById(catId);
      return category ? category.name : catId;
    };
    
    // 跳转到工具页面
    const goToTool = (tool) => {
      if (tool.implemented) {
        router.push('/tool/' + tool.id);
      } else {
        showMessage('该工具正在开发中，敬请期待', 'info');
      }
    };
    
    // 检查分类是否存在
    onMounted(() => {
      if (!categoryInfo.value) {
        showMessage('分类不存在', 'error');
        router.push('/');
      }
    });
    
    return {
      filterStatus,
      categoryInfo,
      categoryTools,
      implementedCount,
      developmentCount,
      filteredTools,
      relatedCategories,
      getCategoryName,
      goToTool
    };
  }
}; 