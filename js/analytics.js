/**
 * Analytics 核心逻辑对象
 * 模块化管理图表渲染和数据分析
 */
const Analytics = {
    // --- 1. 初始化 (Init) ---
    init() {
        // Chart.js 全局配置
        Chart.defaults.color = '#666';
        Chart.defaults.font.family = 'var(--font-ui)';
        
        this.Charts.init();
        this.Heatmap.render();
        this.Data.updateStats();
    },

    // --- 2. 图表渲染模块 (Charts) ---
    Charts: {
        init() {
            this.renderTrend();
            this.renderRadar();
            this.renderCategory();
        },

        renderTrend() {
            const ctx = document.getElementById('focusTrendChart').getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(182, 255, 59, 0.2)');
            gradient.addColorStop(1, 'rgba(182, 255, 59, 0)');

            const { labels, data } = Analytics.Data.getTrendData();

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '专注时长 (小时)',
                        data: data,
                        borderColor: '#b6ff3b',
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#000',
                        pointBorderColor: '#b6ff3b',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: '#222' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        },

        renderRadar() {
            const ctx = document.getElementById('radarChart').getContext('2d');
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['动态规划', '图论', '数学', '字符串', '几何', '数据结构'],
                    datasets: [{
                        label: '我的能力',
                        data: [65, 80, 75, 90, 60, 85],
                        backgroundColor: 'rgba(80, 167, 255, 0.2)',
                        borderColor: '#50a7ff',
                        pointBackgroundColor: '#50a7ff'
                    }, {
                        label: '团队平均',
                        data: [70, 75, 70, 80, 65, 75],
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: '#666',
                        borderDash: [5, 5],
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { color: '#333' },
                            grid: { color: '#333' },
                            pointLabels: { color: '#888', font: { size: 11 } },
                            ticks: { display: false, backdropColor: 'transparent' }
                        }
                    },
                    plugins: { legend: { labels: { color: '#888' } } }
                }
            });
        },

        renderCategory() {
            const ctx = document.getElementById('categoryChart').getContext('2d');
            const { labels, data } = Analytics.Data.getCategoryData();
            const colors = ['#b6ff3b', '#50a7ff', '#ff4d4d', '#ffa600', '#888'];

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels.length ? labels : ['暂无数据'],
                    datasets: [{
                        data: data.length ? data : [1],
                        backgroundColor: colors.slice(0, labels.length || 1),
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { position: 'right', labels: { color: '#888', boxWidth: 10 } }
                    }
                }
            });
        }
    },

    // --- 2. 热力图模块 ---
    Heatmap: {
        render() {
            const container = document.getElementById('heatmap');
            container.innerHTML = '';
            
            const now = new Date();
            for (let i = 119; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                const dateStr = d.toDateString();
                
                const div = document.createElement('div');
                div.className = 'heat-cell';
                div.title = `${dateStr}`;
                
                const seconds = DB.data.stats.dailyFocus[dateStr] || 0;
                const hours = seconds / 3600;
                
                if (hours > 6) div.style.background = 'var(--accent)';
                else if (hours > 3) div.style.background = 'rgba(182, 255, 59, 0.6)';
                else if (hours > 0) div.style.background = 'rgba(182, 255, 59, 0.3)';
                else div.style.background = 'var(--panel-2)';
                
                container.appendChild(div);
            }
        }
    },

    // --- 3. 数据处理模块 ---
    Data: {
        getTrendData() {
            const labels = [];
            const data = [];
            const today = new Date();
            
            for(let i=6; i>=0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const dateStr = d.toDateString();
                
                const dayName = ['周日','周一','周二','周三','周四','周五','周六'][d.getDay()];
                labels.push(dayName);
                
                const seconds = DB.data.stats.dailyFocus[dateStr] || 0;
                data.push((seconds / 3600).toFixed(1));
            }
            return { labels, data };
        },

        getCategoryData() {
            const tasks = DB.getTasks();
            const counts = {};
            tasks.forEach(t => {
                const cat = t.category || '其他';
                counts[cat] = (counts[cat] || 0) + 1;
            });
            return {
                labels: Object.keys(counts),
                data: Object.values(counts)
            };
        },

        updateStats() {
            const totalHours = (DB.data.user.totalTime / 3600).toFixed(1);
            // 尝试更新第一个统计卡片的值 (总专注时长)
            // 注意：这里假设 HTML 结构未变，第一个 .stat-value 是专注时长
            const statValues = document.querySelectorAll('.stat-value');
            if(statValues.length > 0) {
                // 保留后面的单位 span
                const unit = statValues[0].querySelector('span');
                statValues[0].childNodes[0].nodeValue = totalHours; 
            }
        }
    }
};

// --- 启动 ---
window.addEventListener('DOMContentLoaded', () => Analytics.init());