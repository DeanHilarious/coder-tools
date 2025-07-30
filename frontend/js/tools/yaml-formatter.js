// YAML格式化工具组件
const YamlFormatterTool = {
  template: `
    <tool-page-base :tool-id="toolId">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- 输入区域 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold mb-4">
            <i class="fas fa-file-alt mr-2"></i>YAML 输入
          </h3>
          
          <div class="space-y-4">
            <div class="flex space-x-4">
              <button 
                @click="inputMode = 'text'"
                class="px-4 py-2 rounded text-sm"
                :class="inputMode === 'text' ? 'bg-[#165DFF] text-white' : 'border border-[#165DFF] text-[#165DFF]'"
              >
                <i class="fas fa-edit mr-2"></i>文本输入
              </button>
              <button 
                @click="inputMode = 'file'"
                class="px-4 py-2 rounded text-sm"
                :class="inputMode === 'file' ? 'bg-[#165DFF] text-white' : 'border border-[#165DFF] text-[#165DFF]'"
              >
                <i class="fas fa-upload mr-2"></i>文件上传
              </button>
            </div>
            
            <!-- 文本输入模式 -->
            <div v-if="inputMode === 'text'" class="space-y-4">
              <div>
                <label class="block text-sm text-[#94A3B8] mb-2">YAML 内容</label>
                <textarea 
                  v-model="yamlInput"
                  class="input-field w-full h-64 p-3 font-mono text-sm yaml-input"
                  placeholder="请输入YAML内容，例如：&#10;name: John Doe&#10;age: 30&#10;address:&#10;  street: 123 Main St&#10;  city: New York&#10;hobbies:&#10;  - reading&#10;  - swimming"
                  @input="handleYamlInput"
                ></textarea>
              </div>
              
              <div class="flex space-x-3">
                <button 
                  @click="loadSampleYaml"
                  class="border border-[#165DFF] text-[#165DFF] hover:bg-[#165DFF] hover:text-white px-4 py-2 rounded"
                >
                  <i class="fas fa-star mr-2"></i>加载示例
                </button>
                <button 
                  @click="clearInput"
                  class="border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white px-4 py-2 rounded"
                >
                  <i class="fas fa-trash mr-2"></i>清空
                </button>
              </div>
            </div>
            
            <!-- 文件上传模式 -->
            <div v-if="inputMode === 'file'" class="space-y-4">
              <div 
                class="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer hover:border-[#165DFF] hover:bg-[#165DFF]/10 transition-colors"
                @click="$refs.fileInput.click()"
                @dragover.prevent
                @drop.prevent="handleFileDrop"
              >
                <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                <p class="text-lg mb-2">点击选择文件或拖拽文件到此处</p>
                <p class="text-sm text-[#94A3B8]">支持 .yaml, .yml 格式文件</p>
              </div>
              
              <input 
                ref="fileInput"
                type="file"
                accept=".yaml,.yml,.txt"
                @change="handleFileSelect"
                class="hidden"
              >
              
              <div v-if="selectedFileName" class="flex items-center justify-between p-3 bg-[#1E1E2E] rounded-lg">
                <div class="flex items-center space-x-3">
                  <i class="fas fa-file-alt text-[#165DFF]"></i>
                  <span class="text-sm">{{ selectedFileName }}</span>
                </div>
                <button 
                  @click="clearFile"
                  class="text-red-500 hover:text-red-400"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 操作控制 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold mb-4">
            <i class="fas fa-cogs mr-2"></i>格式化选项
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-[#94A3B8] mb-2">缩进方式</label>
              <select v-model="indentType" class="input-field w-full px-3 py-2">
                <option value="spaces">空格</option>
                <option value="tabs">制表符</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm text-[#94A3B8] mb-2">缩进大小</label>
              <select v-model="indentSize" class="input-field w-full px-3 py-2">
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="8">8</option>
              </select>
            </div>
            
            <div class="flex items-center space-x-4">
              <label class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  v-model="sortKeys"
                  class="form-checkbox text-[#165DFF]"
                >
                <span class="text-sm">按键名排序</span>
              </label>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="formatYaml"
                :disabled="!yamlInput.trim()"
                class="btn-primary px-4 py-2"
                :class="{ 'opacity-50 cursor-not-allowed': !yamlInput.trim() }"
              >
                <i class="fas fa-magic mr-2"></i>格式化
              </button>
              <button 
                @click="validateYaml"
                :disabled="!yamlInput.trim()"
                class="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded"
                :class="{ 'opacity-50 cursor-not-allowed': !yamlInput.trim() }"
              >
                <i class="fas fa-check-circle mr-2"></i>验证
              </button>
            </div>
            
            <div class="border-t pt-4">
              <h4 class="text-sm font-semibold mb-3">转换功能</h4>
              <div class="grid grid-cols-2 gap-3">
                <button 
                  @click="yamlToJson"
                  :disabled="!yamlInput.trim()"
                  class="border border-[#165DFF] text-[#165DFF] hover:bg-[#165DFF] hover:text-white px-3 py-2 rounded text-sm"
                  :class="{ 'opacity-50 cursor-not-allowed': !yamlInput.trim() }"
                >
                  <i class="fas fa-exchange-alt mr-2"></i>转JSON
                </button>
                <button 
                  @click="jsonToYaml"
                  :disabled="!yamlInput.trim()"
                  class="border border-[#165DFF] text-[#165DFF] hover:bg-[#165DFF] hover:text-white px-3 py-2 rounded text-sm"
                  :class="{ 'opacity-50 cursor-not-allowed': !yamlInput.trim() }"
                >
                  <i class="fas fa-exchange-alt mr-2"></i>从JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 输出区域 -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">
            <i class="fas fa-file-export mr-2"></i>格式化结果
          </h3>
          <div class="flex space-x-2">
            <button 
              @click="copyResult"
              :disabled="!formattedOutput"
              class="btn-primary px-4 py-2 text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': !formattedOutput }"
            >
              <i class="fas fa-copy mr-2"></i>复制
            </button>
            <button 
              @click="downloadResult"
              :disabled="!formattedOutput"
              class="border border-[#165DFF] text-[#165DFF] hover:bg-[#165DFF] hover:text-white px-4 py-2 rounded text-sm"
              :class="{ 'opacity-50 cursor-not-allowed': !formattedOutput }"
            >
              <i class="fas fa-download mr-2"></i>下载
            </button>
          </div>
        </div>
        
        <!-- 验证状态 -->
        <div v-if="validationResult" class="mb-4">
          <div 
            v-if="validationResult.isValid"
            class="bg-green-500/10 border border-green-500 rounded-lg p-3"
          >
            <div class="flex items-center">
              <i class="fas fa-check-circle text-green-500 mr-2"></i>
              <span class="text-green-500">YAML格式正确</span>
            </div>
          </div>
          <div 
            v-else
            class="bg-red-500/10 border border-red-500 rounded-lg p-3"
          >
            <div class="flex items-start">
              <i class="fas fa-exclamation-triangle text-red-500 mr-2 mt-1"></i>
              <div>
                <div class="text-red-500 font-semibold">YAML格式错误</div>
                <div class="text-red-400 text-sm mt-1">{{ validationResult.error }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 输出内容 -->
        <div class="relative syntax-highlight">
          <pre 
            v-if="formattedOutput"
            class="bg-[#1E1E2E] p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono leading-relaxed text-[#E2E8F0]"
          ><code>{{ formattedOutput }}</code></pre>
          <div 
            v-else 
            class="bg-[#1E1E2E] p-8 rounded-lg text-center text-[#94A3B8]"
          >
            <i class="fas fa-file-alt text-4xl mb-4 opacity-50"></i>
            <p>格式化结果将显示在这里</p>
            <p class="text-sm mt-2">请输入YAML内容并点击格式化按钮</p>
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
      default: 'yaml-formatter'
    }
  },
  setup(props) {
    const { ref, computed } = Vue;
    const { showMessage } = useNotification();
    const { copyToClipboard } = useClipboard();
    const { downloadFile } = useDownload();
    
    // 输入相关
    const inputMode = ref('text');
    const yamlInput = ref('');
    const selectedFileName = ref('');
    const fileInput = ref(null);
    
    // 格式化选项
    const indentType = ref('spaces');
    const indentSize = ref('2');
    const sortKeys = ref(false);
    
    // 输出相关
    const formattedOutput = ref('');
    const validationResult = ref(null);
    
    // 处理YAML输入
    const handleYamlInput = () => {
      validationResult.value = null;
      formattedOutput.value = '';
    };
    
    // 加载示例YAML
    const loadSampleYaml = () => {
      yamlInput.value = `# 用户信息配置
name: John Doe
age: 30
email: john.doe@example.com

# 地址信息
address:
  street: 123 Main Street
  city: New York
  state: NY
  zipcode: "10001"
  country: USA

# 爱好列表
hobbies:
  - reading
  - swimming
  - photography
  - traveling

# 技能等级
skills:
  programming: 9
  design: 7
  communication: 8

# 是否活跃用户
isActive: true

# 注册时间
registeredAt: 2023-01-15T10:30:00Z`;
      handleYamlInput();
    };
    
    // 清空输入
    const clearInput = () => {
      yamlInput.value = '';
      formattedOutput.value = '';
      validationResult.value = null;
      selectedFileName.value = '';
    };
    
    // 处理文件选择
    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        processFile(file);
      }
    };
    
    // 处理文件拖拽
    const handleFileDrop = (event) => {
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        processFile(files[0]);
      }
    };
    
    // 处理文件
    const processFile = (file) => {
      selectedFileName.value = file.name;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        yamlInput.value = e.target.result;
        handleYamlInput();
      };
      reader.onerror = () => {
        showMessage('文件读取失败', 'error');
      };
      reader.readAsText(file);
    };
    
    // 清空文件
    const clearFile = () => {
      selectedFileName.value = '';
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      clearInput();
    };
    
    // 简单的YAML解析器（基础实现）
    const parseYaml = (yamlStr) => {
      try {
        // 移除注释
        const lines = yamlStr.split('\n');
        const cleanLines = lines.map(line => {
          const commentIndex = line.indexOf('#');
          if (commentIndex !== -1) {
            const beforeComment = line.substring(0, commentIndex).trim();
            return beforeComment;
          }
          return line;
        }).filter(line => line.trim() !== '');
        
        const result = {};
        let currentPath = [];
        
        for (const line of cleanLines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;
          
          const indent = line.length - line.trimLeft().length;
          const level = Math.floor(indent / parseInt(indentSize.value));
          
          if (trimmedLine.includes(':')) {
            const [key, ...valueParts] = trimmedLine.split(':');
            const value = valueParts.join(':').trim();
            
            // 调整当前路径到正确层级
            currentPath = currentPath.slice(0, level);
            currentPath[level] = key.trim();
            
            if (value) {
              // 有值的键值对
              setNestedValue(result, currentPath, parseValue(value));
            } else {
              // 对象键
              setNestedValue(result, currentPath, {});
            }
          } else if (trimmedLine.startsWith('-')) {
            // 数组项
            const value = trimmedLine.substring(1).trim();
            const arrayPath = currentPath.slice(0, level);
            const currentArray = getNestedValue(result, arrayPath) || [];
            if (!Array.isArray(currentArray)) {
              setNestedValue(result, arrayPath, []);
            }
            getNestedValue(result, arrayPath).push(parseValue(value));
          }
        }
        
        return result;
      } catch (error) {
        throw new Error('YAML解析失败: ' + error.message);
      }
    };
    
    // 设置嵌套值
    const setNestedValue = (obj, path, value) => {
      let current = obj;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!(key in current) || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }
      current[path[path.length - 1]] = value;
    };
    
    // 获取嵌套值
    const getNestedValue = (obj, path) => {
      let current = obj;
      for (const key of path) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return undefined;
        }
      }
      return current;
    };
    
    // 解析值
    const parseValue = (value) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      if (value === 'null') return null;
      if (/^-?\d+$/.test(value)) return parseInt(value, 10);
      if (/^-?\d*\.\d+$/.test(value)) return parseFloat(value);
      if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
      }
      if (value.startsWith("'") && value.endsWith("'")) {
        return value.slice(1, -1);
      }
      return value;
    };
    
    // 将对象转换为YAML字符串
    const objectToYaml = (obj, indent = 0) => {
      const indentStr = indentType.value === 'spaces' 
        ? ' '.repeat(indent * parseInt(indentSize.value))
        : '\t'.repeat(indent);
      
      let result = '';
      
      const keys = sortKeys.value ? Object.keys(obj).sort() : Object.keys(obj);
      
      for (const key of keys) {
        const value = obj[key];
        
        if (value === null) {
          result += `${indentStr}${key}: null\n`;
        } else if (typeof value === 'boolean') {
          result += `${indentStr}${key}: ${value}\n`;
        } else if (typeof value === 'number') {
          result += `${indentStr}${key}: ${value}\n`;
        } else if (typeof value === 'string') {
          const needsQuotes = /[:\[\]{}]/.test(value) || value.includes('\n');
          if (needsQuotes) {
            result += `${indentStr}${key}: "${value}"\n`;
          } else {
            result += `${indentStr}${key}: ${value}\n`;
          }
        } else if (Array.isArray(value)) {
          result += `${indentStr}${key}:\n`;
          for (const item of value) {
            if (typeof item === 'object' && item !== null) {
              result += `${indentStr}${' '.repeat(parseInt(indentSize.value))}-\n`;
              result += objectToYaml(item, indent + 2).replace(/^/gm, ' '.repeat(parseInt(indentSize.value)));
            } else {
              result += `${indentStr}${' '.repeat(parseInt(indentSize.value))}- ${item}\n`;
            }
          }
        } else if (typeof value === 'object') {
          result += `${indentStr}${key}:\n`;
          result += objectToYaml(value, indent + 1);
        }
      }
      
      return result;
    };
    
    // 格式化YAML
    const formatYaml = () => {
      if (!yamlInput.value.trim()) {
        showMessage('请输入YAML内容', 'warning');
        return;
      }
      
      try {
        const parsed = parseYaml(yamlInput.value);
        const formatted = objectToYaml(parsed);
        formattedOutput.value = formatted;
        validationResult.value = { isValid: true };
        showMessage('YAML格式化成功', 'success');
      } catch (error) {
        validationResult.value = { 
          isValid: false, 
          error: error.message 
        };
        showMessage('YAML格式化失败', 'error');
      }
    };
    
    // 验证YAML
    const validateYaml = () => {
      if (!yamlInput.value.trim()) {
        showMessage('请输入YAML内容', 'warning');
        return;
      }
      
      try {
        parseYaml(yamlInput.value);
        validationResult.value = { isValid: true };
        showMessage('YAML格式正确', 'success');
      } catch (error) {
        validationResult.value = { 
          isValid: false, 
          error: error.message 
        };
        showMessage('YAML格式错误', 'error');
      }
    };
    
    // YAML转JSON
    const yamlToJson = () => {
      if (!yamlInput.value.trim()) {
        showMessage('请输入YAML内容', 'warning');
        return;
      }
      
      try {
        const parsed = parseYaml(yamlInput.value);
        const json = JSON.stringify(parsed, null, parseInt(indentSize.value));
        formattedOutput.value = json;
        validationResult.value = { isValid: true };
        showMessage('YAML转JSON成功', 'success');
      } catch (error) {
        validationResult.value = { 
          isValid: false, 
          error: error.message 
        };
        showMessage('转换失败', 'error');
      }
    };
    
    // JSON转YAML
    const jsonToYaml = () => {
      if (!yamlInput.value.trim()) {
        showMessage('请输入JSON内容', 'warning');
        return;
      }
      
      try {
        const parsed = JSON.parse(yamlInput.value);
        const yaml = objectToYaml(parsed);
        formattedOutput.value = yaml;
        validationResult.value = { isValid: true };
        showMessage('JSON转YAML成功', 'success');
      } catch (error) {
        validationResult.value = { 
          isValid: false, 
          error: 'JSON格式错误: ' + error.message 
        };
        showMessage('转换失败', 'error');
      }
    };
    
    // 复制结果
    const copyResult = () => {
      if (formattedOutput.value) {
        copyToClipboard(formattedOutput.value);
      }
    };
    
    // 下载结果
    const downloadResult = () => {
      if (formattedOutput.value) {
        const isJson = formattedOutput.value.trim().startsWith('{') || formattedOutput.value.trim().startsWith('[');
        const extension = isJson ? 'json' : 'yaml';
        const filename = `formatted-${Date.now()}.${extension}`;
        downloadFile(formattedOutput.value, filename, 'text/plain');
        showMessage('文件下载成功', 'success');
      }
    };
    
    return {
      inputMode,
      yamlInput,
      selectedFileName,
      fileInput,
      indentType,
      indentSize,
      sortKeys,
      formattedOutput,
      validationResult,
      handleYamlInput,
      loadSampleYaml,
      clearInput,
      handleFileSelect,
      handleFileDrop,
      clearFile,
      formatYaml,
      validateYaml,
      yamlToJson,
      jsonToYaml,
      copyResult,
      downloadResult
    };
  }
};

// 暴露组件到全局，供 ToolLoader 使用
window.YamlFormatterTool = YamlFormatterTool; 