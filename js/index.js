/**
 * index.js
 * 着陆页 (Landing Page) 逻辑
 * 主要负责粒子背景效果的初始化
 */

// --- 1. 粒子效果配置 ---
function initParticles(isLight) {
    const color = "#ff9a00";
    const linkColor = "#ffffff";
    
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 120, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": color },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.8, "random": true },
            "size": { "value": 4, "random": true },
            "line_linked": { "enable": false },
            "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": true, "mode": "bubble" },
                "onclick": { "enable": true, "mode": "push" },
                "resize": true
            },
            "modes": {
                "bubble": { "distance": 200, "size": 6, "duration": 2, "opacity": 1, "speed": 3 }
            }
        },
        "retina_detect": true
    });
}

// --- 2. 初始化入口 ---
initParticles(false);