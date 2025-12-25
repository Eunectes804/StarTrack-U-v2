/**
 * MainApp 核心逻辑对象
 * 管理全局导航和界面交互
 */
const MainApp = {
    // --- 导航模块 (Navigation) ---
    Navigation: {
        loadPage(url, el) {
            document.getElementById('app-frame').src = url;
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            if (el) {
                el.classList.add('active');
            }
        }
    },

    // --- 界面交互 (UI) ---
    UI: {
        toggleSidebar() {
            // 在移动端禁止使用伸缩栏，防止布局错乱
            if (window.innerWidth <= 768) {
                console.log("Sidebar toggle disabled on mobile");
                return;
            }

            const frame = document.getElementById('app-frame');
            // 尝试调用子页面的 toggleSidebar
            if (frame.contentWindow && frame.contentWindow.toggleSidebar) {
                frame.contentWindow.toggleSidebar();
            } else {
                console.warn("Current page does not support sidebar toggle");
            }
        }
    }
};

// --- 启动 ---
// 移除空的 init() 调用，直接绑定事件
document.addEventListener('DOMContentLoaded', () => {
    // 预留初始化逻辑（目前无内容）
});