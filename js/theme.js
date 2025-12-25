/**
 * Theme Manager
 * 负责全局深色/浅色模式切换与持久化
 */

// --- 1. 初始化 (立即执行) ---
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode');
    } else {
        document.documentElement.classList.remove('light-mode');
    }
})();

// --- 2. 事件监听与绑定 ---
document.addEventListener('DOMContentLoaded', () => {
    const isLight = document.documentElement.classList.contains('light-mode');
    updateThemeIcon(isLight);

    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.onclick = null; // 清除内联事件防止冲突
        btn.addEventListener('click', handleThemeToggle);
    }
});

// --- 3. 核心切换逻辑 ---
function handleThemeToggle() {
    const root = document.documentElement;
    const isLight = root.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
    // 额外功能：尝试同步 iframe 内部的主题（如果在 main.html 中）
    const frame = document.getElementById('app-frame');
    if (frame && frame.contentWindow) {
        const frameRoot = frame.contentWindow.document.documentElement;
        if (isLight) frameRoot.classList.add('light-mode');
        else frameRoot.classList.remove('light-mode');
    }
}

// --- 4. UI 更新 ---
function updateThemeIcon(isLight) {
    const sun = document.querySelector('.sun-icon');
    const moon = document.querySelector('.moon-icon');
    if (!sun || !moon) return;
    sun.style.display = isLight ? 'block' : 'none';
    moon.style.display = isLight ? 'none' : 'block';
}
