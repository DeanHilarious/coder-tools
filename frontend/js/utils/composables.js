// 可复用的组合式函数

// 消息通知系统
const useNotification = () => {
  const showMessage = (message, type = 'info') => {
    // 移除现有消息
    const existingMessage = document.querySelector('.message-toast');
    if (existingMessage) {
      existingMessage.remove();
    }

    const toast = document.createElement('div');
    toast.className = `message-toast fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`;

    let bgColor, textColor, icon;
    switch (type) {
      case 'success':
        bgColor = 'bg-green-500';
        textColor = 'text-white';
        icon = 'fas fa-check-circle';
        break;
      case 'warning':
        bgColor = 'bg-yellow-500';
        textColor = 'text-white';
        icon = 'fas fa-exclamation-triangle';
        break;
      case 'error':
        bgColor = 'bg-red-500';
        textColor = 'text-white';
        icon = 'fas fa-times-circle';
        break;
      default:
        bgColor = 'bg-blue-500';
        textColor = 'text-white';
        icon = 'fas fa-info-circle';
    }

    toast.className += ` ${bgColor} ${textColor}`;
    toast.innerHTML = `
      <div class="flex items-center">
        <i class="${icon} mr-2"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    // 3秒后自动移除
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  };

  return { showMessage };
};

// 剪贴板功能
const useClipboard = () => {
  const { showMessage } = useNotification();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showMessage('已复制到剪贴板', 'success');
    }).catch(() => {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showMessage('已复制到剪贴板', 'success');
    });
  };

  return { copyToClipboard };
};

// 主题管理
const useTheme = () => {
  const { ref } = Vue;
  const isDark = ref(true);

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    const body = document.body;
    
    if (isDark.value) {
      body.classList.remove('light');
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark');
      body.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      isDark.value = false;
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  };

  return { isDark, toggleTheme, initTheme };
};

// 本地存储
const useLocalStorage = (key, defaultValue) => {
  const { ref } = Vue;
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : defaultValue;
  
  const value = ref(initial);

  const setValue = (newValue) => {
    value.value = newValue;
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  const removeValue = () => {
    value.value = defaultValue;
    localStorage.removeItem(key);
  };

  return { value, setValue, removeValue };
};

// 防抖函数
const useDebounce = (fn, delay) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// 文件下载
const useDownload = () => {
  const downloadFile = (content, filename, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return { downloadFile };
}; 