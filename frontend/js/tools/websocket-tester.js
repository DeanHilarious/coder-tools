// WebSocket测试工具组件
const WebsocketTesterTool = {
  template: `
    <tool-page-base :tool-id="toolId">
      <!-- 服务器配置 -->
      <div class="card p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">
          <i class="fas fa-server mr-2"></i>服务器配置
          <span class="ml-4 text-sm" :class="statusTextClass">
            状态: {{ connectionStatus }}
          </span>
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-[#94A3B8] mb-2">服务地址</label>
              <div class="flex space-x-2">
                <select v-model="protocol" class="input-field px-3 py-2 w-24">
                  <option value="ws://">ws://</option>
                  <option value="wss://">wss://</option>
                </select>
                <input 
                  type="text" 
                  v-model="serverUrl" 
                  placeholder="echo.websocket.org"
                  class="input-field flex-1 px-3 py-2"
                  @keyup.enter="toggleConnection"
                  :disabled="isConnected"
                >
              </div>
            </div>
            
            <div class="flex space-x-3">
              <button 
                @click="toggleConnection" 
                :disabled="isConnecting"
                class="btn-primary px-8 py-2 flex-1"
                :class="{ 'opacity-50 cursor-not-allowed': isConnecting }"
              >
                <i :class="isConnected ? 'fas fa-stop' : 'fas fa-play'" class="mr-2"></i>
                {{ isConnecting ? '连接中...' : (isConnected ? '关闭连接' : '开启连接') }}
              </button>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div 
                  class="w-3 h-3 rounded-full"
                  :class="statusIndicatorClass"
                ></div>
                <span class="text-sm">{{ connectionStatus }}</span>
              </div>
              <div class="text-sm text-[#94A3B8]">
                {{ connectionTime || '未连接' }}
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-3 bg-[#1E1E2E] rounded-lg">
                <div class="text-xl font-bold text-green-400">{{ sentCount }}</div>
                <div class="text-xs text-[#94A3B8]">已发送</div>
              </div>
              <div class="text-center p-3 bg-[#1E1E2E] rounded-lg">
                <div class="text-xl font-bold text-blue-400">{{ receivedCount }}</div>
                <div class="text-xs text-[#94A3B8]">已接收</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 发包设置 -->
      <div class="card p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">
          <i class="fas fa-paper-plane mr-2"></i>发包设置
        </h3>
        
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-[#94A3B8]">每隔</span>
            <input 
              type="number" 
              v-model="autoSendInterval" 
              min="1" 
              max="60"
              class="input-field px-3 py-2 w-20 text-center"
            >
            <span class="text-sm text-[#94A3B8]">秒发送内容</span>
            <button 
              @click="toggleAutoSend"
              :disabled="!isConnected"
              class="px-4 py-2 rounded text-sm"
              :class="autoSendEnabled ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'"
            >
              {{ autoSendEnabled ? '停止发送' : '开始发送' }}
            </button>
          </div>
          
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <input 
                type="checkbox" 
                v-model="clearInputAfterSend"
                class="form-checkbox text-[#165DFF]"
              >
              <span class="text-sm">发包清空输入</span>
            </label>
          </div>
          
          <div>
            <textarea 
              v-model="messageToSend"
              class="input-field w-full h-24 p-3 font-mono text-sm resize-none"
              placeholder="请输入要发送的消息内容..."
              @keydown.ctrl.enter="sendMessage"
            ></textarea>
          </div>
          
          <div class="flex space-x-3">
            <button 
              @click="sendMessage"
              :disabled="!isConnected || !messageToSend.trim()"
              class="btn-primary px-6 py-2 flex-1"
              :class="{ 'opacity-50 cursor-not-allowed': !isConnected || !messageToSend.trim() }"
            >
              <i class="fas fa-paper-plane mr-2"></i>发送到服务端
            </button>
            <button 
              @click="clearMessage"
              class="border border-[#165DFF] text-[#165DFF] hover:bg-[#165DFF] hover:text-white px-6 py-2 rounded"
            >
              <i class="fas fa-eraser mr-2"></i>清空
            </button>
          </div>
        </div>
      </div>
      
      <!-- 调试消息 -->
      <div class="card p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">
          <i class="fas fa-bug mr-2"></i>调试消息
        </h3>
        
        <div 
          ref="debugContainer"
          class="bg-[#1E1E2E] p-4 rounded-lg h-32 overflow-y-auto font-mono text-sm"
        >
          <div 
            v-for="debug in debugMessages" 
            :key="debug.id"
            class="mb-1"
            :class="debug.type === 'info' ? 'text-[#94A3B8]' : debug.type === 'error' ? 'text-red-400' : 'text-green-400'"
          >
            <span class="text-xs opacity-60">{{ debug.time }}</span>
            <span class="ml-2">=></span>
            <span class="ml-2">{{ debug.content }}</span>
          </div>
          
          <div v-if="debugMessages.length === 0" class="text-center text-[#94A3B8] py-8">
            暂无调试信息
          </div>
        </div>
      </div>
      
      <!-- 消息记录 -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">
            <i class="fas fa-list mr-2"></i>消息记录
          </h3>
          <button 
            @click="clearMessages"
            class="text-sm px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded"
          >
            清空消息
          </button>
        </div>
        
        <div class="flex items-center space-x-4 mb-4">
          <label class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              v-model="clearReceiveRecord"
              class="form-checkbox text-[#165DFF]"
            >
            <span class="text-sm">收包清空记录</span>
          </label>
          
          <label class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              v-model="jsonDecode"
              class="form-checkbox text-[#165DFF]"
            >
            <span class="text-sm">收包JSON解码</span>
          </label>
          
          <label class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              v-model="pauseReceive"
              class="form-checkbox text-[#165DFF]"
            >
            <span class="text-sm">暂停接收</span>
          </label>
        </div>
        
        <div 
          ref="messageContainer"
          class="bg-[#1E1E2E] p-4 rounded-lg h-80 overflow-y-auto font-mono text-sm space-y-2"
        >
          <div 
            v-for="message in messages" 
            :key="message.id"
            class="border border-[#2D2D3F] p-3 rounded"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold" :class="message.direction ? 'text-green-400' : 'text-blue-400'">
                {{ message.direction ? '发送' : '收到' }}消息 {{ message.time }}
              </span>
            </div>
            <div class="text-[#E2E8F0] break-all whitespace-pre-wrap">{{ message.content }}</div>
          </div>
          
          <div v-if="messages.length === 0" class="text-center text-[#94A3B8] py-8">
            暂无消息记录
          </div>
        </div>
        
        <div class="mt-4 flex space-x-3">
          <button 
            @click="exportMessages"
            class="btn-primary px-4 py-2 flex-1"
            :disabled="messages.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': messages.length === 0 }"
          >
            <i class="fas fa-download mr-2"></i>导出消息
          </button>
          <button 
            @click="copyMessages"
            class="border border-[#165DFF] text-[#165DFF] hover:bg-[#165DFF] hover:text-white px-4 py-2 flex-1 rounded"
            :disabled="messages.length === 0"
            :class="{ 'opacity-50 cursor-not-allowed': messages.length === 0 }"
          >
            <i class="fas fa-copy mr-2"></i>复制消息
          </button>
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
      default: 'websocket-tester'
    }
  },
  setup(props) {
    const { ref, computed, nextTick, onUnmounted } = Vue;
    const { showMessage } = useNotification();
    const { copyToClipboard } = useClipboard();
    const { downloadFile } = useDownload();
    
    // 连接相关
    const protocol = ref('ws://');
    const serverUrl = ref('echo.websocket.org');
    const websocket = ref(null);
    const isConnected = ref(false);
    const isConnecting = ref(false);
    const connectionTime = ref('');
    const connectionStartTime = ref(null);
    
    // 消息相关
    const messageToSend = ref('');
    const messages = ref([]);
    const debugMessages = ref([]);
    const messageContainer = ref(null);
    const debugContainer = ref(null);
    const sentCount = ref(0);
    const receivedCount = ref(0);
    
    // 自动发送相关
    const autoSendEnabled = ref(false);
    const autoSendInterval = ref(5);
    const autoSendTimer = ref(null);
    
    // 设置选项
    const clearInputAfterSend = ref(false);
    const clearReceiveRecord = ref(false);
    const jsonDecode = ref(true);
    const pauseReceive = ref(false);
    
    // 连接状态计算
    const connectionStatus = computed(() => {
      if (isConnecting.value) return '连接中...';
      if (isConnected.value) return '已连接';
      return '未连接';
    });
    
    const statusIndicatorClass = computed(() => {
      if (isConnecting.value) return 'bg-yellow-400 animate-pulse';
      if (isConnected.value) return 'bg-green-400';
      return 'bg-gray-400';
    });
    
    const statusTextClass = computed(() => {
      if (isConnecting.value) return 'text-yellow-400';
      if (isConnected.value) return 'text-green-400';
      return 'text-gray-400';
    });
    
    // 添加调试消息
    const addDebugMessage = (type, content) => {
      const message = {
        id: Date.now() + Math.random(),
        type,
        content,
        time: new Date().toLocaleTimeString()
      };
      
      debugMessages.value.push(message);
      
      // 限制调试消息数量
      if (debugMessages.value.length > 50) {
        debugMessages.value = debugMessages.value.slice(-25);
      }
      
      // 自动滚动到底部
      nextTick(() => {
        if (debugContainer.value) {
          debugContainer.value.scrollTop = debugContainer.value.scrollHeight;
        }
      });
    };
    
    // 添加消息记录
    const addMessageRecord = (direction, content) => {
      const message = {
        id: Date.now() + Math.random(),
        direction, // true: 发送, false: 接收
        content,
        time: new Date().toLocaleTimeString()
      };
      
      messages.value.push(message);
      
      // 限制消息记录数量
      if (messages.value.length > 100) {
        messages.value = messages.value.slice(-50);
      }
      
      // 自动滚动到底部
      nextTick(() => {
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
        }
      });
    };
    
    // 连接/断开 WebSocket
    const toggleConnection = () => {
      if (isConnected.value) {
        disconnect();
      } else {
        connect();
      }
    };
    
    // 连接 WebSocket
    const connect = () => {
      if (isConnected.value || isConnecting.value) return;
      
      const fullUrl = protocol.value + serverUrl.value;
      
      if (!serverUrl.value.trim()) {
        showMessage('请输入 WebSocket 服务器地址', 'warning');
        return;
      }
      
      isConnecting.value = true;
      addDebugMessage('info', `正在连接到: ${fullUrl}`);
      
      try {
        websocket.value = new WebSocket(fullUrl);
        
        websocket.value.onopen = () => {
          isConnected.value = true;
          isConnecting.value = false;
          connectionStartTime.value = new Date();
          updateConnectionTime();
          addDebugMessage('success', '连接成功建立');
          showMessage('WebSocket 连接成功', 'success');
          
          // 定时更新连接时间
          const timer = setInterval(() => {
            if (isConnected.value) {
              updateConnectionTime();
            } else {
              clearInterval(timer);
            }
          }, 1000);
        };
        
        websocket.value.onmessage = (event) => {
          if (pauseReceive.value) return;
          
          receivedCount.value++;
          let content = event.data;
          
          // JSON 解码
          if (jsonDecode.value) {
            try {
              const jsonData = JSON.parse(content);
              content = JSON.stringify(jsonData, null, 2);
            } catch (e) {
              // 如果不是 JSON，保持原样
            }
          }
          
          addMessageRecord(false, content);
          
          // 收包清空记录
          if (clearReceiveRecord.value) {
            // 可以在这里添加清空逻辑
          }
        };
        
        websocket.value.onclose = (event) => {
          isConnected.value = false;
          isConnecting.value = false;
          connectionTime.value = '';
          stopAutoSend();
          
          if (event.wasClean) {
            addDebugMessage('info', `连接正常关闭 (代码: ${event.code})`);
            showMessage('连接已断开', 'info');
          } else {
            addDebugMessage('error', `连接异常断开 (代码: ${event.code})`);
            showMessage('连接异常断开', 'error');
          }
        };
        
        websocket.value.onerror = (error) => {
          isConnecting.value = false;
          addDebugMessage('error', '连接发生错误');
          showMessage('WebSocket 连接错误', 'error');
          console.error('WebSocket error:', error);
        };
        
      } catch (error) {
        isConnecting.value = false;
        addDebugMessage('error', `连接失败: ${error.message}`);
        showMessage(`连接失败: ${error.message}`, 'error');
      }
    };
    
    // 断开连接
    const disconnect = () => {
      if (websocket.value && isConnected.value) {
        websocket.value.close();
        addDebugMessage('info', '手动断开连接');
        stopAutoSend();
      }
    };
    
    // 发送消息
    const sendMessage = () => {
      if (!isConnected.value || !messageToSend.value.trim()) return;
      
      const message = messageToSend.value.trim();
      
      try {
        websocket.value.send(message);
        sentCount.value++;
        addMessageRecord(true, message);
        addDebugMessage('success', '消息发送成功');
        
        // 清空输入框
        if (clearInputAfterSend.value) {
          messageToSend.value = '';
        }
        
        showMessage('消息发送成功', 'success');
      } catch (error) {
        addDebugMessage('error', `发送失败: ${error.message}`);
        showMessage('消息发送失败', 'error');
      }
    };
    
    // 清空消息输入
    const clearMessage = () => {
      messageToSend.value = '';
    };
    
    // 开始/停止自动发送
    const toggleAutoSend = () => {
      if (autoSendEnabled.value) {
        stopAutoSend();
      } else {
        startAutoSend();
      }
    };
    
    // 开始自动发送
    const startAutoSend = () => {
      if (!isConnected.value || !messageToSend.value.trim()) {
        showMessage('请先连接并输入消息内容', 'warning');
        return;
      }
      
      autoSendEnabled.value = true;
      autoSendTimer.value = setInterval(() => {
        sendMessage();
      }, autoSendInterval.value * 1000);
      
      addDebugMessage('info', `开始自动发送，间隔: ${autoSendInterval.value}秒`);
      showMessage('自动发送已开启', 'success');
    };
    
    // 停止自动发送
    const stopAutoSend = () => {
      if (autoSendTimer.value) {
        clearInterval(autoSendTimer.value);
        autoSendTimer.value = null;
      }
      autoSendEnabled.value = false;
      addDebugMessage('info', '自动发送已停止');
    };
    
    // 清空消息记录
    const clearMessages = () => {
      messages.value = [];
      debugMessages.value = [];
      sentCount.value = 0;
      receivedCount.value = 0;
      showMessage('消息记录已清空', 'success');
    };
    
    // 导出消息
    const exportMessages = () => {
      if (messages.value.length === 0) return;
      
      const content = messages.value.map(msg => 
        `[${msg.time}] [${msg.direction ? '发送' : '接收'}] ${msg.content}`
      ).join('\n');
      
      downloadFile(content, `websocket-messages-${new Date().toISOString().slice(0, 19)}.txt`, 'text/plain');
      showMessage('消息导出成功', 'success');
    };
    
    // 复制消息
    const copyMessages = () => {
      if (messages.value.length === 0) return;
      
      const content = messages.value.map(msg => 
        `[${msg.time}] [${msg.direction ? '发送' : '接收'}] ${msg.content}`
      ).join('\n');
      
      copyToClipboard(content);
    };
    
    // 更新连接时间
    const updateConnectionTime = () => {
      if (connectionStartTime.value) {
        const now = new Date();
        const diff = Math.floor((now - connectionStartTime.value) / 1000);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        
        connectionTime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    };
    
    // 组件卸载时清理
    onUnmounted(() => {
      if (websocket.value) {
        websocket.value.close();
      }
      stopAutoSend();
    });
    
    return {
      protocol,
      serverUrl,
      isConnected,
      isConnecting,
      connectionStatus,
      statusIndicatorClass,
      statusTextClass,
      connectionTime,
      messageToSend,
      messages,
      debugMessages,
      messageContainer,
      debugContainer,
      sentCount,
      receivedCount,
      autoSendEnabled,
      autoSendInterval,
      clearInputAfterSend,
      clearReceiveRecord,
      jsonDecode,
      pauseReceive,
      toggleConnection,
      sendMessage,
      clearMessage,
      toggleAutoSend,
      clearMessages,
      exportMessages,
      copyMessages
    };
  }
};

// 暴露组件到全局，供 ToolLoader 使用
window.WebsocketTesterTool = WebsocketTesterTool; 