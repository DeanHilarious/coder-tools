// 首页组件
const HomePage = {
  template: `
    <div>
      <!-- 英雄区域 -->
      <section class="hero-section bg-gradient-to-r from-[#1E1E2E] to-[#2D2D3F] py-12">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">一站式程序员工具集</h1>
          <p class="text-lg md:text-xl text-[#94A3B8] mb-8">提升开发效率的必备工具箱</p>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div 
              v-for="tool in featuredTools" 
              :key="tool.id"
              class="card p-4 hover:bg-[#383850] cursor-pointer tool-card"
              @click="$router.push('/tool/' + tool.id)"
            >
              <i :class="tool.icon + ' text-2xl text-[#165DFF] mb-2'"></i>
              <h3 class="font-semibold">{{ tool.name }}</h3>
              <span v-if="tool.implemented" class="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full mt-2">
                可用
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 工具分类展示区 -->
      <section class="container mx-auto px-4 py-12">
        <h2 class="text-2xl font-bold mb-8">工具分类</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 tool-grid">
          <div 
            v-for="category in filteredCategories" 
            :key="category.id"
            :id="'category-' + category.id"
            class="card p-6 hover:bg-[#383850] cursor-pointer tool-card"
          >
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 rounded-full bg-[#165DFF]/10 flex items-center justify-center mr-4">
                <i :class="category.icon + ' text-[#165DFF]'"></i>
              </div>
              <h3 class="text-xl font-semibold">{{ category.name }}</h3>
            </div>
            <ul class="space-y-2 text-[#94A3B8]">
              <li 
                v-for="tool in category.tools.slice(0, 3)" 
                :key="tool.id"
                class="flex items-center justify-between cursor-pointer hover:text-[#165DFF]"
                @click="$router.push('/tool/' + tool.id)"
              >
                <div class="flex items-center">
                  <i :class="tool.implemented ? 'fas fa-check-circle text-[#36D399]' : 'fas fa-clock text-yellow-400'" class="mr-2"></i>
                  {{ tool.name }}
                </div>
                <span v-if="tool.implemented" class="text-xs bg-green-500 text-white px-2 py-1 rounded">
                  可用
                </span>
              </li>
            </ul>
            <button 
              class="mt-4 text-[#165DFF] hover:underline"
              @click.stop="showCategoryTools(category.id)"
            >
              查看全部 ({{ category.tools.length }}) →
            </button>
          </div>
        </div>
      </section>

      <!-- 热门工具列表 -->
      <section class="container mx-auto px-4 py-12">
        <h2 class="text-2xl font-bold mb-8">热门工具</h2>
        
        <div class="flex overflow-x-auto pb-4 space-x-4">
          <div 
            v-for="tool in popularTools" 
            :key="tool.id"
            class="card flex-shrink-0 w-64 p-4 hover:bg-[#383850] cursor-pointer tool-card"
            @click="$router.push('/tool/' + tool.id)"
          >
            <div class="flex items-center justify-between mb-2">
              <i :class="tool.icon + ' text-2xl text-[#165DFF]'"></i>
              <span v-if="tool.implemented" class="text-xs bg-green-500 text-white px-2 py-1 rounded">
                可用
              </span>
              <span v-else class="text-xs bg-yellow-500 text-white px-2 py-1 rounded">
                开发中
              </span>
            </div>
            <h3 class="font-semibold mb-2">{{ tool.name }}</h3>
            <p class="text-sm text-[#94A3B8]">{{ tool.description }}</p>
          </div>
        </div>
      </section>
    </div>
  `,
  setup() {
    const { ref, computed } = Vue;
    const router = VueRouter.useRouter();
    const searchQuery = ref('');
    
    const allTools = computed(() => {
      return getAllTools();
    });

    const featuredTools = computed(() => {
      return getFeaturedTools();
    });

    const popularTools = computed(() => {
      return getPopularTools();
    });

    const filteredCategories = computed(() => {
      if (!searchQuery.value) {
        return toolsConfig.categories;
      }
      
      return toolsConfig.categories.map(category => ({
        ...category,
        tools: category.tools.filter(tool => 
          tool.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
      })).filter(category => category.tools.length > 0);
    });

    const showCategoryTools = (categoryId) => {
      // 导航到分类页面
      router.push('/category/' + categoryId);
    };

    const scrollToCategory = (categoryId) => {
      const element = document.getElementById('category-' + categoryId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return {
      searchQuery,
      featuredTools,
      popularTools,
      filteredCategories,
      showCategoryTools,
      scrollToCategory
    };
  }
}; 