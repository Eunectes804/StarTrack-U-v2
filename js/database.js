/**
 * Database 核心数据管理对象
 * 负责本地存储 (LocalStorage) 的读写操作
 * 包含用户状态、任务列表、团队信息和统计数据
 */
const DB = {
    // --- 1. 配置与初始化 ---
    KEY: 'starTrack_db_v2',
    data: null,
    defaults: {
        user: { streak: 12, totalTime: 16200, lastVisit: new Date().toDateString(), isCheckedIn: false, dailyQuote: "" },
        tasks: [
            { id: 't1', title: '完成毕业论文初稿', priority: 'p1', status: 'todo', timeSpent: 3600, category: '学术', date: new Date().toISOString().split('T')[0] },
            { id: 't2', title: '复习 LeetCode 算法题', priority: 'p2', status: 'todo', timeSpent: 1800, category: '求职', date: new Date().toISOString().split('T')[0] },
            { id: 't3', title: '整理答辩 PPT 素材', priority: 'p1', status: 'done', timeSpent: 5400, category: '学术', date: new Date().toISOString().split('T')[0] }
        ],
        group: {
            currentGoal: "2025 春季答辩冲刺",
            roadmap: [
                { date: '12-20', title: '项目初版提交', desc: '完成核心功能开发', done: true },
                { date: '12-25', title: 'UI/UX 优化', desc: '提升视觉交互体验', done: false },
                { date: '01-01', title: '最终答辩', desc: '全员准备演示', done: false }
            ]
        },
        stats: { dailyFocus: { [new Date().toDateString()]: 16200 } }
    },

    // --- 2. 基础数据操作 (Load/Save) ---
    getLocalDateStr(d = new Date()) {
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
    },
    load() {
        const json = localStorage.getItem(this.KEY);
        this.data = json ? { ...this.defaults, ...JSON.parse(json) } : JSON.parse(JSON.stringify(this.defaults));
        
        const today = this.getLocalDateStr();
        this.data.tasks.forEach(t => { if(!t.date) t.date = today; });
        
        this.checkNewDay();
        return this.data;
    },
    save() {
        localStorage.setItem(this.KEY, JSON.stringify(this.data));
    },
    checkNewDay() {
        const today = new Date().toDateString();
        if (this.data.user.lastVisit !== today) {
            this.data.user.isCheckedIn = false;
            this.data.user.lastVisit = today;
            this.data.user.streak++;
            if (!this.data.stats.dailyFocus[today]) this.data.stats.dailyFocus[today] = 0;
            this.save();
        }
    },

    // --- 3. 任务管理 (CRUD) ---
    getTasks() { return this.data.tasks; },

    getTasksByDateRange(startStr, endStr) {
        return this.data.tasks.filter(t => t.date >= startStr && t.date <= endStr);
    },

    addTask(title, priority = 'p2', dateStr = null) {
        const newTask = {
            id: Date.now().toString(),
            title, priority, status: 'todo', timeSpent: 0, category: '默认',
            date: dateStr || this.getLocalDateStr()
        };
        this.data.tasks.push(newTask);
        this.save();
        return newTask;
    },

    updateTaskStatus(id, status) {
        const task = this.data.tasks.find(t => t.id === id);
        if (task) {
            task.status = status;
            this.save();
        }
    },

    deleteTask(id) {
        this.data.tasks = this.data.tasks.filter(t => t.id !== id);
        this.save();
    },

    // --- 4. 统计与时间追踪 ---
    addTime(taskId, seconds) {
        if (taskId) {
            const task = this.data.tasks.find(t => t.id === taskId);
            if (task) task.timeSpent += seconds;
        }
        const today = new Date().toDateString();
        this.data.stats.dailyFocus[today] = (this.data.stats.dailyFocus[today] || 0) + seconds;
        this.data.user.totalTime += seconds;
        this.save();
    },

    getTodaySeconds() {
        return this.data.stats.dailyFocus[new Date().toDateString()] || 0;
    },

    // --- 5. 用户互动 (签到/目标) ---
    checkIn(quote) {
        this.data.user.isCheckedIn = true;
        this.data.user.dailyQuote = quote;
        this.save();
    },
    
    getGroupGoal() { return this.data.group.currentGoal; },
    
    setGroupGoal(goal) {
        this.data.group.currentGoal = goal;
        this.save();
    }
};

DB.load();
