import { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import NewStageView from './components/NewStageView';
import StagesView from './components/StagesView';
import QuickLookupView from './components/QuickLookupView';
import SettingsView from './components/SettingsView';
import NavButton from './components/NavButton';
import { Storage } from './utils/storage';
import { WeatherAPI } from './utils/weather';

function App() {
    const [view, setView] = useState('home');
    const [stages, setStages] = useState([]);
    const [userSettings, setUserSettings] = useState(Storage.getDefaultSettings());
    const [weather, setWeather] = useState(null);

    // Load data from localStorage on mount
    useEffect(() => {
        const savedStages = Storage.loadStages();
        const savedSettings = Storage.loadSettings();
        
        setStages(savedStages);
        setUserSettings(savedSettings);
    }, []);

    // Save stages to localStorage when they change
    useEffect(() => {
        Storage.saveStages(stages);
    }, [stages]);

    // Save settings to localStorage when they change
    useEffect(() => {
        Storage.saveSettings(userSettings);
    }, [userSettings]);

    // Get location and weather
    const getLocationAndWeather = async () => {
        const weatherData = await WeatherAPI.getCurrentWeather();
        setWeather(weatherData);
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4 shadow-lg">
                <h1 className="text-2xl font-bold">NRL22 Dope Calculator</h1>
                {weather && (
                    <div className="text-sm mt-1 opacity-90">
                        {weather.temp}°F • {weather.pressure}" Hg • {weather.altitude}' elevation
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="p-4 max-w-2xl mx-auto">
                {view === 'home' && (
                    <HomeView 
                        setView={setView} 
                        getLocationAndWeather={getLocationAndWeather} 
                        weather={weather} 
                    />
                )}
                {view === 'newStage' && (
                    <NewStageView 
                        setView={setView} 
                        stages={stages} 
                        setStages={setStages} 
                        userSettings={userSettings} 
                        weather={weather} 
                    />
                )}
                {view === 'stages' && (
                    <StagesView 
                        setView={setView} 
                        stages={stages} 
                        setStages={setStages} 
                        userSettings={userSettings} 
                        weather={weather} 
                    />
                )}
                {view === 'quickLookup' && (
                    <QuickLookupView 
                        setView={setView} 
                        userSettings={userSettings} 
                        weather={weather} 
                    />
                )}
                {view === 'settings' && (
                    <SettingsView 
                        setView={setView} 
                        userSettings={userSettings} 
                        setUserSettings={setUserSettings} 
                    />
                )}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2">
                <NavButton 
                    icon="🏠" 
                    label="Home" 
                    onClick={() => setView('home')} 
                    active={view === 'home'} 
                />
                <NavButton 
                    icon="📊" 
                    label="Stages" 
                    onClick={() => setView('stages')} 
                    active={view === 'stages'} 
                />
                <NavButton 
                    icon="🎯" 
                    label="Quick" 
                    onClick={() => setView('quickLookup')} 
                    active={view === 'quickLookup'} 
                />
                <NavButton 
                    icon="⚙️" 
                    label="Settings" 
                    onClick={() => setView('settings')} 
                    active={view === 'settings'} 
                />
            </nav>
        </div>
    );
}

export default App;