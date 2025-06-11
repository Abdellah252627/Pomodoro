/**
 * Internationalization Module
 * Handles language translations for the application
 */

const I18n = (() => {
    // Private variables
    let currentLanguage = 'en';

    // Translations
    const translations = {
        en: {
            // Header
            'app_title': 'Pomodoro Timer',
            'toggle_language': 'Toggle Language',
            'toggle_dark_mode': 'Toggle Dark Mode',
            'help': 'Help',

            // Timer
            'work_session': 'Work Session',
            'short_break': 'Short Break',
            'long_break': 'Long Break',
            'start': 'Start',
            'pause': 'Pause',
            'reset': 'Reset',
            'sessions_completed': 'sessions completed',

            // Tasks
            'tasks': 'Tasks',
            'add_task_placeholder': 'Add a new task...',
            'add': 'Add',
            'all': 'All',
            'active': 'Active',
            'completed': 'Completed',
            'no_tasks': 'No tasks yet. Add your first task!',
            'no_active_tasks': 'No active tasks. Great job!',
            'no_completed_tasks': 'No completed tasks yet.',
            'edit_task': 'Edit Task',
            'task_name': 'Task Name',
            'estimated_pomodoros': 'Estimated Pomodoros',
            'priority': 'Priority',
            'notes': 'Notes',
            'save': 'Save',
            'delete': 'Delete',
            'low': 'Low',
            'medium': 'Medium',
            'high': 'High',

            // Statistics
            'statistics': 'Statistics',
            'daily': 'Daily',
            'weekly': 'Weekly',
            'focus_time_minutes': 'Focus Time (minutes)',
            'completed_tasks': 'Completed Tasks',
            'active_tasks': 'Active Tasks',
            'total_focus_time': 'Total Focus Time',
            'productivity_score': 'Productivity Score',
            'export_data': 'Export Data (CSV)',

            // Settings
            'settings': 'Settings',
            'timer_settings': 'Timer Settings',
            'work_duration': 'Work Duration (minutes)',
            'short_break_duration': 'Short Break Duration (minutes)',
            'long_break_duration': 'Long Break Duration (minutes)',
            'auto_start_breaks': 'Auto-start Breaks',
            'auto_start_pomodoros': 'Auto-start Pomodoros',
            'notification_settings': 'Notification Settings',
            'enable_notifications': 'Enable Browser Notifications',
            'enable_sounds': 'Enable Sound Notifications',
            'notification_sound': 'Notification Sound',
            'bell': 'Bell',
            'digital': 'Digital',
            'gentle': 'Gentle',
            'data_management': 'Data Management',
            'export_all_data': 'Export All Data',
            'import_data': 'Import Data',
            'save_settings': 'Save Settings',
            'reset_to_default': 'Reset to Default',

            // Focus Mode
            'focus_mode': 'Focus Mode',
            'exit_focus_mode': 'Exit Focus Mode',

            // Navigation
            'timer': 'Timer',
            'tasks_nav': 'Tasks',
            'stats': 'Stats',
            'settings_nav': 'Settings',

            // Help Modal
            'pomodoro_guide': 'Pomodoro Technique Guide',
            'pomodoro_description': 'The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.',
            'basic_steps': 'Basic Steps:',
            'step_1': 'Choose a task to work on',
            'step_2': 'Set the timer for 25 minutes (one "Pomodoro")',
            'step_3': 'Work on the task until the timer rings',
            'step_4': 'Take a short break (5 minutes)',
            'step_5': 'After 4 Pomodoros, take a longer break (15-30 minutes)',
            'tips_for_success': 'Tips for Success:',
            'tip_1': 'Break down complex tasks into smaller, actionable items',
            'tip_2': 'If a distraction pops into your head, write it down and come back to it later',
            'tip_3': 'Once a Pomodoro starts, it must ring - if you abandon a Pomodoro, it does not count',
            'tip_4': 'Use the breaks to rest and recharge, not to think about your work',

            // Notifications
            'work_complete': 'Work session complete!',
            'break_complete': 'Break complete!',
            'time_for_break': 'Time for a break.',
            'time_to_focus': 'Time to focus.',
            'achievement_unlocked': 'Achievement Unlocked',

            // Alerts
            'settings_saved': 'Settings saved successfully!',
            'reset_confirm': 'Are you sure you want to reset all settings to default values?',
            'storage_not_available': 'Local storage is not available. Your data will not be saved between sessions.',
            'work_duration_error': 'Work duration must be between 1 and 120 minutes.',
            'short_break_error': 'Short break duration must be between 1 and 30 minutes.',
            'long_break_error': 'Long break duration must be between 1 and 60 minutes.',
            'export_success': 'Data exported successfully!',
            'export_error': 'Error exporting data. Please try again.',
            'import_success': 'Data imported successfully!',
            'import_error': 'Error importing data. Please check the file format and try again.'
        },
        ar: {
            // Header
            'app_title': 'مؤقت بومودورو',
            'toggle_language': 'تغيير اللغة',
            'toggle_dark_mode': 'تبديل الوضع المظلم',
            'help': 'مساعدة',

            // Timer
            'work_session': 'جلسة عمل',
            'short_break': 'استراحة قصيرة',
            'long_break': 'استراحة طويلة',
            'start': 'ابدأ',
            'pause': 'إيقاف مؤقت',
            'reset': 'إعادة ضبط',
            'sessions_completed': 'الجلسات المكتملة',

            // Tasks
            'tasks': 'المهام',
            'add_task_placeholder': 'أضف مهمة جديدة...',
            'add': 'إضافة',
            'all': 'الكل',
            'active': 'نشط',
            'completed': 'مكتمل',
            'no_tasks': 'لا توجد مهام بعد. أضف مهمتك الأولى!',
            'no_active_tasks': 'لا توجد مهام نشطة. عمل رائع!',
            'no_completed_tasks': 'لا توجد مهام مكتملة بعد.',
            'edit_task': 'تعديل المهمة',
            'task_name': 'اسم المهمة',
            'estimated_pomodoros': 'عدد البومودورو المقدر',
            'priority': 'الأولوية',
            'notes': 'ملاحظات',
            'save': 'حفظ',
            'delete': 'حذف',
            'low': 'منخفضة',
            'medium': 'متوسطة',
            'high': 'عالية',

            // Statistics
            'statistics': 'الإحصائيات',
            'daily': 'يومي',
            'weekly': 'أسبوعي',
            'focus_time_minutes': 'وقت التركيز (دقائق)',
            'completed_tasks': 'المهام المكتملة',
            'active_tasks': 'المهام النشطة',
            'total_focus_time': 'إجمالي وقت التركيز',
            'productivity_score': 'مؤشر الإنتاجية',
            'export_data': 'تصدير البيانات (CSV)',

            // Settings
            'settings': 'الإعدادات',
            'timer_settings': 'إعدادات المؤقت',
            'work_duration': 'مدة العمل (دقائق)',
            'short_break_duration': 'مدة الاستراحة القصيرة (دقائق)',
            'long_break_duration': 'مدة الاستراحة الطويلة (دقائق)',
            'auto_start_breaks': 'بدء الاستراحات تلقائيًا',
            'auto_start_pomodoros': 'بدء البومودورو تلقائيًا',
            'notification_settings': 'إعدادات الإشعارات',
            'enable_notifications': 'تمكين إشعارات المتصفح',
            'enable_sounds': 'تمكين إشعارات الصوت',
            'notification_sound': 'صوت الإشعار',
            'bell': 'جرس',
            'digital': 'رقمي',
            'gentle': 'لطيف',
            'data_management': 'إدارة البيانات',
            'export_all_data': 'تصدير جميع البيانات',
            'import_data': 'استيراد البيانات',
            'save_settings': 'حفظ الإعدادات',
            'reset_to_default': 'إعادة التعيين إلى الافتراضي',

            // Focus Mode
            'focus_mode': 'وضع التركيز',
            'exit_focus_mode': 'الخروج من وضع التركيز',

            // Navigation
            'timer': 'المؤقت',
            'tasks_nav': 'المهام',
            'stats': 'الإحصائيات',
            'settings_nav': 'الإعدادات',

            // Help Modal
            'pomodoro_guide': 'دليل تقنية بومودورو',
            'pomodoro_description': 'تقنية بومودورو هي طريقة لإدارة الوقت طورها فرانشيسكو سيريلو في أواخر الثمانينيات.',
            'basic_steps': 'الخطوات الأساسية:',
            'step_1': 'اختر مهمة للعمل عليها',
            'step_2': 'اضبط المؤقت لمدة 25 دقيقة (بومودورو واحد)',
            'step_3': 'اعمل على المهمة حتى يرن المؤقت',
            'step_4': 'خذ استراحة قصيرة (5 دقائق)',
            'step_5': 'بعد 4 بومودورو، خذ استراحة أطول (15-30 دقيقة)',
            'tips_for_success': 'نصائح للنجاح:',
            'tip_1': 'قسم المهام المعقدة إلى عناصر أصغر وقابلة للتنفيذ',
            'tip_2': 'إذا ظهر في ذهنك ما يشتت انتباهك، اكتبه واعد إليه لاحقًا',
            'tip_3': 'بمجرد بدء البومودورو، يجب أن يرن - إذا تخليت عن البومودورو، فإنه لا يحسب',
            'tip_4': 'استخدم فترات الراحة للاسترخاء وإعادة الشحن، وليس للتفكير في عملك',

            // Notifications
            'work_complete': 'اكتملت جلسة العمل!',
            'break_complete': 'انتهت الاستراحة!',
            'time_for_break': 'حان وقت الاستراحة.',
            'time_to_focus': 'حان وقت التركيز.',
            'achievement_unlocked': 'تم فتح الإنجاز',

            // Alerts
            'settings_saved': 'تم حفظ الإعدادات بنجاح!',
            'reset_confirm': 'هل أنت متأكد أنك تريد إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟',
            'storage_not_available': 'التخزين المحلي غير متاح. لن يتم حفظ بياناتك بين الجلسات.',
            'work_duration_error': 'يجب أن تكون مدة العمل بين 1 و 120 دقيقة.',
            'short_break_error': 'يجب أن تكون مدة الاستراحة القصيرة بين 1 و 30 دقيقة.',
            'long_break_error': 'يجب أن تكون مدة الاستراحة الطويلة بين 1 و 60 دقيقة.',
            'export_success': 'تم تصدير البيانات بنجاح!',
            'export_error': 'خطأ في تصدير البيانات. يرجى المحاولة مرة أخرى.',
            'import_success': 'تم استيراد البيانات بنجاح!',
            'import_error': 'خطأ في استيراد البيانات. يرجى التحقق من تنسيق الملف والمحاولة مرة أخرى.'
        }
    };

    /**
     * Initialize the i18n module
     */
    function init() {
        // Load language preference from storage
        const storedLanguage = Storage.getItem('language');
        if (storedLanguage) {
            currentLanguage = storedLanguage;
        }

        // Set initial language
        setLanguage(currentLanguage);
    }

    /**
     * Set the application language
     * @param {string} language - Language code ('en' or 'ar')
     */
    function setLanguage(language) {
        if (translations[language]) {
            currentLanguage = language;
            Storage.setItem('language', language);

            // Update all translatable elements
            updateTranslations();
        }
    }

    /**
     * Get a translation for a key
     * @param {string} key - Translation key
     * @returns {string} - Translated text
     */
    function translate(key) {
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            return translations[currentLanguage][key];
        }

        // Fallback to English
        if (translations.en && translations.en[key]) {
            return translations.en[key];
        }

        // Return the key if no translation found
        return key;
    }

    /**
     * Update all translatable elements in the DOM
     */
    function updateTranslations() {
        // Update document title
        document.title = translate('app_title');

        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = translate(key);
        });

        // Update all input placeholders with data-i18n-placeholder attribute
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = translate(key);
        });

        // Update all button titles with data-i18n-title attribute
        const titles = document.querySelectorAll('[data-i18n-title]');
        titles.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = translate(key);
        });

        // Update all labels
        const labels = document.querySelectorAll('label');
        labels.forEach(label => {
            if (label.textContent) {
                const key = convertToTranslationKey(label.textContent.trim());
                if (translations[currentLanguage] && translations[currentLanguage][key]) {
                    label.textContent = translate(key);
                }
            }
        });

        // Update all buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            // Skip buttons that already have data-i18n attributes
            if (!button.hasAttribute('data-i18n') && button.textContent && button.textContent.trim()) {
                const key = convertToTranslationKey(button.textContent.trim());
                if (translations[currentLanguage] && translations[currentLanguage][key]) {
                    // Preserve any icons inside the button
                    const icon = button.querySelector('i');
                    if (icon) {
                        const iconHTML = icon.outerHTML;
                        button.innerHTML = iconHTML + ' ' + translate(key);
                    } else {
                        button.textContent = translate(key);
                    }
                }
            }
        });

        // Update all headings
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            if (!heading.hasAttribute('data-i18n') && heading.textContent) {
                const key = convertToTranslationKey(heading.textContent.trim());
                if (translations[currentLanguage] && translations[currentLanguage][key]) {
                    heading.textContent = translate(key);
                }
            }
        });

        // Update language indicator
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            const languageIndicator = languageToggle.querySelector('.language-indicator');
            if (languageIndicator) {
                languageIndicator.textContent = currentLanguage === 'ar' ? 'عربي' : 'EN';
            }
        }
    }

    /**
     * Convert a text string to a translation key format
     * @param {string} text - Text to convert
     * @returns {string} - Translation key
     */
    function convertToTranslationKey(text) {
        return text.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_');
    }

    /**
     * Convert Western Arabic numerals (0-9) to Eastern Arabic numerals (٠-٩)
     * @param {string} text - Text containing numbers
     * @returns {string} - Text with Eastern Arabic numerals
     */
    function toArabicNumerals(text) {
        if (!text) return text;

        const numeralsMap = {
            '0': '٠',
            '1': '١',
            '2': '٢',
            '3': '٣',
            '4': '٤',
            '5': '٥',
            '6': '٦',
            '7': '٧',
            '8': '٨',
            '9': '٩'
        };

        return text.toString().replace(/[0-9]/g, match => numeralsMap[match]);
    }

    /**
     * Convert Eastern Arabic numerals (٠-٩) to Western Arabic numerals (0-9)
     * @param {string} text - Text containing Eastern Arabic numerals
     * @returns {string} - Text with Western Arabic numerals
     */
    function fromArabicNumerals(text) {
        if (!text) return text;

        const numeralsMap = {
            '٠': '0',
            '١': '1',
            '٢': '2',
            '٣': '3',
            '٤': '4',
            '٥': '5',
            '٦': '6',
            '٧': '7',
            '٨': '8',
            '٩': '9'
        };

        return text.toString().replace(/[٠-٩]/g, match => numeralsMap[match]);
    }

    // Public API
    return {
        init,
        setLanguage,
        translate,
        toArabicNumerals,
        fromArabicNumerals
    };
})();
