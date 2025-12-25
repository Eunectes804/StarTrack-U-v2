/**
 * Group 核心逻辑对象
 * 模块化管理团队信息、任务发布和路线图
 */
const Group = {
    // --- 1. 初始化 (Init) ---
    init() {
        this.UI.init();
        this.Data.init();
        
        // 暴露给全局调用
        window.switchManageMode = this.UI.switchManageMode;
        window.postT = () => this.Actions.postTask();
        window.addRoadmap = () => this.Actions.addRoadmapItem();
    },
    // --- 2. UI 模块 (UI) ---
    UI: {
        init() {
            // 默认显示任务模式
            this.switchManageMode();
        },
        switchManageMode() {
            const mode = document.getElementById('manageSelect').value;
            document.getElementById('mode-task').style.display = mode === 'task' ? 'block' : 'none';
            document.getElementById('mode-roadmap').style.display = mode === 'roadmap' ? 'block' : 'none';
            document.getElementById('mode-info').style.display = mode === 'info' ? 'block' : 'none';
        }
    },

    // --- 3. 数据加载模块 (Data) ---
    Data: {
        init() {
            this.loadGoal();
            this.loadRoadmap();
        },

        loadGoal() {
            const goal = DB.getGroupGoal();
            document.getElementById('currentGoalText').innerText = goal || "暂无目标";
        },

        loadRoadmap() {
            const list = document.getElementById('roadmapList');
            list.innerHTML = '';
            
            const roadmap = DB.data.group.roadmap || [];
            
            roadmap.forEach(item => {
                const div = document.createElement('div');
                div.className = 'tl-item';
                div.innerHTML = `<div class="tl-date">${item.date}</div>
                    <div class="tl-content">
                    <div class="tl-title">${item.title}</div>
                    <div class="tl-desc">${item.desc}</div>
                    </div>`;
                list.appendChild(div);
            });
        }
    },

    // --- 3. 用户操作模块 ---
    Actions: {
        postTask() {
            const input = document.getElementById('taskMsg');
            const val = input.value;
            if(!val) return;
            
            const item = document.createElement('div');
            item.className = 'hist-item';
            item.innerHTML = `<b>新发布</b>：${val}<br><small style="color:#555">刚刚</small>`;
            
            const hist = document.getElementById('hist');
            hist.prepend(item);
            
            input.value = '';
        },

        addRoadmapItem() {
            const dateInput = document.getElementById('roadmapDate');
            const titleInput = document.getElementById('roadmapTitle');
            const descInput = document.getElementById('roadmapDesc');
            const statusSelect = document.getElementById('roadmapStatus');

            const date = dateInput.value.trim();
            const title = titleInput.value.trim();
            const desc = descInput.value.trim();
            const status = statusSelect.value;

            if (!date || !title) {
                alert("请填写日期和标题");
                return;
            }

            // 简单校验日期格式 xx-xx
            if (!/^\d{2}-\d{2}$/.test(date)) {
                alert("日期格式错误，请使用 xx-xx 格式 (如 05-20)");
                return;
            }

            const newItem = {
                date: date,
                title: title,
                desc: desc,
                done: status === 'done'
            };

            if (!DB.data.group.roadmap) {
                DB.data.group.roadmap = [];
            }
            
            DB.data.group.roadmap.push(newItem);
            // 简单的日期排序
            DB.data.group.roadmap.sort((a, b) => a.date.localeCompare(b.date));
            
            DB.save();
            Group.Data.loadRoadmap();

            // 清空输入
            dateInput.value = '';
            titleInput.value = '';
            descInput.value = '';
            alert("里程碑添加成功！");
        }
    }
};

// --- 启动 ---
window.addEventListener('DOMContentLoaded', () => Group.init());