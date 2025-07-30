// 导航组件
const AppNavigation = {
  template: `
    <nav class="sticky top-0 z-50 bg-[#2D2D3F] shadow-md">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <i class="fas fa-code text-xl text-[#165DFF]"></i>
          <span class="text-xl font-bold cursor-pointer" @click="$router.push('/')">DevTools</span>
        </div>
        
        <div class="hidden md:flex items-center space-x-6">
          <a href="#" class="hover:text-[#165DFF] transition" @click="scrollToCategory('format')">格式化工具</a>
          <a href="#" class="hover:text-[#165DFF] transition" @click="scrollToCategory('convert')">转换工具</a>
          <a href="#" class="hover:text-[#165DFF] transition" @click="scrollToCategory('generate')">生成工具</a>
          <a href="#" class="hover:text-[#165DFF] transition" @click="scrollToCategory('validate')">验证工具</a>
          <a href="#" class="hover:text-[#165DFF] transition" @click="scrollToCategory('dev')">开发辅助</a>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input 
              type="text" 
              placeholder="搜索工具..." 
              class="input-field px-4 py-2 w-40 md:w-64 focus:outline-none focus:ring-2 focus:ring-[#165DFF]"
              v-model="searchQuery"
              @input="$emit('search', searchQuery)"
            >
            <i class="fas fa-search absolute right-3 top-2.5 text-[#94A3B8]"></i>
          </div>
          <button @click="toggleTheme" class="p-2 rounded-full hover:bg-[#383850]">
            <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
          <button class="md:hidden p-2" @click="toggleMobileMenu">
            <i :class="showMobileMenu ? 'fas fa-times' : 'fas fa-bars'"></i>
          </button>
        </div>
      </div>
      
      <!-- 移动端菜单 -->
      <div v-show="showMobileMenu" class="md:hidden bg-[#2D2D3F] py-2 px-4">
        <a href="#" class="block py-2 hover:text-[#165DFF]" @click="scrollToCategory('format')">格式化工具</a>
        <a href="#" class="block py-2 hover:text-[#165DFF]" @click="scrollToCategory('convert')">转换工具</a>
        <a href="#" class="block py-2 hover:text-[#165DFF]" @click="scrollToCategory('generate')">生成工具</a>
        <a href="#" class="block py-2 hover:text-[#165DFF]" @click="scrollToCategory('validate')">验证工具</a>
        <a href="#" class="block py-2 hover:text-[#165DFF]" @click="scrollToCategory('dev')">开发辅助</a>
      </div>
    </nav>
  `,
  setup(props, { emit }) {
    const { ref } = Vue;
    const { isDark, toggleTheme } = useTheme();
    const searchQuery = ref('');
    const showMobileMenu = ref(false);

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value;
    };

    const scrollToCategory = (categoryId) => {
      showMobileMenu.value = false;
      emit('scroll-to-category', categoryId);
    };

    return {
      isDark,
      toggleTheme,
      searchQuery,
      showMobileMenu,
      toggleMobileMenu,
      scrollToCategory
    };
  }
}; 