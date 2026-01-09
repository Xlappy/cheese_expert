import React, { useState } from 'react';
import { Cheese, CHEESE_TYPES, MILK_TYPES } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ShieldCheck, Info } from 'lucide-react';

interface AddCheeseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (cheese: Cheese) => void;
}

const AddCheeseModal: React.FC<AddCheeseModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<Cheese>>({
    id: '',
    name: '',
    type: 'Fresh',
    milk: 'Cow',
    origin: 'Ukrainian',
    region: '',
    agingMonths: 0,
    intensity: 3,
    texture: 3,
    saltiness: 3,
    pungency: 3,
    flavorProfile: '',
    bestPairing: '',
    pricePer100g: 0,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCheese: Cheese = {
      ...formData as Cheese,
      id: formData.id || `custom-${Date.now()}`
    };
    onAdd(newCheese);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['agingMonths', 'intensity', 'texture', 'saltiness', 'pungency', 'pricePer100g'].includes(name)
        ? Number(value)
        : value
    }));
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-artisan-dark/90 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-artisan-surface w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/5 paper-texture"
      >
        <div className="p-8 md:p-12 border-b border-white/5 flex justify-between items-center bg-artisan-dark/50">
          <div>
            <h2 className="text-3xl font-serif text-white uppercase italic tracking-tighter">Реєстрація Сорту</h2>
            <p className="text-[10px] font-black text-artisan-accent uppercase tracking-widest mt-1">Новий запис у реєстр гільдії</p>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 overflow-y-auto artisan-scroll flex-grow space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Basic Info */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
                <Info size={14} /> Основна інформація
              </h4>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/50 uppercase">Назва шедевру</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-artisan-dark border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-white outline-none focus:border-artisan-accent transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase">Категорія</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-artisan-dark border border-white/5 rounded-2xl px-4 py-4 text-xs font-black text-white outline-none focus:border-artisan-accent">
                    {CHEESE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase">Молоко</label>
                  <select name="milk" value={formData.milk} onChange={handleChange} className="w-full bg-artisan-dark border border-white/5 rounded-2xl px-4 py-4 text-xs font-black text-white outline-none focus:border-artisan-accent">
                    {MILK_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase">Походження</label>
                  <select name="origin" value={formData.origin} onChange={handleChange} className="w-full bg-artisan-dark border border-white/5 rounded-2xl px-4 py-4 text-xs font-black text-white outline-none focus:border-artisan-accent">
                    <option value="Ukrainian">Україна</option>
                    <option value="Import">Імпорт</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase">Регіон</label>
                  <input name="region" value={formData.region} onChange={handleChange} className="w-full bg-artisan-dark border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-white outline-none focus:border-artisan-accent" />
                </div>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
                <ShieldCheck size={14} /> Технічні параметри
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase">Витримка (міс)</label>
                  <input type="number" name="agingMonths" value={formData.agingMonths} onChange={handleChange} className="w-full bg-artisan-dark border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-white outline-none focus:border-artisan-accent" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/50 uppercase">Ціна за 100г (₴)</label>
                  <input type="number" name="pricePer100g" value={formData.pricePer100g} onChange={handleChange} className="w-full bg-artisan-dark border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-white outline-none focus:border-artisan-accent" />
                </div>
              </div>

              <div className="space-y-6 pt-4">
                {[
                  { label: 'Інтенсивність', name: 'intensity' },
                  { label: 'Текстура (1-м\'який, 5-твердий)', name: 'texture' },
                ].map(stat => (
                  <div key={stat.name} className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">{stat.label}</label>
                      <span className="text-artisan-accent text-[10px] font-black">{(formData as any)[stat.name]}/5</span>
                    </div>
                    <input type="range" min="1" max="5" name={stat.name} value={(formData as any)[stat.name]} onChange={handleChange} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-artisan-accent" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/50 uppercase">Профіль смаку (через кому)</label>
              <textarea name="flavorProfile" value={formData.flavorProfile} onChange={handleChange} rows={2} className="w-full bg-artisan-dark border border-white/5 rounded-3xl px-8 py-6 text-xs font-medium text-white/70 outline-none focus:border-artisan-accent transition-all serif italic" placeholder="напр. Вершковий, горіховий, з легкою кислинкою..." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/50 uppercase">Ідеальне поєднання</label>
              <input name="bestPairing" value={formData.bestPairing} onChange={handleChange} className="w-full bg-artisan-dark border border-white/5 rounded-3xl px-8 py-6 text-xs font-medium text-white/70 outline-none focus:border-artisan-accent transition-all serif italic" placeholder="напр. Лавандовий мед та келишок сухого білого..." />
            </div>
          </div>
        </form>

        <div className="p-8 md:p-12 bg-artisan-dark/50 border-t border-white/5 flex gap-4">
          <button onClick={onClose} className="px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">Скасувати</button>
          <button onClick={handleSubmit} className="flex-grow bg-artisan-accent text-artisan-dark px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
            <Plus size={18} /> Додати до реєстру
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddCheeseModal;
