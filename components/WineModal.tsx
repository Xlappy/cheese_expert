
import React from 'react';
import { Cheese } from '../types';

interface WineModalProps {
  wine: Cheese;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const WineModal: React.FC<WineModalProps> = ({ wine: cheese, isOpen, onClose, isFavorite, onToggleFavorite }) => {
  if (!isOpen) return null;

  // Update stats to match Cheese properties
  const stats = [
    { label: 'Інтенсивність', value: cheese.intensity },
    { label: 'Текстура', value: cheese.texture },
    { label: 'Солоність', value: cheese.saltiness },
    { label: 'Гострота (Pungency)', value: cheese.pungency },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 animate-fadeIn">
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden animate-slideIn max-h-[92vh] flex flex-col border border-white/20">
        {/* Top Header - Using Cheese specific logic */}
        <div className={`p-14 pb-10 flex justify-between items-start shrink-0 ${
          cheese.type === 'Blue' ? 'bg-blue-50/40' : cheese.type === 'Hard' ? 'bg-amber-50/40' : 'bg-stone-50/40'
        }`}>
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-6xl drop-shadow-sm">🧀</span>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-900 bg-white px-5 py-2 rounded-full shadow-sm border border-stone-100">
                {cheese.origin === 'Ukrainian' ? 'УКРАЇНА' : 'ІМПОРТ'}
              </span>
            </div>
            <h2 className="text-5xl font-black text-stone-900 leading-[1.1] mb-2 tracking-tighter uppercase">{cheese.name}</h2>
            <p className="text-stone-400 font-bold uppercase text-[12px] tracking-[0.2em] flex items-center gap-3">
              {cheese.region} <span className="w-1.5 h-1.5 bg-stone-200 rounded-full"></span> {cheese.milk} MILK <span className="w-1.5 h-1.5 bg-stone-200 rounded-full"></span> {cheese.agingMonths} МІС.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-50 transition-all shadow-md border border-stone-100 active:scale-90"
          >
            <span className="text-xl font-bold">✕</span>
          </button>
        </div>

        <div className="p-14 pt-8 space-y-12 overflow-y-auto custom-scrollbar flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-10">
              <div>
                <h4 className="text-[11px] font-black uppercase text-stone-400 tracking-[0.3em] mb-5">ПРОФІЛЬ СМАКУ</h4>
                <div className="flex flex-wrap gap-3">
                  {cheese.flavorProfile.split(',').map(note => (
                    <span key={note} className="bg-stone-50 text-stone-900 px-5 py-2.5 rounded-2xl text-[13px] font-bold border border-stone-100 shadow-sm">
                      {note.trim()}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-[11px] font-black uppercase text-stone-400 tracking-[0.3em] mb-5">КРАЩІ ПОЄДНАННЯ</h4>
                <p className="text-[15px] text-stone-600 leading-relaxed font-semibold italic border-l-4 border-stone-100 pl-6">
                  {cheese.bestPairing}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] font-black uppercase text-stone-400 tracking-[0.3em] mb-5">ХАРАКТЕРИСТИКИ</h4>
              {stats.map(stat => (
                <div key={stat.label} className="space-y-2.5">
                  <div className="flex justify-between text-[11px] font-black uppercase text-stone-500 tracking-widest">
                    <span>{stat.label}</span>
                    <span>{stat.value}/5</span>
                  </div>
                  <div className="h-2 w-full bg-stone-50 rounded-full overflow-hidden border border-stone-100">
                    <div 
                      className="h-full bg-stone-900 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]" 
                      style={{ width: `${(stat.value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-12 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-8 shrink-0">
            <div className="text-center sm:text-left">
              <p className="text-[11px] font-black text-stone-300 uppercase tracking-[0.3em] mb-2">Ціна за 100г</p>
              <p className="text-4xl font-black text-stone-900 tracking-tight">{cheese.pricePer100g} ₴</p>
            </div>
            <div className="flex gap-5 w-full sm:w-auto">
              <button 
                onClick={() => onToggleFavorite(cheese.id)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-4 px-12 py-5 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 ${
                  isFavorite 
                    ? 'bg-rose-50 text-rose-900 border border-rose-100' 
                    : 'bg-stone-900 text-white hover:bg-black'
                }`}
              >
                <span className="text-2xl">{isFavorite ? '❤️' : '🤍'}</span>
                {isFavorite ? 'В ОБРАНОМУ' : 'ДОДАТИ В ОБРАНЕ'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WineModal;
