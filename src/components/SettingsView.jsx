import { useState } from 'react';
import { AMMO_PRESETS } from '../constants/ammoPresets';

function SettingsView({ setView, userSettings, setUserSettings }) {
    const [localSettings, setLocalSettings] = useState(userSettings);

    const handleSave = () => {
        setUserSettings(localSettings);
        alert('Settings saved!');
    };

    const handleAmmoPresetChange = (preset) => {
        setLocalSettings({
            ...localSettings,
            ammo: preset,
            velocity: preset.velocity,
            bc: preset.bc,
            bulletWeight: preset.weight
        });
    };

    return (
        <div>
            <button onClick={() => setView('home')} className="text-blue-600 mb-4">← Back</button>
            
            <div className="card">
                <h2 className="text-xl font-bold mb-4">Settings</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Ammo Preset</label>
                        <select
                            value={localSettings.ammo.name}
                            onChange={(e) => {
                                const preset = AMMO_PRESETS.find(p => p.name === e.target.value);
                                handleAmmoPresetChange(preset);
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {AMMO_PRESETS.map(preset => (
                                <option key={preset.name} value={preset.name}>
                                    {preset.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Velocity (fps)</label>
                        <input
                            type="number"
                            value={localSettings.velocity}
                            onChange={(e) => setLocalSettings({...localSettings, velocity: parseFloat(e.target.value)})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Ballistic Coefficient (BC)</label>
                        <input
                            type="number"
                            step="0.001"
                            value={localSettings.bc}
                            onChange={(e) => setLocalSettings({...localSettings, bc: parseFloat(e.target.value)})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="text-xs text-gray-500 mt-1">G1 BC (typically 0.140-0.170 for .22 LR)</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Bullet Weight (grains)</label>
                        <input
                            type="number"
                            value={localSettings.bulletWeight}
                            onChange={(e) => setLocalSettings({...localSettings, bulletWeight: parseFloat(e.target.value)})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Zero Distance (yards)</label>
                        <input
                            type="number"
                            value={localSettings.zeroDistance}
                            onChange={(e) => setLocalSettings({...localSettings, zeroDistance: parseFloat(e.target.value)})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Sight Height (inches)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={localSettings.sightHeight}
                            onChange={(e) => setLocalSettings({...localSettings, sightHeight: parseFloat(e.target.value)})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="text-xs text-gray-500 mt-1">Height from center of bore to center of scope</div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                    >
                        Save Settings
                    </button>
                </div>
            </div>

            <div className="card">
                <h3 className="font-bold mb-2">About</h3>
                <div className="text-sm text-gray-600 space-y-1">
                    <div>NRL22 Dope Calculator v1.0</div>
                    <div>Ballistic calculations for .22 LR</div>
                    <div className="text-xs mt-2 text-gray-400">
                        Future: Score sharing, wind calculations, match history
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsView;