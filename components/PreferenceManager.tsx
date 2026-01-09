import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { CHEESE_TYPES, MILK_TYPES, FLAVOR_NOTES } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, Minus, Plus, Sliders } from 'lucide-react';

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
    if (likedList.includes(item)) return 'bg-artisan-accent text-artisan-dark border-artisan-accent shadow-accent scale-105 z-10';
    if (dislikedList.includes(item)) return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-white/[0.03] text-white/30 border-white/[0.05] hover:bg-white/[0.08] hover:text-white/60';
  };

  return (
    <div className="glass-panel p-10 rounded-[4rem] space-y-12 paper-texture shadow-2xl">
      {/* SECTION: TYPES */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-artisan-accent shadow-[0_0_10px_rgba(249,164,53,0.5)]"></div>
          <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">Сирна Сім'я</label>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {CHEESE_TYPES.map(t => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSelection(t, 'likedTypes', 'dislikedTypes')}
              className={`px-5 py-3 rounded-2xl text-[10px] uppercase font-black border transition-all duration-300 ${getBtnClass(t, preferences.likedTypes, preferences.dislikedTypes)}`}
            >
              {t}
            </motion.button>
          ))}
        </div>
      </div>

      {/* SECTION: MILK */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-artisan-accent shadow-[0_0_10px_rgba(249,164,53,0.5)]"></div>
          <label className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">Основний Інгредієнт</label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {MILK_TYPES.map(m => (
            <motion.button
              key={m}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleSelection(m, 'preferredMilk', 'dislikedMilk')}
              className={`px-6 py-4 rounded-2xl text-[10px] uppercase font-black border transition-all duration-300 text-center ${getBtnClass(m, preferences.preferredMilk, preferences.dislikedMilk)}`}
            >
              {m}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ADVANCED TOGGLE */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full py-6 rounded-3xl border border-white/[0.05] bg-white/[0.02] flex items-center justify-center gap-4 text-white/40 hover:text-artisan-accent hover:border-artisan-accent/30 transition-all group"
      >
        <Sliders size={18} className="group-hover:rotate-180 transition-transform duration-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">{showAdvanced ? 'Згорнути майстерню' : 'Розширена логіка вибору'}</span>
      </button>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-12 pt-4"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* INTENSITY */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Профіль Інтенсивності</label>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-px bg-white/10"></div>
                  <span className="text-artisan-accent font-serif text-2xl italic">{preferences.preferredIntensity}</span>
                  <span className="text-[10px] text-white/20 font-black uppercase">/ 5</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2.5">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => onChange({ ...preferences, preferredIntensity: lvl })}
                    className={`h-16 rounded-2xl border text-xs font-black transition-all ${preferences.preferredIntensity === lvl
                      ? 'bg-artisan-accent text-artisan-dark border-artisan-accent shadow-accent'
                      : 'bg-white/[0.03] text-white/20 border-white/[0.05] hover:bg-white/[0.08]'
                      }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* FLAVOR NOTES */}
            <div className="space-y-6">
              <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Смакова Карта</label>
              <div className="bg-artisan-dark/40 p-6 rounded-[3rem] border border-white/[0.05] max-h-56 overflow-y-auto artisan-scroll glass-card">
                <div className="flex flex-wrap gap-2.5">
                  {FLAVOR_NOTES.map(note => (
                    <motion.button
                      key={note}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => toggleSelection(note, 'favoriteNotes', 'dislikedNotes')}
                      className={`px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase transition-all duration-300 ${getBtnClass(note, preferences.favoriteNotes, preferences.dislikedNotes)}`}
                    >
                      {note}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* PRICE & AGING */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6 glass-panel p-8 rounded-[3rem]">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Витримка (m)</label>
                  <span className="text-[11px] font-black text-artisan-accent bg-artisan-accent/10 px-3 py-1 rounded-lg">{preferences.minAging}+</span>
                </div>
                <input
                  type="range" min="0" max="24" step="3"
                  value={preferences.minAging}
                  onChange={(e) => onChange({ ...preferences, minAging: Number(e.target.value) })}
                  className="w-full h-1.5 bg-white/5 accent-artisan-accent appearance-none rounded-full cursor-pointer"
                />
              </div>

              <div className="space-y-6 glass-panel p-8 rounded-[3rem]">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Бюджет (₴)</label>
                  <span className="text-[11px] font-black text-white bg-white/5 px-3 py-1 rounded-lg">{preferences.priceRange[1]}</span>
                </div>
                <input
                  type="range" min="30" max="1000" step="10"
                  value={preferences.priceRange[1]}
                  onChange={(e) => onChange({ ...preferences, priceRange: [0, Number(e.target.value)] })}
                  className="w-full h-1.5 bg-white/5 accent-artisan-accent appearance-none rounded-full cursor-pointer"
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
