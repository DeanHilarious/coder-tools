// 密码生成器工具组件
const PasswordGeneratorTool = {
  template: `
    <tool-page-base :tool-id="toolId">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="card p-6">
          <h3 class="text-lg font-semibold mb-4">配置选项</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-[#94A3B8] mb-2">密码长度</label>
              <div class="flex items-center space-x-4">
                <input 
                  type="range" 
                  v-model="passwordLength" 
                  min="4" 
                  max="128" 
                  class="flex-1"
                >
                <span class="text-[#165DFF] font-semibold w-8">{{ passwordLength }}</span>
              </div>
            </div>
            
            <div class="space-y-2">
              <label class="block text-sm text-[#94A3B8] mb-2">字符类型</label>
              <div class="space-y-2">
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="includeUppercase" class="rounded mr-2">
                  <span>大写字母 (A-Z)</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="includeLowercase" class="rounded mr-2">
                  <span>小写字母 (a-z)</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="includeNumbers" class="rounded mr-2">
                  <span>数字 (0-9)</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="includeSymbols" class="rounded mr-2">
                  <span>符号 (!@#$%^&*)</span>
                </label>
              </div>
            </div>
            
            <div>
              <label class="block text-sm text-[#94A3B8] mb-2">高级选项</label>
              <div class="space-y-2">
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="excludeSimilar" class="rounded mr-2">
                  <span>排除相似字符 (0, O, l, I, 1)</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="excludeAmbiguous" class="rounded mr-2">
                  <span>排除歧义字符 ({, }, [, ], (, ), /, \\, ', ", \`)</span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="mt-6 space-y-3">
            <button @click="generatePassword" class="btn-primary w-full px-6 py-3">
              <i class="fas fa-key mr-2"></i>生成密码
            </button>
            <button @click="generateBatch" class="btn-primary w-full px-6 py-3">
              <i class="fas fa-list mr-2"></i>批量生成 (10个)
            </button>
          </div>
        </div>
        
        <div class="card p-6">
          <h3 class="text-lg font-semibold mb-4">生成结果</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-[#94A3B8] mb-2">当前密码</label>
              <div class="flex items-center space-x-2">
                <input 
                  type="text" 
                  v-model="currentPassword" 
                  readonly 
                  class="input-field flex-1 px-3 py-2 font-mono text-sm"
                  placeholder="点击生成密码..."
                >
                <button @click="copyPassword" class="btn-primary px-3 py-2">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
              <div class="mt-2 text-sm" :class="strengthClass">
                <i :class="strengthIcon + ' mr-1'"></i>
                密码强度: {{ strengthText }}
              </div>
            </div>
            
            <div v-if="passwordBatch.length > 0">
              <label class="block text-sm text-[#94A3B8] mb-2">批量生成结果</label>
              <div class="bg-[#1E1E2E] p-4 rounded-lg max-h-64 overflow-y-auto">
                <div 
                  v-for="(password, index) in passwordBatch" 
                  :key="index"
                  class="flex items-center justify-between py-1 hover:bg-[#2D2D3F] px-2 rounded cursor-pointer"
                  @click="selectPassword(password)"
                >
                  <span class="font-mono text-sm">{{ password }}</span>
                  <button @click.stop="copySpecificPassword(password)" class="text-[#165DFF] hover:text-[#165DFF]/80">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <div class="mt-2 flex space-x-2">
                <button @click="copyAllPasswords" class="btn-primary flex-1 px-4 py-2">
                  <i class="fas fa-copy mr-2"></i>复制全部
                </button>
                <button @click="downloadPasswords" class="btn-primary flex-1 px-4 py-2">
                  <i class="fas fa-download mr-2"></i>下载
                </button>
              </div>
            </div>
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
      default: 'password-generator'
    }
  },
  setup(props) {
    const { ref, computed } = Vue;
    const { showMessage } = useNotification();
    const { copyToClipboard } = useClipboard();
    const { downloadFile } = useDownload();
    
    // 配置选项
    const passwordLength = ref(12);
    const includeUppercase = ref(true);
    const includeLowercase = ref(true);
    const includeNumbers = ref(true);
    const includeSymbols = ref(false);
    const excludeSimilar = ref(false);
    const excludeAmbiguous = ref(false);
    
    // 生成结果
    const currentPassword = ref('');
    const passwordBatch = ref([]);
    
    // 字符集
    const charset = computed(() => {
      let chars = '';
      
      if (includeUppercase.value) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (includeLowercase.value) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (includeNumbers.value) chars += '0123456789';
      if (includeSymbols.value) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      // 排除相似字符
      if (excludeSimilar.value) {
        chars = chars.replace(/[0Ol1I]/g, '');
      }
      
      // 排除歧义字符
      if (excludeAmbiguous.value) {
        chars = chars.replace(/[\{\}\[\]\(\)\/\\'""`]/g, '');
      }
      
      return chars;
    });
    
    // 密码强度计算
    const passwordStrength = computed(() => {
      const password = currentPassword.value;
      if (!password) return 0;
      
      let score = 0;
      
      // 长度评分
      if (password.length >= 8) score += 1;
      if (password.length >= 12) score += 1;
      if (password.length >= 16) score += 1;
      
      // 字符种类评分
      if (/[a-z]/.test(password)) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score += 1;
      
      return Math.min(score, 4);
    });
    
    const strengthClass = computed(() => {
      const strength = passwordStrength.value;
      if (strength <= 1) return 'text-red-400';
      if (strength <= 2) return 'text-yellow-400';
      if (strength <= 3) return 'text-blue-400';
      return 'text-green-400';
    });
    
    const strengthIcon = computed(() => {
      const strength = passwordStrength.value;
      if (strength <= 1) return 'fas fa-exclamation-triangle';
      if (strength <= 2) return 'fas fa-minus-circle';
      if (strength <= 3) return 'fas fa-check-circle';
      return 'fas fa-shield-alt';
    });
    
    const strengthText = computed(() => {
      const strength = passwordStrength.value;
      if (strength <= 1) return '弱';
      if (strength <= 2) return '中等';
      if (strength <= 3) return '强';
      return '非常强';
    });
    
    // 生成密码
    const generatePassword = () => {
      if (!charset.value) {
        showMessage('请至少选择一种字符类型', 'warning');
        return;
      }
      
      let password = '';
      for (let i = 0; i < passwordLength.value; i++) {
        const randomIndex = Math.floor(Math.random() * charset.value.length);
        password += charset.value[randomIndex];
      }
      
      currentPassword.value = password;
      showMessage('密码生成成功', 'success');
    };
    
    // 批量生成
    const generateBatch = () => {
      if (!charset.value) {
        showMessage('请至少选择一种字符类型', 'warning');
        return;
      }
      
      const passwords = [];
      for (let i = 0; i < 10; i++) {
        let password = '';
        for (let j = 0; j < passwordLength.value; j++) {
          const randomIndex = Math.floor(Math.random() * charset.value.length);
          password += charset.value[randomIndex];
        }
        passwords.push(password);
      }
      
      passwordBatch.value = passwords;
      showMessage('批量生成完成', 'success');
    };
    
    // 选择密码
    const selectPassword = (password) => {
      currentPassword.value = password;
      showMessage('密码已选择', 'success');
    };
    
    // 复制密码
    const copyPassword = () => {
      if (!currentPassword.value) {
        showMessage('请先生成密码', 'warning');
        return;
      }
      copyToClipboard(currentPassword.value);
    };
    
    // 复制特定密码
    const copySpecificPassword = (password) => {
      copyToClipboard(password);
    };
    
    // 复制全部密码
    const copyAllPasswords = () => {
      if (passwordBatch.value.length === 0) {
        showMessage('没有密码可复制', 'warning');
        return;
      }
      
      const allPasswords = passwordBatch.value.join('\n');
      copyToClipboard(allPasswords);
    };
    
    // 下载密码
    const downloadPasswords = () => {
      if (passwordBatch.value.length === 0) {
        showMessage('没有密码可下载', 'warning');
        return;
      }
      
      const content = passwordBatch.value.join('\n');
      downloadFile(content, 'passwords.txt', 'text/plain');
      showMessage('密码文件下载成功', 'success');
    };
    
    return {
      passwordLength,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeSimilar,
      excludeAmbiguous,
      currentPassword,
      passwordBatch,
      strengthClass,
      strengthIcon,
      strengthText,
      generatePassword,
      generateBatch,
      selectPassword,
      copyPassword,
      copySpecificPassword,
      copyAllPasswords,
      downloadPasswords
    };
  }
};

// 暴露组件到全局，供 ToolLoader 使用
window.PasswordGeneratorTool = PasswordGeneratorTool; 