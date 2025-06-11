/**
 * Achievements Module
 * Handles user achievements and badges
 */

const Achievements = (() => {
    // Private variables
    let achievements = [];
    
    // Achievement definitions
    const achievementDefinitions = {
        // Focus achievements
        firstPomodoro: {
            id: 'firstPomodoro',
            name: {
                en: 'First Pomodoro',
                ar: 'أول بومودورو'
            },
            description: {
                en: 'Complete your first Pomodoro session',
                ar: 'أكمل أول جلسة بومودورو'
            },
            icon: 'fa-play',
            condition: (stats) => stats.totalSessions >= 1
        },
        focusNovice: {
            id: 'focusNovice',
            name: {
                en: 'Focus Novice',
                ar: 'مبتدئ التركيز'
            },
            description: {
                en: 'Complete 10 Pomodoro sessions',
                ar: 'أكمل 10 جلسات بومودورو'
            },
            icon: 'fa-user-graduate',
            condition: (stats) => stats.totalSessions >= 10
        },
        focusMaster: {
            id: 'focusMaster',
            name: {
                en: 'Focus Master',
                ar: 'سيد التركيز'
            },
            description: {
                en: 'Complete 50 Pomodoro sessions',
                ar: 'أكمل 50 جلسة بومودورو'
            },
            icon: 'fa-crown',
            condition: (stats) => stats.totalSessions >= 50
        },
        
        // Task achievements
        taskMaster: {
            id: 'taskMaster',
            name: {
                en: 'Task Master',
                ar: 'سيد المهام'
            },
            description: {
                en: 'Complete 20 tasks',
                ar: 'أكمل 20 مهمة'
            },
            icon: 'fa-tasks',
            condition: (stats) => stats.completedTasks >= 20
        },
        productivityChampion: {
            id: 'productivityChampion',
            name: {
                en: 'Productivity Champion',
                ar: 'بطل الإنتاجية'
            },
            description: {
                en: 'Achieve 80% productivity score',
                ar: 'حقق نسبة إنتاجية 80%'
            },
            icon: 'fa-trophy',
            condition: (stats) => stats.productivityScore >= 80
        },
        
        // Consistency achievements
        dailyStreak: {
            id: 'dailyStreak',
            name: {
                en: 'Daily Streak',
                ar: 'تتابع يومي'
            },
            description: {
                en: 'Use the app for 5 consecutive days',
                ar: 'استخدم التطبيق لمدة 5 أيام متتالية'
            },
            icon: 'fa-calendar-check',
            condition: (stats) => stats.dailyStreak >= 5
        }
    };
    
    /**
     * Initialize the achievements module
     */
    function init() {
        // Load achievements from storage
        loadAchievements();
        
        // Check for achievements on init
        checkAchievements();
    }
    
    /**
     * Load achievements from storage
     */
    function loadAchievements() {
        const storedAchievements = Storage.getItem('achievements');
        if (storedAchievements) {
            achievements = JSON.parse(storedAchievements);
        }
    }
    
    /**
     * Save achievements to storage
     */
    function saveAchievements() {
        Storage.setItem('achievements', JSON.stringify(achievements));
    }
    
    /**
     * Check for new achievements
     */
    function checkAchievements() {
        // Get current stats
        const stats = getStats();
        
        // Check each achievement
        for (const key in achievementDefinitions) {
            const achievement = achievementDefinitions[key];
            
            // Skip if already achieved
            if (achievements.includes(achievement.id)) continue;
            
            // Check if condition is met
            if (achievement.condition(stats)) {
                // Add achievement
                achievements.push(achievement.id);
                
                // Save achievements
                saveAchievements();
                
                // Show notification
                showAchievementNotification(achievement);
            }
        }
    }
    
    /**
     * Get current stats for achievement checking
     * @returns {Object} - Stats object
     */
    function getStats() {
        const stats = {
            totalSessions: 0,
            completedTasks: 0,
            productivityScore: 0,
            dailyStreak: 0
        };
        
        // Get sessions from storage
        const storedSessions = Storage.getItem('sessions');
        if (storedSessions) {
            const sessions = JSON.parse(storedSessions);
            stats.totalSessions = sessions.filter(session => session.type === 'work').length;
        }
        
        // Get tasks from storage
        const storedTasks = Storage.getItem('tasks');
        if (storedTasks) {
            const tasks = JSON.parse(storedTasks);
            stats.completedTasks = tasks.filter(task => task.completed).length;
            
            // Calculate productivity score
            const totalTasks = tasks.length;
            if (totalTasks > 0) {
                stats.productivityScore = Math.round((stats.completedTasks / totalTasks) * 100);
            }
        }
        
        // Calculate daily streak
        const storedDates = Storage.getItem('usageDates');
        if (storedDates) {
            const dates = JSON.parse(storedDates);
            stats.dailyStreak = calculateStreak(dates);
        }
        
        return stats;
    }
    
    /**
     * Calculate streak from array of dates
     * @param {Array} dates - Array of date strings
     * @returns {number} - Streak count
     */
    function calculateStreak(dates) {
        if (!dates || dates.length === 0) return 0;
        
        // Sort dates in descending order
        const sortedDates = [...dates].sort((a, b) => new Date(b) - new Date(a));
        
        // Check if today is included
        const today = new Date().toISOString().split('T')[0];
        const hasToday = sortedDates.includes(today);
        
        if (!hasToday) return 0;
        
        // Count consecutive days
        let streak = 1;
        let currentDate = new Date(today);
        
        for (let i = 1; i < 100; i++) { // Limit to 100 days to prevent infinite loop
            currentDate.setDate(currentDate.getDate() - 1);
            const dateString = currentDate.toISOString().split('T')[0];
            
            if (sortedDates.includes(dateString)) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    /**
     * Show achievement notification
     * @param {Object} achievement - Achievement object
     */
    function showAchievementNotification(achievement) {
        // Get language-specific name and description
        const language = document.documentElement.getAttribute('dir') === 'rtl' ? 'ar' : 'en';
        const name = achievement.name[language];
        const description = achievement.description[language];
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        
        notification.innerHTML = `
            <div class="achievement-icon">
                <i class="fas ${achievement.icon}"></i>
            </div>
            <div class="achievement-content">
                <div class="achievement-title">${I18n.translate('achievement_unlocked')}: ${name}</div>
                <div class="achievement-description">${description}</div>
            </div>
            <button class="close-notification">&times;</button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Add close button event
        const closeButton = notification.querySelector('.close-notification');
        closeButton.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    /**
     * Log app usage for streak tracking
     */
    function logAppUsage() {
        const today = new Date().toISOString().split('T')[0];
        
        // Get stored dates
        let dates = [];
        const storedDates = Storage.getItem('usageDates');
        if (storedDates) {
            dates = JSON.parse(storedDates);
        }
        
        // Add today if not already included
        if (!dates.includes(today)) {
            dates.push(today);
            Storage.setItem('usageDates', JSON.stringify(dates));
        }
    }
    
    /**
     * Get all achievements with their status
     * @returns {Array} - Array of achievement objects with status
     */
    function getAllAchievements() {
        const result = [];
        
        for (const key in achievementDefinitions) {
            const achievement = achievementDefinitions[key];
            result.push({
                ...achievement,
                achieved: achievements.includes(achievement.id)
            });
        }
        
        return result;
    }
    
    // Public API
    return {
        init,
        checkAchievements,
        logAppUsage,
        getAllAchievements
    };
})();
