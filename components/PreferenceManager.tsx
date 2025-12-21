
import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { CHEESE_TYPES, MILK_TYPES, FLAVOR_NOTES } from '../constants';

interface PreferenceManagerProps {
  preferences: UserPreferences;
  onChange: (prefs: UserPreferences) => void;
  compact?: boolean;
}

const PreferenceManager: React.FC<PreferenceManagerProps> = ({ preferences, onChange, compact = false }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Універсальний хендлер для тристадійної кнопки (Neutral -> Liked -> Disliked -> Neutral)
  const toggleSelection = (item: string, fieldLiked: keyof UserPreferences, fieldDisliked: keyof UserPreferences) => {
    const likedList = preferences[fieldLiked] as string[];
    const dislikedList = preferences[fieldDisliked] as string[];

    let newLiked = [...likedList];
    let newDisliked = [...dislikedList];

    if (likedList.includes(item)) {
      // Якщо було "Подобається" -> стає "Виключити"
      newLiked = likedList.filter(i => i !== item);
      newDisliked = [...dislikedList, item];
    } else if (dislikedList.includes(item)) {
      // Якщо було "Виключити" -> стає "Нейтрально"
      newDisliked = dislikedList.filter(i => i !== item);
    } else {
      // Якщо було "Нейтрально" -> стає "Подобається"
      newLiked = [...likedList, item];
    }

    onChange({ ...preferences, [fieldLiked]: newLiked, [fieldDisliked]: newDisliked });
  };

  const getBtnClass = (item: string, likedList: string[], dislikedList: string[]) => {
    if (likedList.includes(item)) return 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.02]';
    if (dislikedList.includes(item)) return 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20';
    return 'bg-stone-50 text-stone-500 border-stone-100 hover:border-amber-200';
  };

  return (
    <div className={`bg-white transition-all duration-700 ${compact ? 'p-8 rounded-[3rem] shadow-2xl border border-amber-50' : 'p-6 rounded-3xl border border-stone-100'} space-y-8`}>
      
      {/* Cheese Types Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">ТИПИ СИРУ</label>
          <div className="flex gap-3 text-[8px] font-bold uppercase">
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> ТАК</span>
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> НІ</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {CHEESE_TYPES.map(t => (
            <button 
              key={t} 
              onClick={() => toggleSelection(t, 'likedTypes', 'dislikedTypes')} 
              className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all duration-300 ${getBtnClass(t, preferences.likedTypes, preferences.dislikedTypes)}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Milk Types Section */}
      <div>
        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 block">ВИД МОЛОКА</label>
        <div className="flex flex-wrap gap-2">
          {MILK_TYPES.map(m => (
            <button 
              key={m} 
              onClick={() => toggleSelection(m, 'preferredMilk', 'dislikedMilk')} 
              className={`px-4 py-2 rounded-xl text-[10px] font-bold border transition-all duration-300 ${getBtnClass(m, preferences.preferredMilk, preferences.dislikedMilk)}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className={`space-y-8 ${compact && !showAdvanced ? 'hidden' : ''}`}>
        {/* Intensity Selector */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">БАЖАНА ІНТЕНСИВНІСТЬ</label>
            <span className="text-amber-600 font-black text-sm">{preferences.preferredIntensity}/5</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(lvl => (
              <button
                key={lvl}
                onClick={() => onChange({ ...preferences, preferredIntensity: lvl })}
                className={`flex-1 py-3 rounded-xl border text-xs font-black transition-all ${
                  preferences.preferredIntensity === lvl 
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md' 
                    : 'bg-stone-50 text-stone-400 border-stone-100'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Price and Aging Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
             <div className="flex justify-between">
                <label className="text-[9px] font-black text-stone-400 uppercase">Мін. витримка</label>
                <span className="text-[9px] font-black text-stone-900">{preferences.minAging}м+</span>
             </div>
             <input type="range" min="0" max="24" step="3" value={preferences.minAging} onChange={(e) => onChange({ ...preferences, minAging: Number(e.target.value) })} className="w-full accent-stone-900" />
          </div>
          <div className="space-y-3">
             <div className="flex justify-between">
                <label className="text-[9px] font-black text-stone-400 uppercase">Макс. ціна (100г)</label>
                <span className="text-[9px] font-black text-stone-900">{preferences.priceRange[1]}₴</span>
             </div>
             <input type="range" min="30" max="500" step="10" value={preferences.priceRange[1]} onChange={(e) => onChange({ ...preferences, priceRange: [0, Number(e.target.value)] })} className="w-full accent-amber-500" />
          </div>
        </div>

        {/* Flavor Notes - Multi State */}
        <div>
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 block">НОТИ ТА СМАКОВИЙ ПРОФІЛЬ</label>
          <div className="bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {FLAVOR_NOTES.map(note => (
                <button
                  key={note}
                  onClick={() => toggleSelection(note, 'favoriteNotes', 'dislikedNotes')}
                  className={`px-3 py-1.5 rounded-lg border text-[9px] font-bold uppercase transition-all duration-300 ${getBtnClass(note, preferences.favoriteNotes, preferences.dislikedNotes)}`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {compact && (
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)} 
          className="w-full text-stone-400 hover:text-amber-600 font-bold text-[9px] uppercase tracking-widest py-3 border-t border-amber-50 transition-all flex items-center justify-center gap-2"
        >
          {showAdvanced ? 'МЕНШЕ НАЛАШТУВАНЬ ↑' : 'ДЕТАЛЬНІ ХАРАКТЕРИСТИКИ ↓'}
        </button>
      )}
    </div>
  );
};

export default PreferenceManager;
