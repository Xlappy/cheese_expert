
import React, { useState } from 'react';
import { Cheese } from '../types';
import { CHEESE_TYPES, MILK_TYPES } from '../constants';

interface AddWineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (cheese: Cheese) => void;
}

const AddWineModal: React.FC<AddWineModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<Omit<Cheese, 'id'>>({
    name: '',
    type: 'Hard',
    milk: 'Cow',
    origin: 'Ukrainian',
    region: '',
    agingMonths: 0,
    intensity: 3,
    texture: 3,
    saltiness: 3,
    pungency: 2,
    flavorProfile: '',
    bestPairing: '',
    pricePer100g: 100
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['agingMonths', 'intensity', 'texture', 'saltiness', 'pungency', 'pricePer100g'].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCheese: Cheese = {
      ...formData,
      id: `manual-${Date.now()}`
    } as Cheese;
    onAdd(newCheese);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-10 animate-fadeIn">
      <div className="absolute inset-0 bg-stone-950/70 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-[#fcf9f7] w-full max-w-5xl rounded-[4rem] shadow-2xl overflow-hidden animate-slideIn max-h-[92vh] flex flex-col border border-white/20">
        <div className="p-12 border-b border-stone-200 bg-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">НОВА ПОЗИЦІЯ РЕЄСТРУ</h2>
            <p className="text-stone-500 text-[11px] font-bold uppercase tracking-widest mt-2">ДОДАВАННЯ ОБ'ЄКТА В БАЗУ ЗНАНЬ СИСТЕМИ</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200 transition-all active:scale-90"
          >
            <span className="text-xl font-bold">✕</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-14 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Основна інформація */}
            <div className="space-y-10">
              <h3 className="text-[11px] font-bold text-stone-300 uppercase tracking-widest pb-3 border-b border-stone-100">ГЛОБАЛЬНА ІДЕНТИФІКАЦІЯ</h3>
              
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold uppercase text-stone-500 tracking-wider ml-2">Назва сиру</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4.5 text-sm font-black outline-none focus:ring-2 focus:ring-stone-900/5 transition-all uppercase placeholder:text-stone-200 tracking-tight" placeholder="НАПР. ГОРГОНЗОЛА ДОЛЬЧЕ" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase text-stone-500 tracking-wider ml-2">Тип сиру</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4.5 text-xs font-black outline-none uppercase tracking-wide">
                    {CHEESE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase text-stone-500 tracking-wider ml-2">Тип молока</label>
                  <select name="milk" value={formData.milk} onChange={handleChange} className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4.5 text-xs font-black outline-none uppercase tracking-wide">
                    {MILK_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase text-stone-500 tracking-wider ml-2">Походження</label>
                  <select name="origin" value={formData.origin} onChange={handleChange} className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4.5 text-xs font-black outline-none uppercase tracking-wide">
                    <option value="Ukrainian">Україна</option>
                    <option value="Import">Імпорт</option>
                  </select>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase text-stone-500 tracking-wider ml-2">Регіон</label>
                  <input required name="region" value={formData.region} onChange={handleChange} className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4.5 text-sm font-black outline-none uppercase placeholder:text-stone-200 tracking-tight" placeholder="НАПР. КИЇВЩИНА АБО ЛОМБАРДІЯ" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase text-stone-500 tracking-wider ml-2">Витримка (міс)</label>
                  <input required type="number" name="agingMonths" value={formData.agingMonths} onChange={handleChange} className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4.5 text-sm font-black outline-none tracking-tight" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase text-stone-500 tracking-wider ml-2">Ціна (₴/100г)</label>
                  <input required type="number" name="pricePer100g" value={formData.pricePer100g} onChange={handleChange} className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4.5 text-sm font-black outline-none tracking-tight" />
                </div>
              </div>
            </div>

            {/* Характеристики */}
            <div className="space-y-10">
              <h3 className="text-[11px] font-bold text-stone-300 uppercase tracking-widest pb-3 border-b border-stone-100">АНАЛІТИЧНІ ХАРАКТЕРИСТИКИ</h3>
              
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-stone-500 tracking-wider ml-2 flex justify-between">
                    Інтенсивність <span className="text-stone-900 font-black">{formData.intensity}</span>
                  </label>
                  <input type="range" min="1" max="5" name="intensity" value={formData.intensity} onChange={handleChange} className="w-full" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-stone-500 tracking-wider ml-2 flex justify-between">
                    Текстура <span className="text-stone-900 font-black">{formData.texture}</span>
                  </label>
                  <input type="range" min="1" max="5" name="texture" value={formData.texture} onChange={handleChange} className="w-full" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-stone-500 tracking-wider ml-2 flex justify-between">
                    Солоність <span className="text-stone-900 font-black">{formData.saltiness}</span>
                  </label>
                  <input type="range" min="1" max="5" name="saltiness" value={formData.saltiness} onChange={handleChange} className="w-full" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase text-stone-500 tracking-wider ml-2 flex justify-between">
                    Гострота <span className="text-stone-900 font-black">{formData.pungency}</span>
                  </label>
                  <input type="range" min="1" max="5" name="pungency" value={formData.pungency} onChange={handleChange} className="w-full" />
                </div>
              </div>

              <div className="space-y-8 pt-6 border-t border-stone-100">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase text-stone-500 tracking-wider ml-2">Профіль смаку</label>
                  <textarea name="flavorProfile" value={formData.flavorProfile} onChange={handleChange} className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4 text-sm font-black outline-none h-28 resize-none uppercase leading-relaxed tracking-tight" placeholder="НАПР. ВЕРШКОВИЙ, ГРИБНИЙ, ГОРІХОВИЙ" />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-bold uppercase text-stone-500 tracking-wider ml-2">Гастрономічні пари</label>
                  <textarea name="bestPairing" value={formData.bestPairing} onChange={handleChange} className="w-full bg-white border border-stone-100 rounded-2xl px-6 py-4 text-sm font-black outline-none h-28 resize-none uppercase leading-relaxed tracking-tight" placeholder="З ЧИМ КРАЩЕ СМАКУЄ..." />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 flex gap-6 shrink-0">
            <button 
              type="submit"
              className="flex-1 bg-stone-900 text-white py-7 rounded-[3rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl active:scale-[0.98]"
            >
              ЗБЕРЕГТИ В БАЗУ ДАНИХ
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="px-14 bg-white text-stone-900 border border-stone-200 py-7 rounded-[3rem] font-black text-xs uppercase tracking-widest hover:bg-stone-50 transition-all active:scale-[0.98]"
            >
              СКАСУВАТИ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWineModal;
