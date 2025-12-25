/**
 * Profile 核心逻辑对象
 * 管理用户资料的展示与更新
 */
const Profile = {
    // --- 1. 初始化 (Init) ---
    init() {
        // 暴露给全局调用
        window.saveProfile = () => this.Actions.save();
    },

    // --- 2. 业务逻辑 (Actions) ---
    Actions: {
        save() {
            const btn = document.querySelector('.btn-primary');
            const originalText = btn.innerText;
            
            // 模拟保存成功的反馈动画
            btn.innerText = "保存成功！";
            btn.style.backgroundColor = "var(--accent-blue)";
            btn.style.color = "#fff";
            
            // 可以在这里添加 DB.saveUser(...) 逻辑
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = "var(--accent)";
                btn.style.color = "#000";
            }, 2000);
        }
    }
};

// --- 启动 ---
window.addEventListener('DOMContentLoaded', () => Profile.init());