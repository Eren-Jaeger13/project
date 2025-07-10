// 核心计时变量（保留原有）
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progressBar');
const stageInfo = document.getElementById('stageInfo');
const toggleBtn = document.getElementById('toggleBtn');
const resetBtn = document.getElementById('resetBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeName = document.getElementById('themeName');
const sky = document.querySelector('.sky');
const sun = document.querySelector('.sun');
const plant = document.querySelector('.plant');
const body = document.body;
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const btnText = document.querySelector('.btn-text');
const setTimeBtn = document.getElementById('setTimeBtn');
const customTimeSelector = document.getElementById('customTimeSelector');
const hoursSelect = document.getElementById('hoursSelect');
const minutesSelect = document.getElementById('minutesSelect');
const secondsSelect = document.getElementById('secondsSelect');
const confirmTimeBtn = document.getElementById('confirmTimeBtn');
const testModuleBtn = document.getElementById('testModuleBtn');

// 成就系统相关元素（新增）
const achievementsBtn = document.getElementById('achievementsBtn');
const mainTimerControl = document.getElementById('mainTimerControl');
const achievementsContainer = document.getElementById('achievementsContainer');
const backFromAchievements = document.getElementById('backFromAchievements');

// 背景主题设置（保留原有）
const themes = [
    { id: 'default-theme', name: '默认主题' },
    { id: 'ocean-theme', name: '海洋主题' },
    { id: 'forest-theme', name: '森林主题' },
    { id: 'sunset-theme', name: '落日主题' }
];
let currentThemeIndex = 0;

// 时间设置（保留原有）
let totalSeconds = 25 * 60;
let remainingSeconds = totalSeconds;
let timerInterval;
let isRunning = false;
let accumulatedTime = 0;

// 场景解锁阈值（保留原有）
const STAGE_THRESHOLDS = {
    SUN: 300,
    PLANT_GROWTH: 900,
    FULL_SCENE: 1500
};

// 成就配置（严格对应《成就系统数据库(1).doc》）
const achievementsConfig = [
    { 
        id: 'novice', 
        name: '专注小萌新', 
        description: '成功开启首次专注，时长满3秒钟，迈出专注第一步！',
        requiredSeconds: 3 
    },
    { 
        id: 'skilled', 
        name: '专注小能手', 
        description: '累计专注时长达到1小时，效率小马达已启动～',
        requiredSeconds: 3600  // 1小时 = 3600秒
    },
    { 
        id: 'fanatic', 
        name: '专注发烧友', 
        description: '累计专注时长达到10小时，专注热情持续燃烧！',
        requiredSeconds: 36000  // 10小时 = 36000秒
    },
    { 
        id: 'master', 
        name: '专注大神降临', 
        description: '累计专注时长达到50小时，在专注领域封神啦！',
        requiredSeconds: 180000  // 50小时 = 180000秒
    },
    { 
        id: 'top', 
        name: '专注界顶流', 
        description: '累计专注时长达到100小时，专注王者称霸全场！',
        requiredSeconds: 360000  // 100小时 = 360000秒
    }
];

// 从本地存储加载累计专注时长（新增）
let totalFocusSeconds = localStorage.getItem('totalFocusSeconds') 
    ? parseInt(localStorage.getItem('totalFocusSeconds')) 
    : 0;

// 初始化主题（保留原有）
function initTheme() {
    body.classList.add(themes[currentThemeIndex].id);
    themeName.textContent = `当前主题: ${themes[currentThemeIndex].name}`;
}

// 切换背景主题（保留原有）
function switchTheme() {
    body.classList.remove(themes[currentThemeIndex].id);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    body.classList.add(themes[currentThemeIndex].id);
    themeName.textContent = `当前主题: ${themes[currentThemeIndex].name}`;
}

// 初始化场景（保留原有）
function initScene() {
    sun.style.opacity = '0';
    plant.style.opacity = '0';
    document.querySelectorAll('.plant-leaf').forEach(leaf => {
        leaf.style.opacity = '0';
    });
}

// 更新场景（保留原有）
function updateScene() {
    if (accumulatedTime >= STAGE_THRESHOLDS.SUN) {
        sun.style.opacity = '1';
        stageInfo.textContent = `当前阶段：阳光初现 - 累计专注达15分钟解锁植物生长`;
    }
    
    if (accumulatedTime >= STAGE_THRESHOLDS.PLANT_GROWTH) {
        plant.style.opacity = '1';
        const leaves = document.querySelectorAll('.plant-leaf');
        leaves.forEach(leaf => {
            leaf.style.transform += ' scale(1.5)';
            leaf.style.opacity = '1';
        });
        stageInfo.textContent = `当前阶段：生机萌发 - 累计专注达25分钟解锁完整场景`;
    }
    
    if (accumulatedTime >= STAGE_THRESHOLDS.FULL_SCENE) {
        stageInfo.textContent = `恭喜！已解锁完整场景 - 继续专注将累积到下一阶段`;
    }
}

// 格式化时间（保留原有）
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 更新计时器（保留原有，新增成就累计逻辑）
function updateTimer() {
    remainingSeconds--;
    accumulatedTime++;
    totalFocusSeconds++;  // 累计总专注时长（新增）
    localStorage.setItem('totalFocusSeconds', totalFocusSeconds);  // 持久化存储（新增）
    
    timerDisplay.textContent = formatTime(remainingSeconds);
    const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
    progressBar.style.width = `${progress}%`;
    updateScene();
    checkAchievements();  // 实时检查成就解锁（新增）
    
    if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        toggleBtn.classList.remove('active');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        btnText.textContent = '开始专注';
        resetBtn.disabled = true;
        alert('专注时间结束！恭喜你完成一次深度专注');
    }
}

// 切换计时状态（保留原有）
toggleBtn.addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(updateTimer, 1000);
        toggleBtn.classList.add('active');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        btnText.textContent = '暂停专注';
        resetBtn.disabled = false;
    } else {
        clearInterval(timerInterval);
        isRunning = false;
        toggleBtn.classList.remove('active');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        btnText.textContent = '继续专注';
    }
});

// 重置计时（保留原有）
resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    remainingSeconds = totalSeconds;
    accumulatedTime = 0;
    timerDisplay.textContent = formatTime(remainingSeconds);
    progressBar.style.width = '0%';
    toggleBtn.classList.remove('active');
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    btnText.textContent = '开始专注';
    resetBtn.disabled = true;
    initScene();
    stageInfo.textContent = '当前阶段：初始状态 - 累计专注达5分钟解锁阳光';
});

// 主题切换（保留原有）
themeToggleBtn.addEventListener('click', switchTheme);

// 时间设置（保留原有）
setTimeBtn.addEventListener('click', () => {
    customTimeSelector.style.display = customTimeSelector.style.display === 'none' ? 'flex' : 'none';
});

confirmTimeBtn.addEventListener('click', () => {
    const hours = parseInt(hoursSelect.value);
    const minutes = parseInt(minutesSelect.value);
    const seconds = parseInt(secondsSelect.value);
    totalSeconds = hours * 3600 + minutes * 60 + seconds;
    remainingSeconds = totalSeconds;
    timerDisplay.textContent = formatTime(remainingSeconds);
    progressBar.style.width = '0%';
    accumulatedTime = 0;
    initScene();
    stageInfo.textContent = '当前阶段：初始状态 - 累计专注达5分钟解锁阳光';
    customTimeSelector.style.display = 'none';
});

// 测试模块跳转（保留原有）
testModuleBtn.addEventListener('click', () => {
    window.location.href = '/test/';  // 对应urls.py中配置的test/路由
});

// 成就系统核心逻辑（新增，基于《成就系统数据库(1).doc》）
function checkAchievements() {
    achievementsConfig.forEach(achievement => {
        const achievementElement = document.querySelector(`.achievement-item[data-id="${achievement.id}"]`);
        if (totalFocusSeconds >= achievement.requiredSeconds) {
            achievementElement.classList.add('unlocked');
        } else {
            achievementElement.classList.remove('unlocked');
        }
    });
}

// 成就界面切换（新增）
achievementsBtn.addEventListener('click', () => {
    mainTimerControl.classList.add('hide');
    achievementsContainer.classList.remove('hide');
    checkAchievements();  // 打开时刷新成就状态
});

// 返回主界面（新增）
backFromAchievements.addEventListener('click', () => {
    achievementsContainer.classList.add('hide');
    mainTimerControl.classList.remove('hide');
});

// 初始化（保留原有，新增成就检查）
initTheme();
initScene();
checkAchievements();  // 页面加载时检查成就状态