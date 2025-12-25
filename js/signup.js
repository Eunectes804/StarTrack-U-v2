/**
 * Signup 核心逻辑对象
 * 处理注册表单验证与提交
 */
const Signup = {
    // --- 1. 状态管理 (State) ---
    state: {
        isEmailValid: false,
        isPasswordValid: false,
        isConfirmValid: false
    },

    // --- 2. 初始化 (Init) ---
    init() {
        this.UI.init();
        // 暴露给全局调用
        window.handleSignup = (e) => this.Actions.submit(e);
    },

    // --- 3. 界面交互 (UI) ---
    UI: {
        init() {
            this.emailInput = document.getElementById('email');
            this.passwordInput = document.getElementById('password');
            this.confirmInput = document.getElementById('confirmPassword');
            this.submitBtn = document.getElementById('submitBtn');
            this.emailMsg = document.getElementById('emailMsg');
            this.passwordMsg = document.getElementById('passwordMsg');
            this.confirmMsg = document.getElementById('confirmMsg');
            this.bar = document.getElementById('bar');
            this.meter = document.getElementById('meter');

            this.bindEvents();
        },

        bindEvents() {
            // 邮箱验证
            this.emailInput.addEventListener('input', () => {
                Signup.state.isEmailValid = FormValidator.validateEmail(this.emailInput.value);
                FormValidator.updateValidationUI(this.emailInput, this.emailMsg, Signup.state.isEmailValid, '邮箱可用', '无效的邮箱格式');
                Signup.Actions.validateForm();
            });

            // 密码验证
            this.passwordInput.addEventListener('input', () => {
                const pass = this.passwordInput.value;
                const strength = FormValidator.checkPasswordStrength(pass);
                
                this.meter.style.display = pass ? 'block' : 'none';
                this.bar.style.width = (strength * 20) + '%'; // 5分制，每分20%
                
                if (strength <= 2) this.bar.style.background = '#ff4d4d';
                else if (strength <= 4) this.bar.style.background = '#ffa500';
                else if (strength === 5) this.bar.style.background = '#b6ff3b';

                Signup.state.isPasswordValid = FormValidator.validatePassword(pass);
                
                FormValidator.updateValidationUI(this.passwordInput, this.passwordMsg, Signup.state.isPasswordValid, '密码安全', '需>8位,含数字/大小写/特殊符');
                
                // 重新检查确认密码
                Signup.Actions.checkConfirm();
                Signup.Actions.validateForm();
            });

            // 确认密码验证
            this.confirmInput.addEventListener('input', () => {
                Signup.Actions.checkConfirm();
                Signup.Actions.validateForm();
            });
        }
    },

    // --- 4. 业务逻辑 (Actions) ---
    Actions: {
        checkConfirm() {
            const ui = Signup.UI;
            if (ui.confirmInput.value === '') {
                ui.confirmMsg.classList.remove('visible');
                Signup.state.isConfirmValid = false;
            } else {
                Signup.state.isConfirmValid = ui.confirmInput.value === ui.passwordInput.value;
                FormValidator.updateValidationUI(ui.confirmInput, ui.confirmMsg, Signup.state.isConfirmValid, '密码匹配', '密码不匹配');
            }
        },

        validateForm() {
            const { isEmailValid, isPasswordValid, isConfirmValid } = Signup.state;
            Signup.UI.submitBtn.disabled = !(isEmailValid && isPasswordValid && isConfirmValid);
        },

        submit(event) {
            event.preventDefault();
            const btn = Signup.UI.submitBtn;
            btn.innerText = '创建中...';
            setTimeout(() => {
                alert('账户创建成功！正在跳转登录页...');
                window.location.href = 'login.html';
            }, 1500);
        }
    }
};

// --- 启动 ---
window.addEventListener('DOMContentLoaded', () => Signup.init());