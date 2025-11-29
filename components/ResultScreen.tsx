import React, { useMemo } from 'react';
import { GameStats, ChefFeedback } from '../types';
import { RefreshCw, Star, Info } from 'lucide-react';

interface ResultScreenProps {
  stats: GameStats;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ stats, onRestart }) => {
  
  const result = useMemo(() => {
    // 1. Calculate Raw Component Scores (0-100)
    const sliceScore = stats.sliceQuality;
    
    // Toast logic: Ideal is 50. 
    // 0 dist = 100 score. 50 dist = 0 score.
    const dist = Math.abs(stats.toastLevel - 50);
    const toastScore = Math.max(0, 100 - (dist * 2)); 

    const butterScore = stats.butterCoverage;

    // 2. Define Weights
    // Slicing: 20% | Toasting: 50% | Buttering: 30%
    const wSlice = 0.2;
    const wToast = 0.5;
    const wButter = 0.3;

    // 3. Calculate Weighted Total
    const weightedScore = (sliceScore * wSlice) + (toastScore * wToast) + (butterScore * wButter);
    
    // 4. Determine Final Score (1-10)
    let finalScore = Math.max(1, Math.round(weightedScore / 10));

    // 5. Critical Failures (Cap the max score if major mistakes were made)
    let capReason = "";
    if (stats.toastLevel < 30) {
        finalScore = Math.min(finalScore, 3);
        capReason = "Raw toast capped your score!";
    } else if (stats.toastLevel > 80) {
        finalScore = Math.min(finalScore, 3);
        capReason = "Burnt toast capped your score!";
    }

    let comment = "";
    // Comments based on specific context first, then score
    if (stats.toastLevel < 30) {
        comment = "IT'S RAW! Did you slice the bread and forget to turn on the toaster?";
    } else if (stats.toastLevel > 80) {
        comment = "You've cremated it! I asked for toast, not a charcoal briquette!";
    } else if (stats.butterCoverage < 20) {
        comment = "It's dryer than the Sahara desert! Use more butter!";
    } else {
        if (finalScore === 10) comment = "Perfection. Crisp, golden, and buttery. You are a true Toast Master.";
        else if (finalScore >= 9) comment = "Chef's Kiss! Absolutely delicious.";
        else if (finalScore >= 7) comment = "Not bad. A respectable breakfast.";
        else if (finalScore >= 5) comment = "It's edible. Just about.";
        else if (finalScore >= 3) comment = "My dog wouldn't eat this.";
        else comment = "Get out of my kitchen.";
    }

    return {
        scores: {
            slice: sliceScore,
            toast: toastScore,
            butter: butterScore
        },
        weights: {
            slice: wSlice,
            toast: wToast,
            butter: wButter
        },
        finalScore,
        comment,
        capReason
    };
  }, [stats]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto p-4 space-y-4 animate-in zoom-in duration-500">
      
      <div className="bg-white p-6 rounded-2xl shadow-2xl border-2 border-amber-100 w-full relative overflow-hidden">
          {result.capReason && (
              <div className="absolute top-0 left-0 w-full bg-red-100 text-red-800 text-xs font-bold py-1 px-4 text-center">
                  ⚠️ {result.capReason}
              </div>
          )}

          <h2 className="text-2xl font-black text-amber-800 mb-1 mt-4 text-center">VERDICT</h2>
          
          <div className="flex justify-center items-center gap-1 mb-4">
              {Array.from({ length: 10 }).map((_, i) => (
                  <Star 
                      key={i} 
                      size={20} 
                      className={`${i < result.finalScore ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'}`} 
                  />
              ))}
          </div>
          
          <p className="text-5xl font-black text-center text-gray-800 mb-4">{result.finalScore}<span className="text-2xl text-gray-400">/10</span></p>
          
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-4 text-center">
              <p className="italic text-gray-700 text-md font-medium">"{result.comment}"</p>
          </div>

          {/* Breakdown Table */}
          <div className="text-sm bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-100">
              <div className="flex justify-between items-center text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200 pb-1">
                  <span>Task</span>
                  <span>Score × Weight</span>
              </div>
              
              <div className="flex justify-between items-center">
                  <span className="text-gray-700">Slicing</span>
                  <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${result.scores.slice > 80 ? 'bg-green-500' : 'bg-amber-500'}`} style={{width: `${result.scores.slice}%`}}></div>
                      </div>
                      <span className="font-mono text-gray-600 w-16 text-right">{result.scores.slice} × {result.weights.slice * 100}%</span>
                  </div>
              </div>

              <div className="flex justify-between items-center">
                  <span className="text-gray-700">Toasting</span>
                  <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${result.scores.toast > 80 ? 'bg-green-500' : 'bg-amber-500'}`} style={{width: `${result.scores.toast}%`}}></div>
                      </div>
                      <span className="font-mono text-gray-600 w-16 text-right">{result.scores.toast} × {result.weights.toast * 100}%</span>
                  </div>
              </div>

              <div className="flex justify-between items-center">
                  <span className="text-gray-700">Buttering</span>
                  <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${result.scores.butter > 80 ? 'bg-green-500' : 'bg-amber-500'}`} style={{width: `${result.scores.butter}%`}}></div>
                      </div>
                      <span className="font-mono text-gray-600 w-16 text-right">{result.scores.butter} × {result.weights.butter * 100}%</span>
                  </div>
              </div>
          </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-4 flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <RefreshCw size={20} /> Cook Again
      </button>
    </div>
  );
};