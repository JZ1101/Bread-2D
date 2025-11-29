import React, { useState } from 'react';
import { Scissors, CheckCircle } from 'lucide-react';

interface CuttingBoardProps {
  onComplete: (score: number) => void;
}

export const CuttingBoard: React.FC<CuttingBoardProps> = ({ onComplete }) => {
  const [cuts, setCuts] = useState(0);
  const idealCuts = 10;
  
  const handleCut = () => {
    setCuts(prev => prev + 1);
  };

  const finishCutting = () => {
    // Score based on distance from ideal cuts
    // Ideal is 10. 
    // 0 cuts = 0 score.
    // 10 cuts = 100 score.
    // 20 cuts = 0 score.
    const diff = Math.abs(cuts - idealCuts);
    // Lose 15 points per deviation
    let score = Math.max(0, 100 - (diff * 15));
    
    // Explicit 0 if no effort made
    if (cuts === 0) score = 0;

    onComplete(score);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-amber-800">Slice the Bread!</h2>
      <p className="text-amber-600">Aim for about {idealCuts} perfect slices.</p>
      
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Bread Loaf */}
        <div 
          className="relative w-48 h-32 bg-amber-200 border-4 border-amber-700 rounded-t-full rounded-b-lg shadow-xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
          onClick={handleCut}
        >
           {/* Visual slices appearing */}
           <div className="absolute inset-0 flex justify-evenly">
             {Array.from({ length: cuts }).map((_, i) => (
               <div key={i} className="h-full w-0.5 bg-amber-900/40 shadow-sm" />
             ))}
           </div>
           
           {/* Messy bread visual if too many cuts */}
           {cuts > 15 && (
             <div className="absolute inset-0 bg-amber-900/10 flex items-center justify-center">
               <span className="font-bold text-amber-900 rotate-12 opacity-50">CRUMBS!</span>
             </div>
           )}
        </div>

        {/* Knife Button */}
        <button 
          onClick={handleCut}
          className="absolute -right-8 top-0 p-4 bg-gray-200 rounded-full shadow-lg hover:bg-gray-100 active:translate-y-4 transition-transform duration-75 border-2 border-gray-400 cursor-pointer z-10"
          aria-label="Cut"
        >
          <Scissors className="w-8 h-8 text-gray-700 transform rotate-90" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="text-xl font-bold text-amber-800">
          Slices: {cuts}
        </div>

        <button
          onClick={finishCutting}
          className="flex items-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <CheckCircle size={20} /> Finish Slicing
        </button>
      </div>
    </div>
  );
};