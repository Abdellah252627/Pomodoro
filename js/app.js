/**
 * Main Application JavaScript
 * Handles the initialization and coordination of all app components
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Storage.init();
    I18n.init();
    Timer.init();
    Tasks.init();
    Statistics.init();
    Settings.init();
    Notifications.init();
    Quotes.init();
    Achievements.init();

    // Set up navigation
    setupNavigation();

    // Set up modals
    setupModals();

    // Set up theme toggle
    setupThemeToggle();

    // Set up language toggle
    setupLanguageToggle();

    // Set up focus mode
    setupFocusMode();

    // Log app usage for streak tracking
    Achievements.logAppUsage();
});

/**
 * Sets up the navigation between different sections
 */
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');

            // Update active section
            sections.forEach(section => {
                section.classList.remove('active-section');
                if (section.id === targetSection) {
                    section.classList.add('active-section');
                }
            });

            // Update active nav button
            navButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });
}

/**
 * Sets up modal dialogs
 */
function setupModals() {
    // Help modal
    const helpButton = document.getElementById('help-button');
    const helpModal = document.getElementById('help-modal');
    const closeHelpModal = helpModal.querySelector('.close-modal');

    helpButton.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
    });

    closeHelpModal.addEventListener('click', () => {
        helpModal.classList.add('hidden');
    });

    // Task edit modal
    const taskModal = document.getElementById('task-modal');
    const closeTaskModal = taskModal.querySelector('.close-modal');

    closeTaskModal.addEventListener('click', () => {
        taskModal.classList.add('hidden');
    });

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === helpModal) {
            helpModal.classList.add('hidden');
        }
        if (event.target === taskModal) {
            taskModal.classList.add('hidden');
        }
    });
}

/**
 * Sets up dark mode toggle
 */
function setupThemeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const themeStyle = document.getElementById('theme-style');

    // Check if dark mode is enabled in local storage
    const isDarkMode = Storage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        themeStyle.removeAttribute('disabled');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    darkModeToggle.addEventListener('click', () => {
        if (themeStyle.hasAttribute('disabled')) {
            themeStyle.removeAttribute('disabled');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            Storage.setItem('darkMode', 'true');
        } else {
            themeStyle.setAttribute('disabled', '');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            Storage.setItem('darkMode', 'false');
        }
    });
}

/**
 * Sets up language toggle (English/Arabic)
 */
function setupLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    const rtlStyle = document.getElementById('rtl-style');
    const languageIndicator = languageToggle.querySelector('.language-indicator');

    // Check if language preference is stored
    const storedLanguage = Storage.getItem('language');
    const currentLanguage = storedLanguage || 'en';

    // Set initial language state
    if (currentLanguage === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        rtlStyle.removeAttribute('disabled');
        languageIndicator.textContent = 'عربي';
        Storage.setItem('rtl', 'true');
    } else {
        document.documentElement.removeAttribute('dir');
        rtlStyle.setAttribute('disabled', '');
        languageIndicator.textContent = 'EN';
        Storage.setItem('rtl', 'false');
    }

    // Set up click event
    languageToggle.addEventListener('click', () => {
        const isCurrentlyArabic = document.documentElement.getAttribute('dir') === 'rtl';

        if (isCurrentlyArabic) {
            // Switch to English
            document.documentElement.removeAttribute('dir');
            rtlStyle.setAttribute('disabled', '');
            languageIndicator.textContent = 'EN';
            Storage.setItem('rtl', 'false');
            I18n.setLanguage('en');
        } else {
            // Switch to Arabic
            document.documentElement.setAttribute('dir', 'rtl');
            rtlStyle.removeAttribute('disabled');
            languageIndicator.textContent = 'عربي';
            Storage.setItem('rtl', 'true');
            I18n.setLanguage('ar');
        }

        // Update button title in the new language
        languageToggle.title = I18n.translate('toggle_language');
    });
}

/**
 * Sets up focus mode
 */
function setupFocusMode() {
    const focusModeBtn = document.getElementById('focus-mode-btn');
    const focusModeOverlay = document.getElementById('focus-mode-overlay');
    const exitFocusMode = document.getElementById('exit-focus-mode');
    let quoteRotationInterval = null;

    // Initialize quotes module
    Quotes.init();

    focusModeBtn.addEventListener('click', () => {
        focusModeOverlay.classList.remove('hidden');

        // Update focus mode timer with current timer value
        document.getElementById('focus-mode-timer').textContent = document.getElementById('timer').textContent;
        document.getElementById('focus-mode-session-type').textContent = document.getElementById('session-type').textContent;

        // Sync focus mode timer with main timer
        Timer.syncFocusMode(true);

        // Start quote rotation
        quoteRotationInterval = Quotes.startQuoteRotation();
    });

    exitFocusMode.addEventListener('click', () => {
        focusModeOverlay.classList.add('hidden');
        Timer.syncFocusMode(false);

        // Stop quote rotation
        if (quoteRotationInterval) {
            Quotes.stopQuoteRotation(quoteRotationInterval);
            quoteRotationInterval = null;
        }
    });
}

/**
 * Utility function to format time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Utility function to generate a unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Utility function to format date
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    return date.toLocaleDateString(document.documentElement.getAttribute('dir') === 'rtl' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Utility function to export data as CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file
 */
function exportToCSV(data, filename) {
    if (!data || !data.length) {
        console.error('No data to export');
        return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    let csvContent = headers.join(',') + '\n';

    // Add data rows
    data.forEach(item => {
        const row = headers.map(header => {
            let cell = item[header] || '';
            // Escape commas and quotes
            cell = String(cell).replace(/"/g, '""');
            if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                cell = `"${cell}"`;
            }
            return cell;
        });
        csvContent += row.join(',') + '\n';
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
