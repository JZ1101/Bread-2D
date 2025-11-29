import React, { useMemo } from 'react';
import { GameStats, ChefFeedback } from '../types';
import { RefreshCw, Star } from 'lucide-react';

interface ResultScreenProps {
  stats: GameStats;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ stats, onRestart }) => {
  
  const feedback: ChefFeedback = useMemo(() => {
    // Scoring weights
    // Slice: 10% (It's easy)
    // Toast: 60% (Hardest part)
    // Butter: 30% (Tedious part)
    
    const sliceScore = stats.sliceQuality;
    
    // Toast logic: 50 is perfect. 
    // If < 30 (Raw) or > 70 (Burnt), score drops heavily.
    const dist = Math.abs(stats.toastLevel - 50);
    // 0 dist = 100 score. 50 dist = 0 score.
    const toastScore = Math.max(0, 100 - (dist * 2)); 

    const butterScore = stats.butterCoverage; // 0-100

    const weightedScore = (sliceScore * 0.1) + (toastScore * 0.6) + (butterScore * 0.3);
    const finalScore = Math.max(1, Math.round(weightedScore / 10)); // 1-10

    let comment = "";

    // Priority checks for specific failures
    if (stats.toastLevel < 30) {
        comment = "IT'S RAW! Did you slice the bread and forget to turn on the toaster?";
    } else if (stats.toastLevel > 80) {
        comment = "You've cremated it! I asked for toast, not a charcoal briquette!";
    } else if (stats.butterCoverage < 20) {
        comment = "It's dryer than the Sahara desert! Use more butter!";
    } else {
        // General score based comments
        if (finalScore === 10) comment = "Perfection. Crisp, golden, and buttery. You are a true Toast Master.";
        else if (finalScore >= 9) comment = "Chef's Kiss! Absolutely delicious.";
        else if (finalScore >= 7) comment = "Not bad. A respectable breakfast.";
        else if (finalScore >= 5) comment = "It's edible. Just about.";
        else if (finalScore >= 3) comment = "My dog wouldn't eat this.";
        else comment = "Get out of my kitchen.";
    }

    return {
        score: finalScore,
        comment
    };
  }, [stats]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto p-6 space-y-6 text-center animate-in zoom-in duration-500">
      
      <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-amber-100 w-full transform rotate-1 hover:rotate-0 transition-transform duration-300">
          <h2 className="text-3xl font-black text-amber-800 mb-2">VERDICT</h2>
          
          <div className="flex justify-center items-center gap-2 mb-6">
              {Array.from({ length: 10 }).map((_, i) => (
                  <Star 
                      key={i} 
                      size={24} 
                      className={`${i < feedback.score ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'}`} 
                  />
              ))}
          </div>
          
          <p className="text-4xl font-bold text-gray-800 mb-6">{feedback.score}/10</p>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p className="italic text-gray-700 text-lg font-medium">"{feedback.comment}"</p>
          </div>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full text-sm">
          <div className="bg-white p-2 rounded shadow border border-gray-100">
              <p className="text-gray-500">Cut</p>
              <p className="font-bold text-gray-800">{stats.sliceQuality}%</p>
          </div>
          <div className="bg-white p-2 rounded shadow border border-gray-100">
              <p className="text-gray-500">Cook</p>
              <p className="font-bold text-gray-800">{stats.toastLevel}%</p>
          </div>
            <div className="bg-white p-2 rounded shadow border border-gray-100">
              <p className="text-gray-500">Butter</p>
              <p className="font-bold text-gray-800">{stats.butterCoverage}%</p>
          </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-8 flex items-center gap-2 px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <RefreshCw size={20} /> Cook Again
      </button>
    </div>
  );
};