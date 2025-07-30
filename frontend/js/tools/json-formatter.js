// JSON格式化工具组件
const JsonFormatterTool = {
  template: `
    <tool-page-base :tool-id="toolId">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="card p-6">
          <h3 class="text-lg font-semibold mb-4">输入</h3>
          <textarea 
            v-model="jsonInput"
            class="input-field json-input w-full h-64 p-4 mb-4" 
            placeholder="在此输入JSON数据...

支持快捷键：
• Ctrl+Enter: 格式化
• Ctrl+A: 全选
• Ctrl+L: 加载示例"
            @keydown="handleKeydown"
          ></textarea>
          <div class="flex items-center space-x-4 mb-4">
            <div>
              <label class="block text-sm text-[#94A3B8] mb-1">缩进</label>
              <select v-model="indentType" class="input-field px-3 py-1">
                <option value="2">2空格</option>
                <option value="4">4空格</option>
                <option value="tab">制表符</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-[#94A3B8] mb-1">排序键</label>
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="sortKeys" class="rounded">
                <span class="ml-2">启用</span>
              </label>
            </div>
            <div class="flex-1">
              <label class="block text-sm text-[#94A3B8] mb-1">状态</label>
              <div class="text-sm px-2 py-1 rounded" :class="statusClass">
                <i :class="statusIcon + ' mr-1'"></i>
                <span>{{ statusText }}</span>
              </div>
            </div>
          </div>
          <div class="flex space-x-3">
            <button @click="loadExample" class="btn-primary px-4 py-2 flex-1">
              <i class="fas fa-file-import mr-2"></i>加载示例
            </button>
            <button @click="formatJson" class="btn-primary px-6 py-2 flex-2">
              <i class="fas fa-magic mr-2"></i>格式化
            </button>
          </div>
        </div>
        
        <div class="card p-6">
          <h3 class="text-lg font-semibold mb-4">输出</h3>
          <div class="syntax-highlight relative">
            <pre class="bg-[#1E1E2E] p-4 rounded-lg h-64 overflow-auto"><code class="language-json text-sm" v-html="highlightedOutput"></code></pre>
            <button @click="copyOutput" class="copy-btn p-2 rounded bg-[#383850] hover:bg-[#165DFF]">
              <i class="fas fa-copy"></i>
            </button>
          </div>
          <div class="flex space-x-3 mt-4">
            <button @click="copyOutput" class="btn-primary px-4 py-2 flex-1">
              <i class="fas fa-copy mr-2"></i>复制
            </button>
            <button @click="downloadJson" class="btn-primary px-4 py-2 flex-1">
              <i class="fas fa-download mr-2"></i>下载
            </button>
            <button @click="clearAll" class="btn-primary px-4 py-2 flex-1">
              <i class="fas fa-trash mr-2"></i>清空
            </button>
          </div>
        </div>
      </div>
    </tool-page-base>
  `,
  components: {
    ToolPageBase
  },
  props: {
    toolId: {
      type: String,
      default: 'json-formatter'
    }
  },
  setup(props) {
    const { ref, computed, watch, onMounted } = Vue;
    const { showMessage } = useNotification();
    const { copyToClipboard } = useClipboard();
    const { downloadFile } = useDownload();
    
    const jsonInput = ref('');
    const jsonOutput = ref('// 格式化后的JSON将在这里显示');
    const indentType = ref('2');
    const sortKeys = ref(false);
    const isValid = ref(null);
    
    // 状态计算
    const statusClass = computed(() => {
      if (isValid.value === null) return 'text-gray-400';
      return isValid.value ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10';
    });
    
    const statusIcon = computed(() => {
      if (isValid.value === null) return 'fas fa-circle';
      return isValid.value ? 'fas fa-check-circle' : 'fas fa-times-circle';
    });
    
    const statusText = computed(() => {
      if (isValid.value === null) return '等待输入';
      return isValid.value ? 'JSON有效' : 'JSON无效';
    });
    
    const highlightedOutput = computed(() => {
      if (typeof hljs !== 'undefined') {
        return hljs.highlight(jsonOutput.value, { language: 'json' }).value;
      }
      return jsonOutput.value;
    });
    
    // 防抖验证
    const debouncedValidation = useDebounce(validateJson, 500);
    
    // 实时验证
    function validateJson() {
      const input = jsonInput.value.trim();
      if (!input) {
        isValid.value = null;
        return;
      }
      
      try {
        JSON.parse(input);
        isValid.value = true;
      } catch (error) {
        isValid.value = false;
      }
    }
    
    // 监听输入变化
    const handleInput = () => {
      localStorage.setItem('json-input-content', jsonInput.value);
      debouncedValidation();
    };
    
    // 格式化JSON
    const formatJson = () => {
      const input = jsonInput.value.trim();
      
      if (!input) {
        showMessage('请输入JSON数据', 'warning');
        return;
      }
      
      try {
        let jsonObj = JSON.parse(input);
        
        // 排序键
        if (sortKeys.value) {
          jsonObj = sortObjectKeys(jsonObj);
        }
        
        // 设置缩进
        let indent;
        switch (indentType.value) {
          case '2':
            indent = 2;
            break;
          case '4':
            indent = 4;
            break;
          case 'tab':
            indent = '\t';
            break;
          default:
            indent = 2;
        }
        
        jsonOutput.value = JSON.stringify(jsonObj, null, indent);
        showMessage('JSON格式化成功', 'success');
        
      } catch (error) {
        showMessage('JSON格式错误: ' + error.message, 'error');
        jsonOutput.value = '// JSON格式错误，请检查输入\n// 错误信息: ' + error.message;
      }
    };
    
    // 排序对象键
    const sortObjectKeys = (obj) => {
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
      }
      
      const sortedKeys = Object.keys(obj).sort();
      const sortedObj = {};
      
      for (const key of sortedKeys) {
        sortedObj[key] = sortObjectKeys(obj[key]);
      }
      
      return sortedObj;
    };
    
    // 加载示例
    const loadExample = () => {
      const exampleJson = {
        "name": "DevTools",
        "version": "1.0.0",
        "description": "一站式程序员工具集",
        "author": {
          "name": "开发者",
          "email": "dev@example.com"
        },
        "features": [
          {
            "name": "JSON格式化",
            "description": "格式化并验证JSON数据",
            "category": "格式化工具",
            "implemented": true
          },
          {
            "name": "SVG转PNG",
            "description": "将SVG矢量图转换为PNG位图",
            "category": "转换工具",
            "implemented": false
          }
        ],
        "config": {
          "theme": "dark",
          "autoSave": true,
          "shortcuts": {
            "format": "Ctrl+Enter",
            "copy": "Ctrl+C",
            "paste": "Ctrl+V"
          }
        },
        "timestamp": new Date().toISOString()
      };
      
      jsonInput.value = JSON.stringify(exampleJson, null, 2);
      validateJson();
      showMessage('示例JSON已加载', 'success');
    };
    
    // 复制输出
    const copyOutput = () => {
      copyToClipboard(jsonOutput.value);
    };
    
    // 下载JSON
    const downloadJson = () => {
      const content = jsonOutput.value;
      
      if (!content || content.includes('JSON格式错误')) {
        showMessage('没有可下载的内容', 'warning');
        return;
      }
      
      downloadFile(content, 'formatted.json', 'application/json');
      showMessage('文件下载成功', 'success');
    };
    
    // 清空所有
    const clearAll = () => {
      jsonInput.value = '';
      jsonOutput.value = '// 格式化后的JSON将在这里显示';
      isValid.value = null;
      localStorage.removeItem('json-input-content');
      showMessage('已清空所有内容', 'success');
    };
    
    // 快捷键处理
    const handleKeydown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        formatJson();
      } else if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        loadExample();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = e.target.value.substring(0, start) + '  ' + e.target.value.substring(end);
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }
    };
    
    // 组件挂载时的初始化
    onMounted(() => {
      const savedContent = localStorage.getItem('json-input-content');
      if (savedContent) {
        jsonInput.value = savedContent;
        validateJson();
      }
    });
    
    // 监听输入变化
    watch(jsonInput, handleInput);
    
    return {
      jsonInput,
      jsonOutput,
      indentType,
      sortKeys,
      statusClass,
      statusIcon,
      statusText,
      highlightedOutput,
      formatJson,
      loadExample,
      copyOutput,
      downloadJson,
      clearAll,
      handleKeydown
    };
  }
};

// 暴露组件到全局，供 ToolLoader 使用
window.JsonFormatterTool = JsonFormatterTool; 