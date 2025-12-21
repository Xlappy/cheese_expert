
import React from 'react';
import { Cheese, Recommendation } from '../types';

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
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-10 animate-fadeIn">
      <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-[#fcf9f7] w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden animate-slideIn max-h-[90vh] flex flex-col border border-white/20">
        <div className="p-10 border-b border-stone-200 bg-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">ПІДБІР АЛЬТЕРНАТИВИ</h2>
            <p className="text-stone-500 text-[10px] font-bold uppercase tracking-wider mt-2">ЗАМІНА ДЛЯ: <span className="text-stone-900">{originalWine.name}</span></p>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-all active:scale-90"
          >
            <span className="text-lg font-bold">✕</span>
          </button>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar space-y-8 flex-grow">
          <button 
            onClick={onAutoSelect}
            className="w-full bg-stone-900 text-white p-8 rounded-[3rem] flex items-center justify-between group hover:bg-black transition-all shadow-2xl shadow-stone-900/20 active:scale-[0.98]"
          >
            <div className="text-left">
              <span className="block text-[11px] font-bold uppercase tracking-widest opacity-40 mb-2">АНАЛІТИЧНИЙ РЕЖИМ</span>
              <span className="text-2xl font-black tracking-tight">АВТОМАТИЧНА ОПТИМІЗАЦІЯ СИСТЕМИ</span>
            </div>
            <span className="text-4xl group-hover:rotate-180 transition-transform duration-700">🔄</span>
          </button>

          <div className="grid grid-cols-1 gap-5">
            <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest px-4">РЕКОМЕНДОВАНІ АНАЛОГИ</h3>
            {alternatives.map((rec) => {
              const cheese = allWines.find(w => w.id === rec.cheeseId);
              if (!cheese) return null;
              return (
                <button 
                  key={cheese.id}
                  onClick={() => onSelect(cheese.id)}
                  className="w-full bg-white border border-stone-100 p-8 rounded-[3rem] flex items-center justify-between text-left hover:border-stone-900 hover:shadow-xl transition-all group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-8">
                    <span className="text-5xl filter grayscale group-hover:grayscale-0 transition-all duration-500">🧀</span>
                    <div>
                      <h4 className="font-black text-2xl text-stone-900 tracking-tight leading-tight">{cheese.name}</h4>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{cheese.region} • {cheese.milk} • {cheese.pricePer100g} ₴</span>
                      </div>
                      <p className="text-[13px] text-stone-500 mt-4 line-clamp-2 italic font-medium leading-relaxed">"{rec.explanation}"</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] font-bold text-amber-900 bg-amber-50 px-3 py-1.5 rounded-lg mb-4 tracking-widest border border-amber-100 uppercase">MATCH: {rec.score}%</div>
                    <span className="text-[11px] font-black text-stone-900 uppercase tracking-wider group-hover:text-amber-900 transition-colors">ВИБРАТИ →</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="p-8 bg-stone-100/50 border-t border-stone-200 text-center shrink-0">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">SYSTEM ANALYTICS ENGINE v1.5.0 ACTIVE</p>
        </div>
      </div>
    </div>
  );
};

export default ReplacementModal;
