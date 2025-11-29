import React, { useState } from 'react';
import { Sparkles, Utensils, Search, Loader2 } from 'lucide-react';
import { getToppingSuggestions } from '../services/geminiService';

interface ToppingStationProps {
  onComplete: (topping: string) => void;
}

export const ToppingStation: React.FC<ToppingStationProps> = ({ onComplete }) => {
  const [preference, setPreference] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchSuggestions = async () => {
    if (!preference.trim()) return;
    
    setLoading(true);
    setError(false);
    try {
      const results = await getToppingSuggestions(preference);
      setSuggestions(results);
    } catch (e) {
      setError(true);
      setSuggestions(["Jam", "Butter", "Cheese"]); // Fallbacks
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPick = (val: string) => {
    setPreference(val);
    // Trigger fetch immediately with this value
    setLoading(true);
    getToppingSuggestions(val).then(res => {
        setSuggestions(res);
        setLoading(false);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in fade-in duration-500 w-full max-w-sm mx-auto">
      <h2 className="text-3xl font-bold text-amber-800">Top It Off!</h2>
      <p className="text-amber-600 text-center">What are you craving today?</p>

      {/* Input Section */}
      <div className="w-full space-y-3">
        <div className="flex gap-2">
            <input
            type="text"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            placeholder="e.g. Sweet, Spicy, Savory..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none bg-white shadow-sm"
            onKeyDown={(e) => e.key === 'Enter' && fetchSuggestions()}
            />
            <button
            onClick={fetchSuggestions}
            disabled={loading || !preference}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white p-3 rounded-xl shadow-md transition-colors"
            >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={24} />}
            </button>
        </div>

        {suggestions.length === 0 && !loading && (
            <div className="flex gap-2 justify-center">
                <button onClick={() => handleQuickPick("Sweet")} className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors">Sweet</button>
                <button onClick={() => handleQuickPick("Savory")} className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors">Savory</button>
                <button onClick={() => handleQuickPick("Surprise me")} className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full hover:bg-amber-200 transition-colors">Surprise Me</button>
            </div>
        )}
      </div>

      {/* Suggestions Area */}
      <div className="w-full min-h-[180px] flex flex-col items-center justify-center">
        {loading ? (
            <div className="text-amber-400 flex flex-col items-center gap-2">
                <Sparkles className="animate-pulse w-8 h-8" />
                <span className="text-sm font-medium">Chef is thinking...</span>
            </div>
        ) : suggestions.length > 0 ? (
            <div className="flex flex-col gap-3 w-full animate-in slide-in-from-bottom-4 duration-500">
                {suggestions.map((item, idx) => (
                    <button
                        key={idx}
                        onClick={() => onComplete(item)}
                        className="group flex items-center justify-between w-full p-4 bg-white border-2 border-amber-100 hover:border-amber-400 hover:bg-amber-50 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                        <span className="font-bold text-gray-700">{item}</span>
                        <Utensils size={18} className="text-amber-300 group-hover:text-amber-500" />
                    </button>
                ))}
            </div>
        ) : (
            <div className="text-gray-400 italic text-sm text-center">
                Enter a preference above to get AI-generated topping ideas.
            </div>
        )}
      </div>
    </div>
  );
};