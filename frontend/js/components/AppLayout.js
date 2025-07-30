// 主布局组件
const AppLayout = {
  template: `
    <div>
      <AppNavigation @search="handleSearch" @scroll-to-category="scrollToCategory" />
      <main>
        <router-view />
      </main>
      <footer class="bg-[#2D2D3F] py-8 mt-12">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="mb-4 md:mb-0">
              <div class="flex items-center space-x-2">
                <i class="fas fa-code text-xl text-[#165DFF]"></i>
                <span class="text-xl font-bold">DevTools</span>
              </div>
              <p class="text-[#94A3B8] mt-2">一站式程序员工具集</p>
            </div>
            
            <div class="flex space-x-6">
              <a href="#" class="hover:text-[#165DFF] transition" @click="showAbout">关于我们</a>
              <a href="#" class="hover:text-[#165DFF] transition" @click="showHelp">帮助中心</a>
              <a href="#" class="hover:text-[#165DFF] transition" @click="showFeedback">反馈建议</a>
              <a href="https://github.com" target="_blank" class="hover:text-[#165DFF] transition">
                <i class="fab fa-github mr-1"></i>GitHub
              </a>
            </div>
          </div>
          
          <div class="border-t border-[#383850] mt-8 pt-8 text-center text-[#94A3B8]">
            <p>© 2024 DevTools. All rights reserved.</p>
            <p class="mt-2">基于Vue3构建的现代化工具集</p>
            <div class="mt-4 flex justify-center space-x-4 text-sm">
              <span>已实现工具: {{ implementedToolsCount }}</span>
              <span>|</span>
              <span>开发中工具: {{ developingToolsCount }}</span>
              <span>|</span>
              <span>总计: {{ totalToolsCount }}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  components: {
    AppNavigation
  },
  setup() {
    const { computed } = Vue;
    const { showMessage } = useNotification();
    const router = VueRouter.useRouter();
    
    const implementedToolsCount = computed(() => {
      return getImplementedTools().length;
    });
    
    const developingToolsCount = computed(() => {
      return getAllTools().length - getImplementedTools().length;
    });
    
    const totalToolsCount = computed(() => {
      return getAllTools().length;
    });
    
    const handleSearch = (query) => {
      // 如果在首页，直接触发搜索
      if (router.currentRoute.value.path === '/') {
        // 可以通过事件总线或者状态管理来处理搜索
        console.log('搜索:', query);
      } else {
        // 如果不在首页，跳转到首页并传递搜索参数
        router.push({ path: '/', query: { search: query } });
      }
    };
    
    const scrollToCategory = (categoryId) => {
      // 如果不在首页，先跳转到首页
      if (router.currentRoute.value.path !== '/') {
        router.push('/').then(() => {
          setTimeout(() => {
            const element = document.getElementById('category-' + categoryId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        });
      } else {
        const element = document.getElementById('category-' + categoryId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    
    const showAbout = () => {
      showMessage('关于我们：DevTools 是一个现代化的程序员工具集，致力于提升开发效率', 'info');
    };
    
    const showHelp = () => {
      showMessage('帮助中心：如有问题请查看文档或联系我们', 'info');
    };
    
    const showFeedback = () => {
      showMessage('感谢您的反馈！请通过GitHub Issues提交建议', 'success');
    };
    
    return {
      implementedToolsCount,
      developingToolsCount,
      totalToolsCount,
      handleSearch,
      scrollToCategory,
      showAbout,
      showHelp,
      showFeedback
    };
  }
}; 