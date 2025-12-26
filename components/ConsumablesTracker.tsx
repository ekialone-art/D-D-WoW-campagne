import React from 'react';
import { Consumables } from '../types';
import { ArrowUp, Disc, TestTube, Crosshair, Minus, Plus } from 'lucide-react';

interface ConsumablesTrackerProps {
  consumables: Consumables;
  onChange: (consumables: Consumables) => void;
}

const ConsumablesTracker: React.FC<ConsumablesTrackerProps> = ({ consumables, onChange }) => {
  
  const update = (key: keyof Consumables, delta: number) => {
    onChange({
      ...consumables,
      [key]: Math.max(0, consumables[key] + delta)
    });
  };

  const items = [
    { key: 'arrows', label: 'Flèches (Arc)', icon: ArrowUp, color: 'text-yellow-500' },
    { key: 'bolts', label: 'Carreaux (Arbalète)', icon: Crosshair, color: 'text-orange-500' },
    { key: 'bullets', label: 'Billes (Fronde)', icon: Disc, color: 'text-gray-400' },
    { key: 'potions', label: 'Potions', icon: TestTube, color: 'text-blue-400' },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <div key={item.key} className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <item.icon className={item.color} size={20} />
            <span className="font-semibold text-gray-200">{item.label}</span>
          </div>
          <div className="flex items-center justify-between bg-gray-900 rounded-lg p-2">
            <button 
              onClick={() => update(item.key, -1)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            >
              <Minus size={18} />
            </button>
            <span className="text-xl font-bold font-mono">{consumables[item.key]}</span>
            <button 
               onClick={() => update(item.key, 1)}
               className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConsumablesTracker;