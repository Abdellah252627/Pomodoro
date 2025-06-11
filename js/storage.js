/**
 * Storage Module
 * Handles local storage operations for data persistence
 */

const Storage = (() => {
    // Storage prefix to avoid conflicts with other applications
    const PREFIX = 'pomodoro_';
    
    // Check if localStorage is available
    const isAvailable = (() => {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.error('localStorage is not available:', e);
            return false;
        }
    })();
    
    /**
     * Initialize the storage module
     */
    function init() {
        if (!isAvailable) {
            alert('Local storage is not available. Your data will not be saved between sessions.');
        }
    }
    
    /**
     * Get an item from storage
     * @param {string} key - Storage key
     * @returns {string|null} - Stored value or null if not found
     */
    function getItem(key) {
        if (!isAvailable) return null;
        
        try {
            return localStorage.getItem(PREFIX + key);
        } catch (e) {
            console.error(`Error getting item ${key} from storage:`, e);
            return null;
        }
    }
    
    /**
     * Set an item in storage
     * @param {string} key - Storage key
     * @param {string} value - Value to store
     * @returns {boolean} - Success status
     */
    function setItem(key, value) {
        if (!isAvailable) return false;
        
        try {
            localStorage.setItem(PREFIX + key, value);
            return true;
        } catch (e) {
            console.error(`Error setting item ${key} in storage:`, e);
            
            // If quota exceeded, try to clear old data
            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                clearOldData();
                
                // Try again
                try {
                    localStorage.setItem(PREFIX + key, value);
                    return true;
                } catch (retryError) {
                    console.error(`Failed to set item ${key} after clearing old data:`, retryError);
                    return false;
                }
            }
            
            return false;
        }
    }
    
    /**
     * Remove an item from storage
     * @param {string} key - Storage key
     * @returns {boolean} - Success status
     */
    function removeItem(key) {
        if (!isAvailable) return false;
        
        try {
            localStorage.removeItem(PREFIX + key);
            return true;
        } catch (e) {
            console.error(`Error removing item ${key} from storage:`, e);
            return false;
        }
    }
    
    /**
     * Clear all application data from storage
     * @returns {boolean} - Success status
     */
    function clearAll() {
        if (!isAvailable) return false;
        
        try {
            // Only clear items with our prefix
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key.startsWith(PREFIX)) {
                    localStorage.removeItem(key);
                }
            }
            return true;
        } catch (e) {
            console.error('Error clearing storage:', e);
            return false;
        }
    }
    
    /**
     * Clear old data to free up space
     * Prioritizes keeping essential data like settings and recent sessions
     */
    function clearOldData() {
        if (!isAvailable) return;
        
        try {
            // Get all keys with our prefix
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(PREFIX)) {
                    keys.push(key);
                }
            }
            
            // If we have more than 20 items, remove the oldest sessions
            if (keys.length > 20) {
                // Get sessions
                const sessionsKey = PREFIX + 'sessions';
                const sessionsData = localStorage.getItem(sessionsKey);
                
                if (sessionsData) {
                    try {
                        const sessions = JSON.parse(sessionsData);
                        
                        // Keep only the 50 most recent sessions
                        if (sessions.length > 50) {
                            const sortedSessions = sessions.sort((a, b) => {
                                return new Date(b.timestamp) - new Date(a.timestamp);
                            });
                            
                            const recentSessions = sortedSessions.slice(0, 50);
                            localStorage.setItem(sessionsKey, JSON.stringify(recentSessions));
                        }
                    } catch (parseError) {
                        console.error('Error parsing sessions data:', parseError);
                        // If we can't parse, just remove the sessions data
                        localStorage.removeItem(sessionsKey);
                    }
                }
            }
        } catch (e) {
            console.error('Error clearing old data:', e);
        }
    }
    
    /**
     * Export all application data
     * @returns {Object|null} - Exported data or null if error
     */
    function exportData() {
        if (!isAvailable) return null;
        
        try {
            const data = {};
            
            // Get all items with our prefix
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(PREFIX)) {
                    const shortKey = key.substring(PREFIX.length);
                    data[shortKey] = localStorage.getItem(key);
                }
            }
            
            return data;
        } catch (e) {
            console.error('Error exporting data:', e);
            return null;
        }
    }
    
    /**
     * Import application data
     * @param {Object} data - Data to import
     * @returns {boolean} - Success status
     */
    function importData(data) {
        if (!isAvailable) return false;
        
        try {
            // Clear existing data first
            clearAll();
            
            // Import new data
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    localStorage.setItem(PREFIX + key, data[key]);
                }
            }
            
            return true;
        } catch (e) {
            console.error('Error importing data:', e);
            return false;
        }
    }
    
    // Public API
    return {
        init,
        getItem,
        setItem,
        removeItem,
        clearAll,
        exportData,
        importData
    };
})();
