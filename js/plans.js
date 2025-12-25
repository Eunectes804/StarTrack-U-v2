/**
 * Plans 核心逻辑对象
 * 模块化管理日程表、侧边栏和任务生成
 */
const Plans = {
    currentViewStart: null,

    // --- 1. 初始化 (Init) ---
    init() {
        this.currentViewStart = this.Utils.getMonday(new Date());
        this.UI.init();
        this.Schedule.init();
        
        // 暴露给全局调用
        window.toggleSidebar = this.UI.toggleSidebar;
        window.goToToday = () => this.UI.goToToday();
        window.generateTask = () => this.Tasks.generate();
    },

    // --- 2. UI 模块 (UI) ---
    UI: {
        init() {
            this.renderSidebar();
        },

        toggleSidebar() {
            document.querySelector('.main-container').classList.toggle('sidebar-hidden');
        },

        goToToday() {
            Plans.currentViewStart = Plans.Utils.getMonday(new Date());
            this.renderSidebar();
            Plans.Schedule.render();
        },

        renderSidebar() {
            const list = document.getElementById('planList');
            list.innerHTML = '';
            
            for (let i = -4; i <= 4; i++) {
                const weekStart = Plans.Utils.addDays(Plans.currentViewStart, i * 7);
                const isSelected = i === 0;
                const isCurrentWeek = Plans.Utils.getMonday(new Date()).getTime() === weekStart.getTime();
                
                const startStr = DB.getLocalDateStr(weekStart);
                const endStr = DB.getLocalDateStr(Plans.Utils.addDays(weekStart, 6));
                const tasks = DB.getTasksByDateRange(startStr, endStr);
                
                let statusClass = '';
                if (tasks.length > 0) {
                    statusClass = tasks.every(t => t.status === 'done') ? 'all-done' : 'has-tasks';
                }

                const li = document.createElement('li');
                li.className = `plan-item ${isSelected ? 'selected' : ''} ${statusClass}`;
                
                const month = weekStart.getMonth() + 1;
                const weekNum = Math.ceil(weekStart.getDate() / 7); 
                let label = `${month}月 第${weekNum}周${isCurrentWeek ? " (本周)" : ""}`;

                li.innerHTML = `${label} <div class="status-dot"></div>`;
                li.onclick = () => {
                    Plans.currentViewStart = weekStart;
                    this.renderSidebar();
                    Plans.Schedule.render();
                };
                list.appendChild(li);
            }
        }
    },

    // --- 2. 日程表模块 ---
    Schedule: {
        init() {
            this.render();
        },

        render() {
            this.renderHeader();
            this.renderBody();
            this.renderTasks();
        },

        renderHeader() {
            for (let i = 0; i < 7; i++) {
                // 创建日期元素
                const dayDate = Plans.Utils.addDays(Plans.currentViewStart, i);
                const th = document.getElementById(`th-${i+1}`);
                const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
                th.innerHTML = `${weekDays[i]} <span style="font-weight:400; font-size:10px; margin-left:4px; opacity:0.7;">${Plans.Utils.formatDate(dayDate)}</span>`;
                
                // 高亮显示今天
                const isToday = dayDate.toDateString() === new Date().toDateString();
                th.style.color = isToday ? "var(--accent)" : "";
                th.style.borderBottomColor = isToday ? "var(--accent)" : "";
            }
        },

        renderBody() {
            const tbody = document.getElementById('scheduleBody');
            tbody.innerHTML = '';
            for(let r=0; r<4; r++) {
                const tr = document.createElement('tr');
                for(let c=1; c<=7; c++) {
                    const td = document.createElement('td');
                    td.setAttribute('data-day', c);
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }
        },

        renderTasks() {
            const startStr = DB.getLocalDateStr(Plans.currentViewStart);
            const endStr = DB.getLocalDateStr(Plans.Utils.addDays(Plans.currentViewStart, 6));
            const tasks = DB.getTasksByDateRange(startStr, endStr);

            tasks.forEach(task => {
                const [y, m, d] = task.date.split('-').map(Number);
                const localTaskDate = new Date(y, m-1, d);
                let dayIndex = localTaskDate.getDay() || 7;

                this.createTaskElement(task, dayIndex);
            });
        },

        createTaskElement(task, dayIndex) {
            const taskDiv = document.createElement('div');
            taskDiv.className = `task-block ${task.status === 'done' ? 'done' : ''}`;
            taskDiv.setAttribute('data-priority', task.priority);
            
            const timeStr = task.timeSpent > 0 ? Math.round(task.timeSpent/60) + 'm' : '';
            taskDiv.innerHTML = `${timeStr ? `<span style="opacity:0.6; font-size:10px; float:right;">${timeStr}</span>` : ''}${task.title}`;
            
            taskDiv.onclick = (e) => {
                e.stopPropagation();
                alert("请前往仪表盘 (Dashboard) 使用专注计时器来完成此任务。");
            };

            taskDiv.oncontextmenu = (e) => {
                e.preventDefault();
                if(confirm(`删除任务 "${task.title}"?`)) {
                    DB.deleteTask(task.id);
                    this.render();
                }
            };

            const rows = document.querySelectorAll('#scheduleBody tr');
            for (let i = 0; i < rows.length; i++) {
                const cell = rows[i].querySelector(`td[data-day="${dayIndex}"]`);
                if (cell && cell.childElementCount <= 2) {
                    cell.appendChild(taskDiv);
                    return;
                }
            }
            if (rows.length > 0) {
                alert('今天的任务已满！');
            }
        }
    },

    // --- 3. 任务生成模块 ---
    Tasks: {
        generate() {
            const input = document.getElementById('taskInput');
            const text = input.value.trim();
            if (!text) return;

            const priority = document.getElementById('prioritySelect').value;
            const dayOffset = parseInt(document.getElementById('daySelect').value);
            
            const targetDate = Plans.Utils.addDays(Plans.currentViewStart, dayOffset - 1);
            const dateStr = DB.getLocalDateStr(targetDate);

            DB.addTask(text, priority, dateStr);
            input.value = '';
            Plans.Schedule.render();
        }
    },

    // --- 4. 工具函数 ---
    Utils: {
        getMonday(d) {
            d = new Date(d);
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            const monday = new Date(d.setDate(diff));
            monday.setHours(0, 0, 0, 0);
            return monday;
        },

        addDays(date, days) {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        },

        formatDate(date) {
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }
    }
};

// --- 启动 ---
window.addEventListener('DOMContentLoaded', () => Plans.init());