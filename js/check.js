/**
 * check.js
 * 统一的表单验证逻辑库
 * 用于登录(login.html)和注册(signup.html)页面的输入校验
 */
class FormValidator {
    // --- 1. 核心验证逻辑 ---
    
    /**
     * 验证邮箱格式
     * @param {string} email 
     * @returns {boolean}
     */
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    /**
     * 验证密码严格要求 (大于8位，包含数字、大小写字母、特殊符号)
     * @param {string} password 
     * @returns {boolean}
     */
    static validatePassword(password) {
        const hasLength = password.length > 8;
        const hasNumber = /[0-9]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        return hasLength && hasNumber && hasUpper && hasLower && hasSpecial;
    }
    /**
     * 计算密码强度分数 (0-5)
     * @param {string} password 
     * @returns {number}
     */
    static checkPasswordStrength(password) {
        let score = 0;
        if (password.length > 8) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++; // 特殊字符
        return score;
    }

    // --- 2. UI 交互反馈 ---

    /**
     * 更新验证提示 UI
     * @param {HTMLElement} inputElement 输入框元素
     * @param {HTMLElement} msgElement 提示消息容器元素
     * @param {boolean} isValid 是否通过验证
     * @param {string} successText 成功提示文案
     * @param {string} errorText 失败提示文案
     */
    static updateValidationUI(inputElement, msgElement, isValid, successText, errorText) {
        if (!inputElement || !msgElement) return;
        if (inputElement.value.trim() === '') {
            msgElement.classList.remove('visible');
            return;
        }
        msgElement.classList.add('visible');
        // 重置类名，保留基础类
        msgElement.className = 'validation-msg visible';
        if (isValid) {
            msgElement.classList.add('valid');
            msgElement.querySelector('.text').innerText = successText;
            msgElement.querySelector('.msg-icon').innerText = '✓';
        } else {
            msgElement.classList.add('error');
            msgElement.querySelector('.text').innerText = errorText;
            msgElement.querySelector('.msg-icon').innerText = '!';
        }
    }
}
