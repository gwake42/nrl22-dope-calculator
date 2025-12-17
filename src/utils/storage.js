// LocalStorage helpers for persisting app data
export const Storage = {
    // Keys for localStorage
    KEYS: {
        STAGES: 'nrl22_stages',
        SETTINGS: 'nrl22_settings'
    },
    
    // Save stages to localStorage
    saveStages(stages) {
        try {
            localStorage.setItem(this.KEYS.STAGES, JSON.stringify(stages));
        } catch (error) {
            console.error('Failed to save stages:', error);
        }
    },
    
    // Load stages from localStorage
    loadStages() {
        try {
            const stored = localStorage.getItem(this.KEYS.STAGES);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load stages:', error);
            return [];
        }
    },
    
    // Save user settings to localStorage
    saveSettings(settings) {
        try {
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    },
    
    // Load user settings from localStorage
    loadSettings() {
        try {
            const stored = localStorage.getItem(this.KEYS.SETTINGS);
            return stored ? JSON.parse(stored) : this.getDefaultSettings();
        } catch (error) {
            console.error('Failed to load settings:', error);
            return this.getDefaultSettings();
        }
    },
    
    // Default user settings
    getDefaultSettings() {
        return {
            ammo: { name: "Eley Match", velocity: 1080, bc: 0.165, weight: 40 },
            velocity: 1080,
            bc: 0.165,
            bulletWeight: 40,
            zeroDistance: 50,
            sightHeight: 1.5,
            scopeClickValue: 0.1
        };
    }
};