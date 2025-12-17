// Weather API integration using Open-Meteo (free, no API key required)
export const WeatherAPI = {
    // Get current weather conditions based on geolocation
    async getCurrentWeather() {
        try {
            // Get user's current position
            const position = await this.getCurrentPosition();
            const { latitude, longitude } = position.coords;
            
            // Fetch weather data from Open-Meteo API
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&elevation=true&hourly=temperature_2m,surface_pressure&timezone=auto&forecast_days=1`
            );
            
            if (!response.ok) {
                throw new Error('Weather API request failed');
            }
            
            const data = await response.json();
            
            return {
                temp: Math.round(data.current_weather.temperature * 9/5 + 32), // Convert C to F
                pressure: (data.hourly.surface_pressure[0] * 0.02953).toFixed(2), // Convert hPa to inHg
                altitude: Math.round(data.elevation * 3.28084), // Convert m to ft
                location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
            };
        } catch (error) {
            console.warn('Weather fetch failed, using defaults:', error);
            return this.getDefaultWeather();
        }
    },
    
    // Get user's current position using geolocation API
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000 // Cache for 5 minutes
            });
        });
    },
    
    // Default weather conditions (standard atmospheric conditions)
    getDefaultWeather() {
        return {
            temp: 59, // °F (standard temp)
            pressure: 29.92, // inHg (standard pressure)
            altitude: 0, // ft (sea level)
            location: 'Default'
        };
    }
};