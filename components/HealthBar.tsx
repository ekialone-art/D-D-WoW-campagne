import React from 'react';
import { Heart, Minus, Plus } from 'lucide-react';

interface HealthBarProps {
  current: number;
  max: number;
  onChange: (current: number, max: number) => void;
}

const HealthBar: React.FC<HealthBarProps> = ({ current, max, onChange }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  const getColor = () => {
    if (percentage > 66) return 'bg-green-600';
    if (percentage > 33) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Heart className="text-red-500" size={20} /> Points de Vie
        </h3>
        <div className="flex items-center gap-2">
           <input 
            type="number" 
            value={current}
            onChange={(e) => onChange(parseInt(e.target.value) || 0, max)}
            className="w-16 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-center text-white"
          />
          <span className="text-gray-400">/</span>
          <input 
            type="number" 
            value={max}
            onChange={(e) => onChange(current, parseInt(e.target.value) || 1)}
            className="w-16 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-center text-white"
          />
        </div>
      </div>
      
      <div className="w-full bg-gray-900 rounded-full h-6 border border-gray-600 relative overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold shadow-sm">
          {percentage.toFixed(0)}%
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button 
          onClick={() => onChange(Math.max(0, current - 1), max)}
          className="p-2 bg-red-900/50 hover:bg-red-800 rounded-full border border-red-700 transition-colors"
        >
          <Minus size={16} />
        </button>
        <button 
          onClick={() => onChange(Math.min(max, current + 1), max)}
          className="p-2 bg-green-900/50 hover:bg-green-800 rounded-full border border-green-700 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default HealthBar;