/**
 * Dashboard 核心逻辑对象
 * 采用模块化设计，将功能分为 UI、Tasks、Timer、CheckIn 四个部分
 * 便于维护和理解
 */
const Dashboard = {
    // --- 1. 初始化入口 ---
    init() {
        this.UI.init();
        this.Tasks.init();
        this.CheckIn.init();
        this.Timer.init();
        
        // 暴露给父页面调用 (main.html)
        window.toggleSidebar = this.UI.toggleSidebar;
    },

    // --- 2. UI 模块：处理通用界面显示 ---
    UI: {
        init() {
            this.startClock();
            this.updateStats();
        },
        
        toggleSidebar() {
            document.querySelector('main').classList.toggle('sidebar-hidden');
        },

        startClock() {
            const update = () => {
                const now = new Date();
                document.getElementById('clock').innerText = now.toLocaleTimeString('en-GB');
                const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
                document.getElementById('dateDisplay').innerText = now.toLocaleDateString('zh-CN', options);
            };
            setInterval(update, 1000);
            update();
        },

        updateStats() {
            const data = DB.data;
            document.getElementById('streakVal').innerText = data.user.streak + " 天";
            
            const todaySec = DB.getTodaySeconds();
            document.getElementById('todayVal').innerText = (todaySec / 3600).toFixed(1) + "小时";
            
            document.getElementById('groupGoalDisplay').innerText = DB.getGroupGoal() || "暂无目标";
        },

        showCelebration(msg) {
            document.getElementById('celebrationMsg').innerHTML = msg;
            document.getElementById('celebrationOverlay').style.display = 'flex';
        }
    },

    // --- 3. 任务模块：处理任务增删改查 ---
    Tasks: {
        init() {
            this.render();
        },

        render() {
            const list = document.getElementById('taskList');
            list.innerHTML = '';
            
            // 获取今日任务
            const todayStr = DB.getLocalDateStr();
            const tasks = DB.getTasks().filter(t => t.date === todayStr);

            tasks.forEach(task => {
                const item = document.createElement('div');
                item.className = `task-item ${task.status === 'done' ? 'completed' : ''}`;
                
                // 绑定点击事件：完成的任务可撤销，未完成的提示使用计时器
                item.onclick = (e) => {
                    if (e.target.closest('.delete-btn')) return; // 忽略删除按钮点击
                    
                    if (task.status === 'done') {
                        if (confirm("确定要撤销此任务的完成状态吗？")) {
                            DB.updateTaskStatus(task.id, 'todo');
                            this.refreshAll();
                        }
                    } else {
                        alert("请使用专注计时器来完成任务！");
                    }
                };

                const timeStr = Dashboard.Utils.formatTime(task.timeSpent);
                const color = task.timeSpent > 0 ? 'var(--accent-2)' : 'var(--muted)';
                const statusIcon = task.status === 'done' 
                    ? `<div class="dot" style="background:var(--accent); border-color:var(--accent);"></div>`
                    : `<div class="dot"></div>`;

                item.innerHTML = `
                    <div style="display:flex; flex-direction:column; gap:4px; flex:1;">
                        <span class="task-name">${task.title}</span>
                        <span class="task-timer" style="font-size:11px; color:${color}; font-family:monospace;">${timeStr}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div class="delete-btn" onclick="Dashboard.Tasks.delete('${task.id}')" style="color:var(--muted); font-size:12px; padding:4px; cursor:pointer;" title="删除">✕</div>
                        ${statusIcon}
                    </div>`;
                list.appendChild(item);
            });

            this.updateProgress();
            this.updateDropdown();
        },

        add() {
            const input = document.getElementById('taskInput');
            const title = input.value.trim();
            if (title) {
                DB.addTask(title);
                input.value = '';
                this.render();
            }
        },

        delete(id) {
            if (confirm("确定删除此任务吗？")) {
                DB.deleteTask(id);
                this.render();
            }
        },

        // 刷新所有相关 UI
        refreshAll() {
            this.render();
            Dashboard.UI.updateStats();
        },

        updateProgress() {
            const todayStr = DB.getLocalDateStr();
            const tasks = DB.getTasks().filter(t => t.date === todayStr);
            const total = tasks.length;
            const done = tasks.filter(t => t.status === 'done').length;
            const percent = total === 0 ? 0 : Math.round((done / total) * 100);
            
            document.getElementById('progPercent').innerText = percent + '%';
            document.getElementById('ring').style.background = `conic-gradient(var(--accent) ${percent}%, var(--border) ${percent}%)`;
        },

        updateDropdown() {
            const select = document.getElementById('focusTaskSelect');
            const currentVal = select.value;
            
            select.innerHTML = '<option value="">-- 选择要追踪的任务 --</option>';
            DB.getTasks().filter(t => t.status !== 'done').forEach(t => {
                const opt = document.createElement('option');
                opt.value = t.id;
                opt.innerText = t.title;
                select.appendChild(opt);
            });

            if (currentVal) select.value = currentVal;
            this.onSelectChange(); // 确保按钮状态正确
        },

        onSelectChange() {
            const select = document.getElementById('focusTaskSelect');
            const taskId = select.value;
            const btn = document.getElementById('completeTaskBtn');
            
            if (taskId) {
                const task = DB.getTasks().find(t => t.id === taskId);
                if (task) document.getElementById('dailyFocusInput').value = task.title;
                if (btn) btn.style.display = 'inline-block';
            } else {
                if (btn) btn.style.display = 'none';
            }
        },

        completeCurrent() {
            const select = document.getElementById('focusTaskSelect');
            const taskId = select.value;
            if (!taskId) return;

            Dashboard.Timer.stop();
            
            const task = DB.getTasks().find(t => t.id === taskId);
            const timeStr = document.getElementById('timer').innerText;
            
            if (task) {
                DB.updateTaskStatus(taskId, 'done');
                this.refreshAll();
                
                // 检查是否全部完成
                const tasks = DB.getTasks();
                const allDone = tasks.length > 0 && tasks.every(t => t.status === 'done');

                if (allDone) {
                    const totalSec = DB.getTodaySeconds();
                    const h = Math.floor(totalSec / 3600);
                    const m = Math.floor((totalSec % 3600) / 60);
                    Dashboard.UI.showCelebration(`太棒了！今日任务全部完成！<br>今日专注总时长：<strong>${h}小时 ${m}分钟</strong>`);
                } else {
                    Dashboard.UI.showCelebration(`你完成了任务 <strong>${task.title}</strong><br>本次专注时长：${timeStr}`);
                }
            }

            select.value = "";
            this.onSelectChange();
            Dashboard.Timer.reset();
        }
    },

    // --- 4. 计时器模块 ---
    Timer: {
        seconds: 0,
        interval: null,
        isWorkSession: true,
        isCountUp: true,

        init() {
            // 默认状态
        },

        setPreset(mins) {
            this.reset();
            if (mins > 0) {
                this.seconds = mins * 60;
                this.isCountUp = false;
                document.getElementById('timerStatus').innerText = "准备专注";
            } else {
                this.isCountUp = true;
                document.getElementById('timerStatus').innerText = "正序计时";
            }
            this.updateDisplay();
            
            // 更新按钮样式
            document.querySelectorAll('.btn-tag').forEach(btn => btn.classList.remove('active'));
            if (event && event.target) event.target.classList.add('active');
        },

        start() {
            if (this.interval) return;
            
            const startBtn = document.getElementById('startBtn');
            startBtn.innerText = "专注中...";
            
            const statusEl = document.getElementById('timerStatus');
            statusEl.innerText = this.isWorkSession ? "深度工作进行中" : "短暂休息";
            statusEl.style.color = this.isWorkSession ? "var(--accent-2)" : "var(--accent)";

            this.interval = setInterval(() => this.tick(), 1000);
        },

        tick() {
            const selectedTaskId = document.getElementById('focusTaskSelect').value;

            if (this.seconds > 0 || this.isCountUp) {
                this.isCountUp ? this.seconds++ : this.seconds--;
                this.updateDisplay();
                
                // 记录时间
                if (this.isWorkSession) {
                    DB.addTime(selectedTaskId, 1);
                    Dashboard.UI.updateStats();
                    if (selectedTaskId) Dashboard.Tasks.render(); // 更新列表中的时间
                }

                // 倒计时结束
                if (this.seconds === 0 && !this.isCountUp) {
                    this.completeSession();
                }
            }
        },

        stop() {
            clearInterval(this.interval);
            this.interval = null;
            document.getElementById('startBtn').innerText = "继续专注";
        },

        reset() {
            this.stop();
            this.seconds = 0;
            this.isCountUp = true;
            this.updateDisplay();
            
            const startBtn = document.getElementById('startBtn');
            startBtn.innerText = "开始专注";
            
            const statusEl = document.getElementById('timerStatus');
            statusEl.innerText = "深度工作计时器";
            statusEl.style.color = "var(--muted)";
        },

        completeSession() {
            this.stop();
            alert(this.isWorkSession ? "工作会话结束！休息一下。" : "休息结束！回到工作中。");
            this.isWorkSession = !this.isWorkSession;
            this.setPreset(this.isWorkSession ? 25 : 5);
        },

        updateDisplay() {
            document.getElementById('timer').innerText = Dashboard.Utils.formatTime(this.seconds);
        }
    },

    // --- 5. 签到模块 ---
    CheckIn: {
        quotes: [
            "做伟大的工作的唯一方法就是热爱你所做的事情。",
            "相信你能做到，你就已经成功了一半。",
            "不要盯着钟表；做它做的事。继续前行。",
            "成功不是终点，失败也不是致命的：重要的是继续前进的勇气。",
            "你的时间是有限的，所以不要浪费时间活在别人的生活里。",
            "专注于高效，而不是忙碌。"
        ],

        init() {
            const user = DB.data.user;
            if (user.isCheckedIn) {
                this.renderUI(true, user.dailyQuote || "保持专注！");
            } else {
                this.renderUI(false);
            }
        },

        doCheckIn() {
            const quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
            DB.checkIn(quote);
            this.renderUI(true, quote);
        },

        renderUI(isChecked, quoteText = "") {
            const checkInBox = document.getElementById('checkInBox');
            const quoteBox = document.getElementById('dailyQuoteBox');
            
            if (isChecked) {
                checkInBox.style.display = 'none';
                quoteBox.style.display = 'block';
                document.getElementById('dailyQuote').innerText = `"${quoteText}"`;
            } else {
                checkInBox.style.display = 'block';
                quoteBox.style.display = 'none';
            }
        }
    },

    // --- 6. 工具函数 ---
    Utils: {
        formatTime(sec) {
            const h = Math.floor(sec / 3600).toString().padStart(2, '0');
            const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
            const s = (sec % 60).toString().padStart(2, '0');
            return `${h}:${m}:${s}`;
        }
    }
};

// --- 启动应用 ---
window.addEventListener('DOMContentLoaded', () => Dashboard.init());

// --- 暴露全局函数供 HTML onclick 调用 (兼容旧代码) ---
window.addTask = () => Dashboard.Tasks.add();
window.deleteTask = (id) => Dashboard.Tasks.delete(id);
window.setPreset = (mins) => Dashboard.Timer.setPreset(mins);
window.startTimer = () => Dashboard.Timer.start();
window.stopTimer = () => Dashboard.Timer.stop();
window.resetTimer = () => Dashboard.Timer.reset();
window.completeCurrentTask = () => Dashboard.Tasks.completeCurrent();
window.onTaskSelectChange = () => Dashboard.Tasks.onSelectChange();
window.doCheckIn = () => Dashboard.CheckIn.doCheckIn();
// toggleTask 已废弃，但为了防止报错保留空函数
window.toggleTask = () => {};