import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface ButteringStationProps {
  toastLevel: number;
  onComplete: (score: number) => void;
}

export const ButteringStation: React.FC<ButteringStationProps> = ({ toastLevel, onComplete }) => {
  // Create a 5x5 grid
  const gridSize = 5;
  const totalCells = gridSize * gridSize;
  const [butteredCells, setButteredCells] = useState<boolean[]>(new Array(totalCells).fill(false));

  const handleCellInteract = (index: number) => {
    if (!butteredCells[index]) {
      const newCells = [...butteredCells];
      newCells[index] = true;
      setButteredCells(newCells);
    }
  };

  const finishButtering = () => {
    const butteredCount = butteredCells.filter(Boolean).length;
    const percentage = Math.round((butteredCount / totalCells) * 100);
    onComplete(percentage);
  };

  // Re-use toast color logic for continuity
  const getToastColor = (level: number) => {
     if (level < 50) {
        const p = level / 50;
        return `rgba(${254 - (254-217)*p}, ${243 - (243-119)*p}, ${199 - (199-6)*p}, 1)`;
    } else {
        const p = (level - 50) / 50;
        return `rgba(${217 - (217-69)*p}, ${119 - (119-26)*p}, ${6 - (6-3)*p}, 1)`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in slide-in-from-right duration-500">
      <h2 className="text-3xl font-bold text-amber-800">Butter It!</h2>
      <p className="text-amber-600">Rub the toast to spread butter.</p>

      <div 
        className="relative w-64 h-64 rounded-lg shadow-xl overflow-hidden cursor-crosshair border-4 border-amber-900/10"
        style={{ backgroundColor: getToastColor(toastLevel) }}
      >
        <div className="grid grid-cols-5 grid-rows-5 w-full h-full">
          {butteredCells.map((isButtered, index) => (
            <div
              key={index}
              onMouseEnter={() => handleCellInteract(index)}
              onTouchMove={(e) => {
                 // Simple touch support hack for the grid
                 e.preventDefault(); 
                 handleCellInteract(index);
              }}
              onClick={() => handleCellInteract(index)}
              className={`transition-all duration-300 rounded-sm ${isButtered ? 'bg-yellow-300 scale-110 opacity-90' : 'bg-transparent'}`}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-2">
         <div className="flex justify-between text-sm font-bold text-amber-800">
             <span>Coverage</span>
             <span>{Math.round((butteredCells.filter(Boolean).length / totalCells) * 100)}%</span>
         </div>
         <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
             <div 
                className="h-full bg-yellow-400 transition-all duration-200"
                style={{ width: `${(butteredCells.filter(Boolean).length / totalCells) * 100}%` }}
             ></div>
         </div>
      </div>

      <button
        onClick={finishButtering}
        className="flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <CheckCircle size={20} /> Finish!
      </button>
    </div>
  );
};