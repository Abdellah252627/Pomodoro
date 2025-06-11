/**
 * Notifications Module
 * Handles browser notifications and sound alerts
 */

const Notifications = (() => {
    // Private variables
    let notificationsEnabled = true;
    let soundsEnabled = true;
    let soundType = 'bell';
    let notificationPermissionGranted = false;
    
    // Sound elements
    let bellSound;
    let digitalSound;
    let gentleSound;
    
    /**
     * Initialize the notifications module
     */
    function init() {
        // Load settings from storage
        loadSettings();
        
        // Check notification permission
        checkNotificationPermission();
        
        // Preload sounds
        preloadSounds();
    }
    
    /**
     * Load notification settings from storage
     */
    function loadSettings() {
        const settings = Storage.getItem('notificationSettings');
        if (settings) {
            const parsedSettings = JSON.parse(settings);
            notificationsEnabled = parsedSettings.enabled !== undefined ? parsedSettings.enabled : true;
            soundsEnabled = parsedSettings.sounds !== undefined ? parsedSettings.sounds : true;
            soundType = parsedSettings.soundType || 'bell';
        }
    }
    
    /**
     * Save notification settings to storage
     */
    function saveSettings() {
        const settings = {
            enabled: notificationsEnabled,
            sounds: soundsEnabled,
            soundType: soundType
        };
        Storage.setItem('notificationSettings', JSON.stringify(settings));
    }
    
    /**
     * Check if notification permission is granted
     */
    function checkNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return;
        }
        
        if (Notification.permission === 'granted') {
            notificationPermissionGranted = true;
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                notificationPermissionGranted = permission === 'granted';
            });
        }
    }
    
    /**
     * Preload sound files
     */
    function preloadSounds() {
        bellSound = new Audio('assets/sounds/bell.mp3');
        digitalSound = new Audio('assets/sounds/digital.mp3');
        gentleSound = new Audio('assets/sounds/gentle.mp3');
        
        // Create sound files if they don't exist
        createSoundFiles();
    }
    
    /**
     * Create sound files using Web Audio API
     * This is a fallback in case the sound files don't exist
     */
    function createSoundFiles() {
        try {
            // Check if the bell sound file exists
            bellSound.onerror = () => {
                console.log('Bell sound file not found, creating using Web Audio API');
                createBellSound();
            };
            
            // Check if the digital sound file exists
            digitalSound.onerror = () => {
                console.log('Digital sound file not found, creating using Web Audio API');
                createDigitalSound();
            };
            
            // Check if the gentle sound file exists
            gentleSound.onerror = () => {
                console.log('Gentle sound file not found, creating using Web Audio API');
                createGentleSound();
            };
        } catch (error) {
            console.error('Error creating sound files:', error);
        }
    }
    
    /**
     * Create bell sound using Web Audio API
     */
    function createBellSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(830, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
    }
    
    /**
     * Create digital sound using Web Audio API
     */
    function createDigitalSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    /**
     * Create gentle sound using Web Audio API
     */
    function createGentleSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime); // F4
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.5); // A4
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 1); // C5
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.4);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.6);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.9);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 1.1);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 1.4);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1.5);
    }
    
    /**
     * Show a browser notification
     * @param {string} title - Notification title
     * @param {string} body - Notification body
     */
    function show(title, body) {
        if (!notificationsEnabled) return;
        
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return;
        }
        
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: 'assets/images/pomodoro-icon.png'
            });
            
            // Auto close after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    show(title, body);
                }
            });
        }
    }
    
    /**
     * Play notification sound
     */
    function playSound() {
        if (!soundsEnabled) return;
        
        try {
            switch (soundType) {
                case 'bell':
                    bellSound.currentTime = 0;
                    bellSound.play().catch(error => {
                        console.error('Error playing bell sound:', error);
                        createBellSound();
                    });
                    break;
                case 'digital':
                    digitalSound.currentTime = 0;
                    digitalSound.play().catch(error => {
                        console.error('Error playing digital sound:', error);
                        createDigitalSound();
                    });
                    break;
                case 'gentle':
                    gentleSound.currentTime = 0;
                    gentleSound.play().catch(error => {
                        console.error('Error playing gentle sound:', error);
                        createGentleSound();
                    });
                    break;
                default:
                    bellSound.currentTime = 0;
                    bellSound.play().catch(error => {
                        console.error('Error playing bell sound:', error);
                        createBellSound();
                    });
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }
    
    /**
     * Update notification settings
     * @param {Object} settings - New notification settings
     */
    function updateSettings(settings) {
        notificationsEnabled = settings.enabled;
        soundsEnabled = settings.sounds;
        soundType = settings.soundType;
        
        saveSettings();
        
        // Request notification permission if enabled
        if (notificationsEnabled && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            checkNotificationPermission();
        }
    }
    
    // Public API
    return {
        init,
        show,
        playSound,
        updateSettings
    };
})();
