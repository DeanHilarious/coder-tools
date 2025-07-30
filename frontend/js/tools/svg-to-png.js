// SVG转PNG工具组件
const SvgToPngTool = {
  template: `
    <tool-page-base :tool-id="toolId">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- 输入区域 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold mb-4">
            <i class="fas fa-file-code mr-2"></i>SVG 输入
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
                <label class="block text-sm text-[#94A3B8] mb-2">SVG 源码</label>
                <textarea 
                  v-model="svgContent"
                  class="input-field w-full h-64 p-3 font-mono text-sm"
                  placeholder="请粘贴SVG源码，例如：&#10;&lt;svg width=&quot;100&quot; height=&quot;100&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;&gt;&#10;  &lt;circle cx=&quot;50&quot; cy=&quot;50&quot; r=&quot;40&quot; fill=&quot;red&quot; /&gt;&#10;&lt;/svg&gt;"
                  @input="handleSvgInput"
                ></textarea>
              </div>
              
              <div class="flex space-x-3">
                <button 
                  @click="loadSampleSvg"
                  class="border border-[#165DFF] text-[#165DFF] hover:bg-[#165DFF] hover:text-white px-4 py-2 rounded"
                >
                  <i class="fas fa-star mr-2"></i>加载示例
                </button>
                <button 
                  @click="clearSvgContent"
                  class="border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white px-4 py-2 rounded"
                >
                  <i class="fas fa-trash mr-2"></i>清空内容
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
                <p class="text-sm text-[#94A3B8]">支持 .svg 格式文件</p>
              </div>
              
              <input 
                ref="fileInput"
                type="file"
                accept=".svg,image/svg+xml"
                @change="handleFileSelect"
                class="hidden"
              >
              
              <div v-if="selectedFileName" class="flex items-center justify-between p-3 bg-[#1E1E2E] rounded-lg">
                <div class="flex items-center space-x-3">
                  <i class="fas fa-file-code text-[#165DFF]"></i>
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
        
        <!-- 转换设置 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold mb-4">
            <i class="fas fa-cogs mr-2"></i>转换设置
          </h3>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-[#94A3B8] mb-2">输出宽度</label>
                <input 
                  type="number" 
                  v-model.number="outputWidth"
                  min="1"
                  max="5000"
                  class="input-field w-full px-3 py-2"
                  placeholder="自动"
                >
              </div>
              <div>
                <label class="block text-sm text-[#94A3B8] mb-2">输出高度</label>
                <input 
                  type="number" 
                  v-model.number="outputHeight"
                  min="1"
                  max="5000"
                  class="input-field w-full px-3 py-2"
                  placeholder="自动"
                >
              </div>
            </div>
            
            <div>
              <label class="block text-sm text-[#94A3B8] mb-2">缩放比例</label>
              <select v-model="scaleRatio" class="input-field w-full px-3 py-2">
                <option value="1">1x (原尺寸)</option>
                <option value="2">2x (两倍)</option>
                <option value="3">3x (三倍)</option>
                <option value="4">4x (四倍)</option>
                <option value="0.5">0.5x (一半)</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm text-[#94A3B8] mb-2">背景色</label>
              <div class="flex items-center space-x-3">
                <input 
                  type="color" 
                  v-model="backgroundColor"
                  class="w-12 h-8 rounded border border-gray-400"
                >
                <input 
                  type="text" 
                  v-model="backgroundColor"
                  class="input-field flex-1 px-3 py-2"
                  placeholder="#ffffff"
                >
                <label class="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    v-model="transparentBackground"
                    class="form-checkbox text-[#165DFF]"
                  >
                  <span class="text-sm">透明背景</span>
                </label>
              </div>
            </div>
            
            <div class="flex space-x-3">
              <button 
                @click="convertSvgToPng"
                :disabled="!canConvert || isConverting"
                class="btn-primary px-6 py-2 flex-1"
                :class="{ 'opacity-50 cursor-not-allowed': !canConvert || isConverting }"
              >
                <i class="fas fa-magic mr-2"></i>
                {{ isConverting ? '转换中...' : '转换为PNG' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 预览和下载区域 -->
      <div v-if="previewUrl || errorMessage" class="card p-6">
        <h3 class="text-lg font-semibold mb-4">
          <i class="fas fa-eye mr-2"></i>预览结果
        </h3>
        
        <!-- 错误信息 -->
        <div v-if="errorMessage" class="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-4">
          <div class="flex items-center">
            <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
            <span class="text-red-500">{{ errorMessage }}</span>
          </div>
        </div>
        
        <!-- 预览图片 -->
        <div v-if="previewUrl" class="space-y-4">
          <div class="bg-[#1E1E2E] rounded-lg p-4">
            <div class="flex items-center justify-center min-h-[200px] bg-white/5 rounded">
              <img 
                :src="previewUrl" 
                :alt="'PNG预览'"
                class="max-w-full max-h-96 object-contain cursor-pointer hover:opacity-80 transition-opacity"
                @load="handleImageLoad"
                @dblclick="showFullImage"
                title="双击放大查看"
              >
            </div>
            <div class="text-center mt-2">
              <p class="text-xs text-[#94A3B8]">💡 双击图片可放大查看</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="text-sm text-[#94A3B8]">
              尺寸: {{ actualWidth }} x {{ actualHeight }}px
              <span v-if="fileSize"> | 文件大小: {{ fileSize }}</span>
            </div>
            <div class="flex space-x-3">
              <button 
                @click="downloadPng"
                class="btn-primary px-6 py-2"
              >
                <i class="fas fa-download mr-2"></i>下载PNG
              </button>
              <button 
                @click="copyToClipboard"
                class="border border-[#165DFF] text-[#165DFF] hover:bg-[#165DFF] hover:text-white px-6 py-2 rounded"
              >
                <i class="fas fa-copy mr-2"></i>复制图片
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 图片放大Modal -->
      <div 
        v-if="showImageModal" 
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        @click="closeImageModal"
        @keydown.esc="closeImageModal"
        tabindex="0"
      >
        <div class="relative max-w-full max-h-full">
          <!-- 关闭按钮 -->
          <button 
            @click="closeImageModal"
            class="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          >
            <i class="fas fa-times"></i>
          </button>
          
          <!-- 缩放控制 -->
          <div class="absolute top-4 left-4 z-10 flex space-x-2">
            <button 
              @click="zoomOut"
              :disabled="imageZoom <= 0.5"
              class="bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': imageZoom <= 0.5 }"
            >
              <i class="fas fa-minus"></i>
            </button>
            <div class="bg-black/50 text-white rounded-full px-3 py-2 text-sm flex items-center">
              {{ Math.round(imageZoom * 100) }}%
            </div>
            <button 
              @click="zoomIn"
              :disabled="imageZoom >= 3"
              class="bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': imageZoom >= 3 }"
            >
              <i class="fas fa-plus"></i>
            </button>
            <button 
              @click="resetZoom"
              class="bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              title="重置缩放"
            >
              <i class="fas fa-expand-arrows-alt"></i>
            </button>
          </div>
          
          <!-- 图片信息 -->
          <div class="absolute bottom-4 left-4 z-10 bg-black/50 text-white rounded-lg px-4 py-2 text-sm">
            {{ actualWidth }} × {{ actualHeight }}px
            <span v-if="fileSize"> • {{ fileSize }}</span>
          </div>
          
          <!-- 放大的图片 -->
          <div class="overflow-auto max-w-full max-h-full">
            <img 
              :src="previewUrl" 
              :alt="'PNG放大预览'"
              class="block mx-auto transition-transform duration-200"
              :style="{ transform: 'scale(' + imageZoom + ')' }"
              @click.stop
              @wheel.prevent="handleWheel"
            >
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
      default: 'svg-to-png'
    }
  },
  setup(props) {
    const { ref, computed, nextTick } = Vue;
    const { showMessage } = useNotification();
    const { downloadFile } = useDownload();
    
    // 输入相关
    const inputMode = ref('text');
    const svgContent = ref('');
    const selectedFileName = ref('');
    const fileInput = ref(null);
    
    // 转换设置
    const outputWidth = ref(null);
    const outputHeight = ref(null);
    const scaleRatio = ref('1');
    const backgroundColor = ref('#ffffff');
    const transparentBackground = ref(false);
    
    // 转换状态
    const isConverting = ref(false);
    const previewUrl = ref('');
    const errorMessage = ref('');
    const actualWidth = ref(0);
    const actualHeight = ref(0);
    const fileSize = ref('');
    
    // 图片放大模态框
    const showImageModal = ref(false);
    const imageZoom = ref(1);
    
    // 计算属性
    const canConvert = computed(() => {
      return svgContent.value.trim().length > 0;
    });
    
    // 处理SVG内容输入
    const handleSvgInput = () => {
      errorMessage.value = '';
      previewUrl.value = '';
    };
    
    // 加载示例SVG
    const loadSampleSvg = () => {
      svgContent.value = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#165DFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#36D399;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="80" fill="url(#grad1)" />
  <text x="100" y="110" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="16" font-weight="bold">SVG</text>
</svg>`;
      handleSvgInput();
    };
    
    // 清空SVG内容
    const clearSvgContent = () => {
      svgContent.value = '';
      errorMessage.value = '';
      previewUrl.value = '';
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
      if (!file.type.includes('svg')) {
        showMessage('请选择SVG格式的文件', 'error');
        return;
      }
      
      selectedFileName.value = file.name;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        svgContent.value = e.target.result;
        handleSvgInput();
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
      clearSvgContent();
    };
    
    // 转换SVG为PNG
    const convertSvgToPng = async () => {
      if (!canConvert.value) return;
      
      isConverting.value = true;
      errorMessage.value = '';
      previewUrl.value = '';
      
      try {
        // 清理和标准化SVG内容
        let cleanSvgContent = svgContent.value.trim();
        
        // 确保SVG有正确的命名空间
        if (!cleanSvgContent.includes('xmlns="http://www.w3.org/2000/svg"')) {
          cleanSvgContent = cleanSvgContent.replace(
            '<svg',
            '<svg xmlns="http://www.w3.org/2000/svg"'
          );
        }
        
        // 创建临时SVG元素来获取尺寸
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(cleanSvgContent, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (!svgElement) {
          throw new Error('无效的SVG内容');
        }
        
        // 检查是否有解析错误
        const parserError = svgDoc.querySelector('parsererror');
        if (parserError) {
          throw new Error('SVG格式错误：' + parserError.textContent);
        }
        
        // 获取SVG尺寸
        let svgWidth = 100;
        let svgHeight = 100;
        
        // 尝试从width和height属性获取
        const widthAttr = svgElement.getAttribute('width');
        const heightAttr = svgElement.getAttribute('height');
        
        if (widthAttr && heightAttr) {
          svgWidth = parseFloat(widthAttr.replace(/[^0-9.]/g, ''));
          svgHeight = parseFloat(heightAttr.replace(/[^0-9.]/g, ''));
        } else {
          // 尝试从viewBox获取
          const viewBox = svgElement.getAttribute('viewBox');
          if (viewBox) {
            const viewBoxValues = viewBox.split(/\s+|,/);
            if (viewBoxValues.length >= 4) {
              svgWidth = parseFloat(viewBoxValues[2]);
              svgHeight = parseFloat(viewBoxValues[3]);
            }
          }
        }
        
        // 如果仍然没有有效尺寸，设置默认值
        if (isNaN(svgWidth) || svgWidth <= 0) svgWidth = 100;
        if (isNaN(svgHeight) || svgHeight <= 0) svgHeight = 100;
        
        // 计算输出尺寸
        const scale = parseFloat(scaleRatio.value);
        const finalWidth = outputWidth.value || Math.round(svgWidth * scale);
        const finalHeight = outputHeight.value || Math.round(svgHeight * scale);
        
        // 创建高质量canvas
        const canvas = document.createElement('canvas');
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        const ctx = canvas.getContext('2d');
        
        // 设置高质量渲染
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // 设置背景
        if (!transparentBackground.value) {
          ctx.fillStyle = backgroundColor.value;
          ctx.fillRect(0, 0, finalWidth, finalHeight);
        }
        
        // 使用data URL而不是Blob URL
        const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(cleanSvgContent);
        
        // 创建图片对象
        const img = new Image();
        
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('SVG加载超时'));
          }, 10000);
          
          img.onload = () => {
            clearTimeout(timeout);
            try {
              ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
              resolve();
            } catch (error) {
              reject(error);
            }
          };
          
          img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('SVG图片加载失败，请检查SVG格式是否正确'));
          };
          
          img.src = svgDataUrl;
        });
        
        // 生成PNG
        const pngDataUrl = canvas.toDataURL('image/png', 1.0);
        previewUrl.value = pngDataUrl;
        actualWidth.value = finalWidth;
        actualHeight.value = finalHeight;
        
        // 计算文件大小
        const base64Length = pngDataUrl.split(',')[1].length;
        const sizeInBytes = Math.round(base64Length * 0.75);
        fileSize.value = formatFileSize(sizeInBytes);
        
        showMessage('SVG转换成功', 'success');
        
      } catch (error) {
        errorMessage.value = error.message || 'SVG转换失败';
        showMessage('转换失败: ' + error.message, 'error');
        console.error('SVG转换错误:', error);
      } finally {
        isConverting.value = false;
      }
    };
    
    // 下载PNG
    const downloadPng = () => {
      if (!previewUrl.value) return;
      
      const link = document.createElement('a');
      link.href = previewUrl.value;
      link.download = `svg-to-png-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showMessage('PNG文件下载成功', 'success');
    };
    
    // 复制图片到剪贴板
    const copyToClipboard = async () => {
      if (!previewUrl.value) return;
      
      try {
        const canvas = document.createElement('canvas');
        canvas.width = actualWidth.value;
        canvas.height = actualHeight.value;
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(async (blob) => {
            if (navigator.clipboard && navigator.clipboard.write) {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
              showMessage('图片已复制到剪贴板', 'success');
            } else {
              showMessage('当前浏览器不支持复制图片', 'warning');
            }
          }, 'image/png');
        };
        img.src = previewUrl.value;
        
      } catch (error) {
        showMessage('复制失败', 'error');
      }
    };
    
    // 图片加载完成
    const handleImageLoad = () => {
      // 图片加载完成后的处理
    };
    
    // 显示放大图片
    const showFullImage = () => {
      if (!previewUrl.value) return;
      showImageModal.value = true;
      imageZoom.value = 1;
      // 聚焦modal以便键盘事件生效
      nextTick(() => {
        const modal = document.querySelector('.fixed.inset-0');
        if (modal) {
          modal.focus();
        }
      });
    };
    
    // 关闭图片模态框
    const closeImageModal = () => {
      showImageModal.value = false;
      imageZoom.value = 1;
    };
    
    // 放大图片
    const zoomIn = () => {
      if (imageZoom.value < 3) {
        imageZoom.value = Math.min(3, imageZoom.value + 0.25);
      }
    };
    
    // 缩小图片
    const zoomOut = () => {
      if (imageZoom.value > 0.5) {
        imageZoom.value = Math.max(0.5, imageZoom.value - 0.25);
      }
    };
    
    // 重置缩放
    const resetZoom = () => {
      imageZoom.value = 1;
    };
    
    // 处理滚轮缩放
    const handleWheel = (event) => {
      const delta = event.deltaY;
      if (delta < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    };
    
    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    return {
      inputMode,
      svgContent,
      selectedFileName,
      fileInput,
      outputWidth,
      outputHeight,
      scaleRatio,
      backgroundColor,
      transparentBackground,
      isConverting,
      previewUrl,
      errorMessage,
      actualWidth,
      actualHeight,
      fileSize,
      showImageModal,
      imageZoom,
      canConvert,
      handleSvgInput,
      loadSampleSvg,
      clearSvgContent,
      handleFileSelect,
      handleFileDrop,
      clearFile,
      convertSvgToPng,
      downloadPng,
      copyToClipboard,
      handleImageLoad,
      showFullImage,
      closeImageModal,
      zoomIn,
      zoomOut,
      resetZoom,
      handleWheel
    };
  }
};

// 暴露组件到全局，供 ToolLoader 使用
window.SvgToPngTool = SvgToPngTool; 