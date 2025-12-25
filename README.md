# FC - 专注跟踪器

一个简洁高效的专注时间管理应用，帮助你追踪每日专注时长、任务进度和团队协作。

## 🌟 功能特性

### 📊 核心功能
- **专注计时器**: 支持正计时和倒计时模式，记录每秒专注时间
- **任务管理**: 创建、编辑、删除任务，支持优先级设置
- **每日签到**: 激励机制，记录连续专注天数
- **数据统计**: 可视化图表展示专注趋势、热力图和分类统计

### 👥 团队协作
- **团队目标**: 设置和追踪团队共同目标
- **路线图**: 规划项目里程碑和进度
- **任务发布**: 团队成员间发布和共享任务

### 📱 界面设计
- **响应式设计**: 适配桌面和移动设备
- **深色主题**: 护眼的深色界面设计
- **直观交互**: 拖拽、点击等便捷操作

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **数据存储**: LocalStorage (浏览器本地存储)
- **图表库**: Chart.js (用于统计页面)
- **构建工具**: 无需构建，直接运行

## 🚀 快速开始

### 在线访问
访问 GitHub Pages: [(https://github.com/Eunectes804/StarTrack-U-v2))]


## 📖 使用指南

### 主要页面
- **首页 (index.html)**: 应用入口和导航
- **仪表盘 (dashboard.html)**: 专注计时器和今日任务
- **计划表 (plans.html)**: 周视图任务规划
- **团队 (group.html)**: 团队目标和路线图
- **统计 (analytics.html)**: 数据分析和可视化

### 基本操作
1. **开始专注**: 在仪表盘选择任务，点击"开始专注"
2. **添加任务**: 在任务输入框输入并回车
3. **完成任务**: 专注结束后自动标记完成
4. **查看统计**: 在统计页面查看专注趋势和热力图

## 📁 项目结构

```
FC/
├── index.html          # 应用入口
├── main.html           # 主导航页面
├── dashboard.html      # 仪表盘页面
├── plans.html          # 计划表页面
├── group.html          # 团队页面
├── analytics.html      # 统计页面
├── login.html          # 登录页面
├── signup.html         # 注册页面
├── profile.html        # 个人资料页面
├── css/                # 样式文件
│   ├── index.css
│   ├── dashboard.css
│   └── ...
├── js/                 # JavaScript 逻辑
│   ├── database.js     # 数据管理核心
│   ├── dashboard.js    # 仪表盘逻辑
│   └── ...
└── resources/          # 静态资源
    ├── music/
    └── photo/
```

## 🔧 开发说明

### 代码结构
- **database.js**: 核心数据管理，封装 LocalStorage 操作
- **各页面.js**: 模块化页面逻辑，包含 UI、数据处理等
- **CSS**: 每个页面独立的样式文件

### 数据模型
```javascript
{
  user: {
    streak: 12,           // 连续专注天数
    totalTime: 16200,     // 总专注时长(秒)
    lastVisit: "日期",    // 最后访问日期
    isCheckedIn: false,   // 今日是否签到
    dailyQuote: ""        // 每日名言
  },
  tasks: [/* 任务列表 */],
  group: { /* 团队信息 */ },
  stats: { /* 统计数据 */ }
}
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支: `git checkout -b feature/AmazingFeature`
3. 提交更改: `git commit -m 'Add some AmazingFeature'`
4. 推送分支: `git push origin feature/AmazingFeature`
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- Chart.js - 优秀的图表库
- 所有贡献者和用户

---

**保持专注，成就卓越！** 🚀</content>
<parameter name="filePath">README.md
