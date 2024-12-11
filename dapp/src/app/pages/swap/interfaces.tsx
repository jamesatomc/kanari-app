import { X } from "lucide-react";
import { useState } from "react";

// Add new interfaces
interface SwapSettings {
    slippage: number;
    deadline: number;
    fee: number;
  }
  
  // Add to component state
  const [settings, setSettings] = useState<SwapSettings>({
    slippage: 0.5,
    deadline: 20,
    fee: 0.3
  });
  const [showSettings, setShowSettings] = useState(false);
  
  // Add Settings Modal component
  const SettingsModal = ({ settings, onSave, onClose }: {
    settings: SwapSettings;
    onSave: (settings: SwapSettings) => void;
    onClose: () => void;
  }) => {
    const [localSettings, setLocalSettings] = useState(settings);
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full mx-4 border border-orange-500/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Settings</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-orange-500">
              <X className="h-6 w-6" />
            </button>
          </div>
  
          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-300">Slippage Tolerance (%)</label>
              <input
                type="number"
                value={localSettings.slippage}
                onChange={(e) => setLocalSettings({ ...localSettings, slippage: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 mt-1 bg-white/5 border border-orange-500/20 rounded-xl text-white"
                step="0.1"
              />
            </div>
  
            <div>
              <label className="text-sm text-gray-300">Transaction Deadline (minutes)</label>
              <input
                type="number"
                value={localSettings.deadline}
                onChange={(e) => setLocalSettings({ ...localSettings, deadline: parseInt(e.target.value) })}
                className="w-full px-4 py-2 mt-1 bg-white/5 border border-orange-500/20 rounded-xl text-white"
              />
            </div>
  
            <div>
              <label className="text-sm text-gray-300">Fee (%)</label>
              <div className="text-white font-medium mt-1">{settings.fee}%</div>
            </div>
  
            <button
              onClick={() => {
                onSave(localSettings);
                onClose();
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 
                hover:from-orange-600 hover:to-orange-700 text-white font-medium
                py-2 rounded-xl transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };