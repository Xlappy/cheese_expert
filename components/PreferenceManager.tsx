import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { CHEESE_TYPES, MILK_TYPES, FLAVOR_NOTES } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Minus, Plus } from 'lucide-react';

interface PreferenceManagerProps {
  preferences: UserPreferences;
  onChange: (prefs: UserPreferences) => void;
  compact?: boolean;
}

const PreferenceManager: React.FC<PreferenceManagerProps> = ({ preferences, onChange, compact = false }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleSelection = (item: string, fieldLiked: keyof UserPreferences, fieldDisliked: keyof UserPreferences) => {
    const likedList = preferences[fieldLiked] as string[];
    const dislikedList = preferences[fieldDisliked] as string[];

    let newLiked = [...likedList];
    let newDisliked = [...dislikedList];

    if (likedList.includes(item)) {
      newLiked = likedList.filter(i => i !== item);
      newDisliked = [...dislikedList, item];
    } else if (dislikedList.includes(item)) {
      newDisliked = dislikedList.filter(i => i !== item);
    } else {
      newLiked = [...likedList, item];
    }

    onChange({ ...preferences, [fieldLiked]: newLiked, [fieldDisliked]: newDisliked });
  };

  const getBtnClass = (item: string, likedList: string[], dislikedList: string[]) => {
    if (likedList.includes(item)) return 'bg-artisan-accent text-artisan-dark border-artisan-accent font-black';
    if (dislikedList.includes(item)) return 'bg-rose-900/40 text-rose-400 border-rose-900/40';
    return 'bg-white/5 text-white/40 border-white/5 hover:border-artisan-accent/30';
  };

  return (
    <div className="bg-artisan-surface/50 border border-white/5 p-8 rounded-[3rem] space-y-10 paper-texture">
      {/* SECTION: TYPES */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <label className="text-[10px] font-black text-artisan-accent uppercase tracking-[0.3em]">Категорії сортів</label>
        </div>
        <div className="flex flex-wrap gap-2">
          {CHEESE_TYPES.map(t => (
            <button
              key={t}
              onClick={() => toggleSelection(t, 'likedTypes', 'dislikedTypes')}
              className={`px-4 py-2.5 rounded-2xl text-[10px] uppercase font-bold border transition-all duration-300 ${getBtnClass(t, preferences.likedTypes, preferences.dislikedTypes)}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION: MILK */}
      <div>
        <label className="text-[10px] font-black text-artisan-accent uppercase tracking-[0.3em] mb-6 block">Джерело молока</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MILK_TYPES.map(m => (
            <button
              key={m}
              onClick={() => toggleSelection(m, 'preferredMilk', 'dislikedMilk')}
              className={`px-4 py-3 rounded-2xl text-[10px] uppercase font-black border transition-all duration-300 ${getBtnClass(m, preferences.preferredMilk, preferences.dislikedMilk)}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* ADVANCED TOGGLE */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-3 text-white/30 hover:text-artisan-accent transition-colors"
      >
        <div className={`p-2 rounded-xl transition-all ${showAdvanced ? 'bg-artisan-accent text-artisan-dark' : 'bg-white/5'}`}>
          <Settings2 size={16} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{showAdvanced ? 'Приховати критерії' : 'Глибокі налаштування'}</span>
      </button>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-10 pt-4"
          >
            {/* INTENSITY */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Бажана інтенсивність</label>
                <span className="text-artisan-accent font-serif text-lg italic">{preferences.preferredIntensity}/5</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => onChange({ ...preferences, preferredIntensity: lvl })}
                    className={`flex-1 py-4 rounded-2xl border text-xs font-black transition-all ${preferences.preferredIntensity === lvl
                        ? 'bg-artisan-accent text-artisan-dark border-artisan-accent'
                        : 'bg-white/5 text-white/20 border-white/5 hover:bg-white/10'
                      }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* FLAVOR NOTES */}
            <div>
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-6 block">Палітра смакових нот</label>
              <div className="bg-artisan-dark/40 p-6 rounded-[2.5rem] border border-white/5 max-h-48 overflow-y-auto artisan-scroll">
                <div className="flex flex-wrap gap-2">
                  {FLAVOR_NOTES.map(note => (
                    <button
                      key={note}
                      onClick={() => toggleSelection(note, 'favoriteNotes', 'dislikedNotes')}
                      className={`px-3 py-2 rounded-xl border text-[9px] font-black uppercase transition-all duration-300 ${getBtnClass(note, preferences.favoriteNotes, preferences.dislikedNotes)}`}
                    >
                      {note}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PRICE & AGING */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Максимальна витримка</label>
                  <span className="text-[10px] font-black text-artisan-cream">{preferences.minAging} м+</span>
                </div>
                <input
                  type="range" min="0" max="24" step="3"
                  value={preferences.minAging}
                  onChange={(e) => onChange({ ...preferences, minAging: Number(e.target.value) })}
                  className="w-full h-1 bg-white/5 accent-artisan-accent appearance-none rounded-full"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-widest">Бюджетний поріг (100г)</label>
                  <span className="text-[10px] font-black text-artisan-cream">{preferences.priceRange[1]} ₴</span>
                </div>
                <input
                  type="range" min="30" max="800" step="10"
                  value={preferences.priceRange[1]}
                  onChange={(e) => onChange({ ...preferences, priceRange: [0, Number(e.target.value)] })}
                  className="w-full h-1 bg-white/5 accent-artisan-accent appearance-none rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PreferenceManager;
