// 文本比对工具组件
const TextDiffTool = {
  template: `
    <tool-page-base :tool-id="toolId">
      <!-- 控制面板 -->
      <div class="control-panel mb-6">
        <div class="control-group">
          <label class="control-label">
            <input type="checkbox" v-model="showDiff" @change="compareTexts">
            显示差异
          </label>
          <label class="control-label">
            <input type="checkbox" v-model="showWhitespace" @change="compareTexts">
            显示空白字符
          </label>
          <label class="control-label">
            <input type="checkbox" v-model="ignoreCase" @change="compareTexts">
            忽略大小写
          </label>
          <label class="control-label">
            <input type="checkbox" v-model="ignoreWhitespace" @change="compareTexts">
            忽略空白字符
          </label>
        </div>
        
        <div class="diff-stats">
          <span>{{ diffStatsText }}</span>
        </div>
        
        <div class="navigation-controls">
          <button @click="navigateToDiff(0)" :disabled="!canNavigate || isFirst" class="btn btn-secondary">
            <i class="fas fa-angle-double-left"></i>
            第一个
          </button>
          <button @click="navigateToDiff(currentDiffIndex - 1)" :disabled="!canNavigate || isFirst" class="btn btn-secondary">
            <i class="fas fa-angle-left"></i>
            上一个
          </button>
          <button @click="navigateToDiff(currentDiffIndex + 1)" :disabled="!canNavigate || isLast" class="btn btn-secondary">
            <i class="fas fa-angle-right"></i>
            下一个
          </button>
          <button @click="navigateToDiff(differences.length - 1)" :disabled="!canNavigate || isLast" class="btn btn-secondary">
            <i class="fas fa-angle-double-right"></i>
            最后一个
          </button>
        </div>
      </div>

      <!-- 文本比对区域 -->
      <div class="diff-container">
        <div class="diff-panel">
          <div class="diff-header">
            <h3>原文本</h3>
            <div class="diff-actions">
              <button @click="clearLeft" class="btn btn-sm btn-secondary">
                <i class="fas fa-eraser"></i>
                清空
              </button>
              <button @click="loadSampleLeft" class="btn btn-sm btn-secondary">
                <i class="fas fa-file-text"></i>
                示例
              </button>
            </div>
          </div>
          <div class="diff-editor">
            <textarea 
              v-model="leftText" 
              @input="compareTexts"
              @scroll="syncScroll('left')"
              ref="leftTextarea"
              placeholder="请输入原文本..." 
              spellcheck="false"
              class="diff-textarea"
            ></textarea>
            <div ref="leftHighlight" class="highlight-layer" v-html="leftHighlightHtml"></div>
          </div>
        </div>

        <div class="diff-panel">
          <div class="diff-header">
            <h3>对比文本</h3>
            <div class="diff-actions">
              <button @click="clearRight" class="btn btn-sm btn-secondary">
                <i class="fas fa-eraser"></i>
                清空
              </button>
              <button @click="loadSampleRight" class="btn btn-sm btn-secondary">
                <i class="fas fa-file-text"></i>
                示例
              </button>
            </div>
          </div>
          <div class="diff-editor">
            <textarea 
              v-model="rightText" 
              @input="compareTexts"
              @scroll="syncScroll('right')"
              ref="rightTextarea"
              placeholder="请输入对比文本..." 
              spellcheck="false"
              class="diff-textarea"
            ></textarea>
            <div ref="rightHighlight" class="highlight-layer" v-html="rightHighlightHtml"></div>
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
      default: 'text-diff'
    }
  },
  setup(props) {
    const { ref, computed, watch, onMounted, nextTick } = Vue;
    const { showMessage } = useNotification();
    
    // 响应式数据
    const leftText = ref('');
    const rightText = ref('');
    const showDiff = ref(true);
    const showWhitespace = ref(false);
    const ignoreCase = ref(false);
    const ignoreWhitespace = ref(false);
    const differences = ref([]);
    const currentDiffIndex = ref(-1);
    const leftTextarea = ref(null);
    const rightTextarea = ref(null);
    const leftHighlight = ref(null);
    const rightHighlight = ref(null);
    
    // 计算属性
    const diffStatsText = computed(() => {
      const totalDiffs = differences.value.length;
      const currentIndex = currentDiffIndex.value + 1;
      const currentLine = currentDiffIndex.value >= 0 ? differences.value[currentDiffIndex.value].lineNumber : 0;
      return `双向对比: 共 ${totalDiffs} 处不同，当前第 ${currentIndex} 个 [行 ${currentLine}]`;
    });
    
    const canNavigate = computed(() => differences.value.length > 0);
    const isFirst = computed(() => currentDiffIndex.value <= 0);
    const isLast = computed(() => currentDiffIndex.value >= differences.value.length - 1);
    
    const leftHighlightHtml = computed(() => {
      return generateHighlightHTML(leftText.value, 'left', showWhitespace.value, differences.value, showDiff.value);
    });
    
    const rightHighlightHtml = computed(() => {
      return generateHighlightHTML(rightText.value, 'right', showWhitespace.value, differences.value, showDiff.value);
    });
    
    // 工具方法
    const compareTexts = () => {
      const options = {
        ignoreCase: ignoreCase.value,
        ignoreWhitespace: ignoreWhitespace.value,
        showWhitespace: showWhitespace.value,
        showDiff: showDiff.value
      };
      
      differences.value = generateDiff(leftText.value, rightText.value, options);
      currentDiffIndex.value = -1;
    };
    
    const generateDiff = (leftText, rightText, options) => {
      let left = leftText;
      let right = rightText;
      
      // 预处理文本
      if (options.ignoreCase) {
        left = left.toLowerCase();
        right = right.toLowerCase();
      }
      
      if (options.ignoreWhitespace) {
        left = left.replace(/\s+/g, ' ').trim();
        right = right.replace(/\s+/g, ' ').trim();
      }
      
      const leftLines = left.split('\n');
      const rightLines = right.split('\n');
      
      return computeLineDiff(leftLines, rightLines);
    };
    
    const computeLineDiff = (leftLines, rightLines) => {
      const diffs = [];
      const maxLines = Math.max(leftLines.length, rightLines.length);
      
      for (let i = 0; i < maxLines; i++) {
        const leftLine = leftLines[i] || '';
        const rightLine = rightLines[i] || '';
        
        if (leftLine !== rightLine) {
          diffs.push({
            lineNumber: i + 1,
            leftLine: leftLine,
            rightLine: rightLine,
            type: getDiffType(leftLine, rightLine)
          });
        }
      }
      
      return diffs;
    };
    
    const getDiffType = (leftLine, rightLine) => {
      if (leftLine === '') return 'added';
      if (rightLine === '') return 'removed';
      return 'modified';
    };
    
    const generateHighlightHTML = (text, side, showWhitespace, differences, showDiff) => {
      const lines = text.split('\n');
      let html = '';
      
      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const diff = differences.find(d => d.lineNumber === lineNumber);
        
        let className = 'diff-line';
        if (showDiff && diff) {
          if (diff.type === 'added' && side === 'right') className += ' added';
          if (diff.type === 'removed' && side === 'left') className += ' removed';
          if (diff.type === 'modified') className += side === 'left' ? ' removed' : ' added';
        }
        
        let displayLine = line;
        if (showWhitespace) {
          displayLine = line.replace(/ /g, '·').replace(/\t/g, '→');
        }
        
        // 确保空行也有适当的高度
        if (displayLine === '') {
          displayLine = ' ';
        }
        
        html += `<div class="${className}">${displayLine}</div>`;
      });
      
      return html;
    };
    
    const syncScroll = (source) => {
      if (source === 'left' && leftTextarea.value && rightTextarea.value) {
        const scrollRatio = leftTextarea.value.scrollTop / (leftTextarea.value.scrollHeight - leftTextarea.value.clientHeight);
        rightTextarea.value.scrollTop = scrollRatio * (rightTextarea.value.scrollHeight - rightTextarea.value.clientHeight);
        
        // 同步高亮层滚动
        if (leftHighlight.value) {
          leftHighlight.value.scrollTop = leftTextarea.value.scrollTop;
        }
        if (rightHighlight.value) {
          rightHighlight.value.scrollTop = rightTextarea.value.scrollTop;
        }
      } else if (source === 'right' && rightTextarea.value && leftTextarea.value) {
        const scrollRatio = rightTextarea.value.scrollTop / (rightTextarea.value.scrollHeight - rightTextarea.value.clientHeight);
        leftTextarea.value.scrollTop = scrollRatio * (leftTextarea.value.scrollHeight - leftTextarea.value.clientHeight);
        
        // 同步高亮层滚动
        if (leftHighlight.value) {
          leftHighlight.value.scrollTop = leftTextarea.value.scrollTop;
        }
        if (rightHighlight.value) {
          rightHighlight.value.scrollTop = rightTextarea.value.scrollTop;
        }
      }
    };
    
    const navigateToDiff = (index) => {
      if (index < 0 || index >= differences.value.length) return;
      
      currentDiffIndex.value = index;
      scrollToDiff(index);
    };
    
    const scrollToDiff = (index) => {
      const diff = differences.value[index];
      if (!diff) return;
      
      const lineHeight = parseFloat(getComputedStyle(leftTextarea.value).lineHeight);
      const scrollTop = (diff.lineNumber - 1) * lineHeight;
      
      if (leftTextarea.value) leftTextarea.value.scrollTop = scrollTop;
      if (rightTextarea.value) rightTextarea.value.scrollTop = scrollTop;
    };
    
    const clearLeft = () => {
      leftText.value = '';
      compareTexts();
    };
    
    const clearRight = () => {
      rightText.value = '';
      compareTexts();
    };
    
    const loadSampleLeft = () => {
      leftText.value = getSampleText1();
      compareTexts();
    };
    
    const loadSampleRight = () => {
      rightText.value = getSampleText2();
      compareTexts();
    };
    
    const getSampleText1 = () => {
      return `function calculateSum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  return a + b;
}

const result = calculateSum(5, 3);
console.log('Result:', result);

// 测试用例
const testCases = [
  { a: 1, b: 2, expected: 3 },
  { a: -1, b: 1, expected: 0 },
  { a: 0, b: 0, expected: 0 }
];`;
    };
    
    const getSampleText2 = () => {
      return `function calculateSum(a, b, c = 0) {
  if (typeof a !== 'number' || typeof b !== 'number' || typeof c !== 'number') {
    throw new Error('All arguments must be numbers');
  }
  return a + b + c;
}

const result = calculateSum(5, 3, 2);
console.log('计算结果:', result);

// 测试用例
const testCases = [
  { a: 1, b: 2, expected: 3 },
  { a: -1, b: 1, expected: 0 },
  { a: 0, b: 0, expected: 0 },
  { a: 1, b: 2, c: 3, expected: 6 }
];`;
    };
    
    // 初始化
    onMounted(() => {
      compareTexts();
    });
    
    return {
      leftText,
      rightText,
      showDiff,
      showWhitespace,
      ignoreCase,
      ignoreWhitespace,
      differences,
      currentDiffIndex,
      leftTextarea,
      rightTextarea,
      leftHighlight,
      rightHighlight,
      diffStatsText,
      canNavigate,
      isFirst,
      isLast,
      leftHighlightHtml,
      rightHighlightHtml,
      compareTexts,
      syncScroll,
      navigateToDiff,
      clearLeft,
      clearRight,
      loadSampleLeft,
      loadSampleRight
    };
  }
};

// 添加样式
const style = document.createElement('style');
style.textContent = `
  .control-panel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .control-group {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }

  .control-label {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    color: var(--text-secondary);
    cursor: pointer;
  }

  .control-label input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--primary-color);
  }

  .diff-stats {
    color: var(--text-primary);
    font-weight: 500;
    padding: 8px 12px;
    background: rgba(74, 222, 128, 0.1);
    border-radius: 6px;
    border: 1px solid rgba(74, 222, 128, 0.2);
  }

  .navigation-controls {
    display: flex;
    gap: 8px;
    margin-left: auto;
  }

  .navigation-controls .btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .diff-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    height: 600px;
  }

  .diff-panel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .diff-header {
    background: rgba(255, 255, 255, 0.1);
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .diff-header h3 {
    margin: 0;
    font-size: 16px;
    color: var(--text-primary);
  }

  .diff-actions {
    display: flex;
    gap: 8px;
  }

  .diff-editor {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .diff-textarea {
    width: 100%;
    height: 100%;
    padding: 20px;
    border: none;
    background: transparent;
    color: transparent;
    caret-color: var(--text-primary);
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 14px;
    line-height: 1.6;
    resize: none;
    outline: none;
    overflow-y: auto;
    position: relative;
    z-index: 2;
  }

  .diff-textarea::selection {
    background: rgba(59, 130, 246, 0.3);
  }

  .diff-textarea::-moz-selection {
    background: rgba(59, 130, 246, 0.3);
  }

  .highlight-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 14px;
    line-height: 1.6;
    padding: 20px;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-y: auto;
    z-index: 1;
    color: var(--text-primary);
  }

  .diff-line {
    display: block;
    margin: 0;
    padding: 0;
    min-height: 1.6em;
  }

  .diff-line.added {
    background: rgba(74, 222, 128, 0.2);
    border-left: 3px solid #4ade80;
  }

  .diff-line.removed {
    background: rgba(239, 68, 68, 0.2);
    border-left: 3px solid #ef4444;
  }

  .diff-line.current {
    background: rgba(59, 130, 246, 0.3);
    border-left: 3px solid #3b82f6;
  }

  @media (max-width: 768px) {
    .control-panel {
      flex-direction: column;
      align-items: flex-start;
    }

    .navigation-controls {
      margin-left: 0;
    }

    .diff-container {
      grid-template-columns: 1fr;
      height: auto;
    }

    .diff-panel {
      height: 400px;
    }
  }
`;

if (!document.querySelector('style[data-text-diff]')) {
  style.setAttribute('data-text-diff', 'true');
  document.head.appendChild(style);
}

// 导出工具组件
window.TextDiffTool = TextDiffTool; 