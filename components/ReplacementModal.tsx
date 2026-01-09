import React from 'react';
import { Cheese, Recommendation } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, ChevronRight, Zap } from 'lucide-react';

interface ReplacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalWine: Cheese;
  alternatives: Recommendation[];
  allWines: Cheese[];
  onSelect: (cheeseId: string) => void;
  onAutoSelect: () => void;
}

const ReplacementModal: React.FC<ReplacementModalProps> = ({
  isOpen, onClose, originalWine, alternatives, allWines, onSelect, onAutoSelect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-artisan-dark/95 backdrop-blur-xl"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-artisan-surface w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/5 paper-texture"
      >
        <div className="p-10 border-b border-white/5 bg-artisan-dark/50 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-3xl font-serif text-white uppercase italic tracking-tighter">Оптимізація вибору</h2>
            <p className="text-artisan-accent text-[10px] font-black uppercase tracking-widest mt-1">Шукаємо заміну для: <span className="text-white underline">{originalWine.name}</span></p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-10 overflow-y-auto artisan-scroll space-y-10 flex-grow">
          {/* AUTO OPTIMIZATION BUTTON */}
          <button
            onClick={onAutoSelect}
            className="w-full bg-artisan-accent text-artisan-dark p-10 rounded-[3rem] flex items-center justify-between group shadow-xl shadow-artisan-accent/5 transition-all active:scale-[0.98] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap size={100} />
            </div>
            <div className="text-left relative z-10">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Алгоритмічний підбір</span>
              <span className="text-3xl font-serif italic tracking-tight uppercase">Автоматична заміна</span>
            </div>
            <div className="bg-artisan-dark/10 p-4 rounded-full group-hover:rotate-180 transition-transform duration-1000">
              <RefreshCw size={32} />
            </div>
          </button>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest px-4">Близькі за профілем смаку</h3>
            <div className="grid grid-cols-1 gap-6">
              {alternatives.map((rec) => {
                const cheese = allWines.find(w => w.id === rec.cheeseId);
                if (!cheese) return null;
                return (
                  <button
                    key={cheese.id}
                    onClick={() => onSelect(cheese.id)}
                    className="w-full bg-artisan-dark/40 border border-white/5 p-8 rounded-[3rem] flex items-center justify-between text-left hover:border-artisan-accent/50 hover:bg-artisan-dark transition-all group active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-8">
                      <span className="text-4xl grayscale group-hover:grayscale-0 transition-all duration-500">🧀</span>
                      <div>
                        <h4 className="font-serif text-2xl text-white tracking-tight leading-tight italic uppercase">{cheese.name}</h4>
                        <div className="flex items-center gap-3 mt-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
                          <span>{cheese.region}</span>
                          <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                          <span className="text-artisan-accent">{cheese.pricePer100g} ₴</span>
                        </div>
                        <p className="text-[12px] text-white/40 mt-5 line-clamp-2 italic font-serif leading-relaxed">"{rec.explanation}"</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[9px] font-black text-artisan-accent bg-artisan-accent/10 px-4 py-2 rounded-xl mb-4 tracking-widest border border-artisan-accent/20 uppercase">Match {rec.score}%</div>
                      <ChevronRight className="ml-auto text-white/10 group-hover:text-artisan-accent transition-colors" size={24} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-8 bg-artisan-dark/80 border-t border-white/5 text-center shrink-0">
          <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.3em]">Deterministic Fromager Service v2.0</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ReplacementModal;
