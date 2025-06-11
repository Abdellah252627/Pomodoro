/**
 * Statistics Module
 * Handles tracking and visualization of productivity data
 */

const Statistics = (() => {
    // Private variables
    let sessions = [];
    let currentPeriod = 'daily';
    let sessionsChart = null;
    let tasksChart = null;

    // DOM Elements
    let periodButtons;
    let totalFocusTimeElement;
    let completedTasksCountElement;
    let productivityScoreElement;
    let exportStatsButton;

    /**
     * Initialize the statistics module
     */
    function init() {
        // Get DOM elements
        periodButtons = document.querySelectorAll('.period-btn');
        totalFocusTimeElement = document.getElementById('total-focus-time');
        completedTasksCountElement = document.getElementById('completed-tasks-count');
        productivityScoreElement = document.getElementById('productivity-score');
        exportStatsButton = document.getElementById('export-stats');

        // Set up event listeners
        periodButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentPeriod = button.getAttribute('data-period');
                periodButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                updateCharts();
            });
        });

        exportStatsButton.addEventListener('click', exportStatistics);

        // Load sessions from storage
        loadSessions();

        // Initialize charts
        initCharts();

        // Update statistics display
        updateStatistics();
    }

    /**
     * Load sessions from storage
     */
    function loadSessions() {
        const storedSessions = Storage.getItem('sessions');
        if (storedSessions) {
            sessions = JSON.parse(storedSessions);
        }
    }

    /**
     * Save sessions to storage
     */
    function saveSessions() {
        Storage.setItem('sessions', JSON.stringify(sessions));
    }

    /**
     * Initialize charts
     */
    function initCharts() {
        // Sessions chart
        const sessionsCtx = document.getElementById('sessions-chart').getContext('2d');
        sessionsChart = new Chart(sessionsCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Focus Time (minutes)',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 71, 0.7)',
                    borderColor: 'rgba(255, 99, 71, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Minutes'
                        }
                    }
                }
            }
        });

        // Tasks chart
        const tasksCtx = document.getElementById('tasks-chart').getContext('2d');
        tasksChart = new Chart(tasksCtx, {
            type: 'pie',
            data: {
                labels: ['Completed', 'Active'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.7)',
                        'rgba(255, 152, 0, 0.7)'
                    ],
                    borderColor: [
                        'rgba(76, 175, 80, 1)',
                        'rgba(255, 152, 0, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Initial update
        updateCharts();
    }

    /**
     * Update charts based on current period
     */
    function updateCharts() {
        if (currentPeriod === 'daily') {
            updateDailyCharts();
        } else {
            updateWeeklyCharts();
        }
    }

    /**
     * Update charts with daily data
     */
    function updateDailyCharts() {
        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get sessions for today
        const todaySessions = sessions.filter(session => {
            const sessionDate = new Date(session.timestamp);
            sessionDate.setHours(0, 0, 0, 0);
            return sessionDate.getTime() === today.getTime() && session.type === 'work';
        });

        // Group sessions by hour
        const hourlyData = {};
        for (let i = 0; i < 24; i++) {
            hourlyData[i] = 0;
        }

        todaySessions.forEach(session => {
            const hour = new Date(session.timestamp).getHours();
            hourlyData[hour] += session.duration / 60; // Convert seconds to minutes
        });

        // Update sessions chart
        const labels = Object.keys(hourlyData).map(hour => `${hour}:00`);
        const data = Object.values(hourlyData);

        sessionsChart.data.labels = labels;
        sessionsChart.data.datasets[0].data = data;
        sessionsChart.update();

        // Update tasks chart with today's tasks
        updateTasksChart(today);
    }

    /**
     * Update charts with weekly data
     */
    function updateWeeklyCharts() {
        // Get start of week (Sunday)
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        // Get sessions for this week
        const weekSessions = sessions.filter(session => {
            const sessionDate = new Date(session.timestamp);
            return sessionDate >= startOfWeek && session.type === 'work';
        });

        // Group sessions by day
        const dailyData = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        for (let i = 0; i < 7; i++) {
            dailyData[i] = 0;
        }

        weekSessions.forEach(session => {
            const day = new Date(session.timestamp).getDay();
            dailyData[day] += session.duration / 60; // Convert seconds to minutes
        });

        // Update sessions chart
        const labels = Object.keys(dailyData).map(day => days[day]);
        const data = Object.values(dailyData);

        sessionsChart.data.labels = labels;
        sessionsChart.data.datasets[0].data = data;
        sessionsChart.update();

        // Update tasks chart with this week's tasks
        updateTasksChart(startOfWeek);
    }

    /**
     * Update tasks chart based on date
     * @param {Date} startDate - Start date for filtering tasks
     */
    function updateTasksChart(startDate) {
        // Get tasks from storage
        const storedTasks = Storage.getItem('tasks');
        if (!storedTasks) return;

        const tasks = JSON.parse(storedTasks);

        // Filter tasks by date
        const filteredTasks = tasks.filter(task => {
            if (!task.createdAt) return false;
            const taskDate = new Date(task.createdAt);
            return taskDate >= startDate;
        });

        // Count completed and active tasks
        const completedTasks = filteredTasks.filter(task => task.completed).length;
        const activeTasks = filteredTasks.length - completedTasks;

        // Update tasks chart
        tasksChart.data.datasets[0].data = [completedTasks, activeTasks];
        tasksChart.update();
    }

    /**
     * Update statistics summary
     */
    function updateStatistics() {
        // Calculate total focus time
        const totalFocusSeconds = sessions
            .filter(session => session.type === 'work')
            .reduce((total, session) => total + session.duration, 0);

        const hours = Math.floor(totalFocusSeconds / 3600);
        const minutes = Math.floor((totalFocusSeconds % 3600) / 60);

        // Check if we should use Arabic numerals
        const isArabic = document.documentElement.getAttribute('dir') === 'rtl';

        if (isArabic) {
            const hoursArabic = I18n.toArabicNumerals(hours.toString());
            const minutesArabic = I18n.toArabicNumerals(minutes.toString());
            totalFocusTimeElement.textContent = `${hoursArabic} س ${minutesArabic} د`;
        } else {
            totalFocusTimeElement.textContent = `${hours}h ${minutes}m`;
        }

        // Get tasks from storage
        const storedTasks = Storage.getItem('tasks');
        if (storedTasks) {
            const tasks = JSON.parse(storedTasks);

            // Count completed tasks
            const completedTasks = tasks.filter(task => task.completed).length;
            completedTasksCountElement.textContent = isArabic ?
                I18n.toArabicNumerals(completedTasks.toString()) :
                completedTasks.toString();

            // Calculate productivity score
            const totalTasks = tasks.length;
            const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            if (isArabic) {
                const scoreArabic = I18n.toArabicNumerals(productivityScore.toString());
                productivityScoreElement.textContent = `${scoreArabic}٪`;
            } else {
                productivityScoreElement.textContent = `${productivityScore}%`;
            }
        }
    }

    /**
     * Log a completed session
     * @param {Object} session - Session data
     */
    function logSession(session) {
        sessions.push(session);
        saveSessions();
        updateStatistics();
        updateCharts();
    }

    /**
     * Update task statistics
     * @param {Array} tasks - Array of tasks
     */
    function updateTaskStats(tasks) {
        // Update completed tasks count
        const completedTasks = tasks.filter(task => task.completed).length;
        completedTasksCountElement.textContent = completedTasks;

        // Calculate productivity score
        const totalTasks = tasks.length;
        const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        productivityScoreElement.textContent = `${productivityScore}%`;

        // Update tasks chart
        updateCharts();
    }

    /**
     * Export statistics as CSV
     */
    function exportStatistics() {
        // Prepare sessions data
        const sessionsData = sessions.map(session => ({
            type: session.type,
            duration_minutes: Math.round(session.duration / 60),
            date: new Date(session.timestamp).toLocaleDateString(),
            time: new Date(session.timestamp).toLocaleTimeString()
        }));

        // Export to CSV
        exportToCSV(sessionsData, 'pomodoro_statistics.csv');
    }

    // Public API
    return {
        init,
        logSession,
        updateTaskStats
    };
})();
