/**
 * Login 核心逻辑对象
 * 处理登录表单验证与提交
 */
const Login = {
    // --- 1. 初始化 (Init) ---
    init() {
        this.UI.init();
        // 暴露给全局调用
        window.handleLogin = (e) => this.Actions.submit(e);
    },

    // --- 2. 界面交互 (UI) ---
    UI: {
        init() {
            this.emailInput = document.getElementById('email');
            this.passwordInput = document.getElementById('password');
            this.emailMsg = document.getElementById('emailMsg');
            this.passwordMsg = document.getElementById('passwordMsg');
            this.loginBtn = document.getElementById('loginBtn');

            this.bindEvents();
        },

        bindEvents() {
            this.emailInput.addEventListener('input', () => {
                const isValid = FormValidator.validateEmail(this.emailInput.value);
                FormValidator.updateValidationUI(this.emailInput, this.emailMsg, isValid, '邮箱格式正确', '无效的邮箱格式');
            });

            this.passwordInput.addEventListener('input', () => {
                const isValid = FormValidator.validatePassword(this.passwordInput.value); 
                FormValidator.updateValidationUI(this.passwordInput, this.passwordMsg, isValid, '格式有效', '需>8位,含数字/大小写/特殊符');
            });
        }
    },

    // --- 3. 业务逻辑 (Actions) ---
    Actions: {
        submit(event) {
            event.preventDefault();
            const ui = Login.UI;
            
            const email = ui.emailInput.value;
            const password = ui.passwordInput.value;
            
            const isEmailValid = FormValidator.validateEmail(email);
            const isPasswordValid = FormValidator.validatePassword(password);

            if(isEmailValid && isPasswordValid) {
                ui.loginBtn.innerText = '登录中...';
                setTimeout(() => {
                    console.log("Login successful, redirecting...");
                    window.location.href = 'main.html';
                }, 1000);
            } else {
                FormValidator.updateValidationUI(ui.emailInput, ui.emailMsg, isEmailValid, '邮箱格式正确', '无效的邮箱格式');
                FormValidator.updateValidationUI(ui.passwordInput, ui.passwordMsg, isPasswordValid, '格式有效', '请输入密码');
            }
        }
    }
};

// --- 启动 ---
window.addEventListener('DOMContentLoaded', () => Login.init());