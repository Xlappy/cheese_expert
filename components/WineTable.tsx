import React, { useState } from 'react';
import { Cheese } from '../types';
import { CHEESE_TYPES } from '../types';
import { Edit2, Save, X, Trash2, Search } from 'lucide-react';

interface CheeseTableProps {
  wines: Cheese[];
  onUpdate: (updatedWines: Cheese[]) => void;
  title: string;
}

const CheeseTable: React.FC<CheeseTableProps> = ({ wines, onUpdate, title }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Cheese | null>(null);
  const [localSearch, setLocalSearch] = useState('');

  const startEdit = (cheese: Cheese) => {
    setEditingId(cheese.id);
    setEditForm({ ...cheese });
  };

  const handleSave = () => {
    if (editForm) {
      onUpdate([editForm]);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editForm) return;
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev!,
      [name]: ['agingMonths', 'intensity', 'texture', 'saltiness', 'pungency', 'pricePer100g'].includes(name)
        ? Number(value)
        : value
    }));
  };

  const filteredWines = wines.filter(w =>
    w.name.toLowerCase().includes(localSearch.toLowerCase()) ||
    w.type.toLowerCase().includes(localSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-artisan-dark/20 backdrop-blur-md">
      <div className="px-10 py-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-serif text-white uppercase tracking-tight italic">{title}</h3>
          <p className="text-[10px] font-black text-artisan-accent uppercase tracking-widest mt-1">Реєстраційна книга цеху</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Пошук у реєстрі..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-artisan-dark/50 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-xs font-black text-white placeholder:text-white/10 outline-none focus:border-artisan-accent/50 transition-all uppercase tracking-tight"
          />
        </div>
      </div>

      <div className="overflow-x-auto artisan-scroll">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              {['Продукт', 'Категорія', 'Молоко', 'Ціна', 'Дії'].map(h => (
                <th key={h} className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredWines.map((cheese) => (
              <tr key={cheese.id} className="hover:bg-white/5 transition-colors group">
                {editingId === cheese.id ? (
                  <>
                    <td className="px-10 py-4">
                      <input name="name" value={editForm?.name} onChange={handleChange} className="bg-artisan-dark border border-white/10 rounded-xl px-4 py-2 text-xs font-black text-white uppercase outline-none focus:border-artisan-accent" />
                    </td>
                    <td className="px-10 py-4">
                      <select name="type" value={editForm?.type} onChange={handleChange} className="bg-artisan-dark border border-white/10 rounded-xl px-4 py-2 text-xs font-black text-white uppercase outline-none focus:border-artisan-accent">
                        {CHEESE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </td>
                    <td className="px-10 py-4">
                      <input name="milk" value={editForm?.milk} onChange={handleChange} className="bg-artisan-dark border border-white/10 rounded-xl px-4 py-2 text-xs font-black text-white uppercase outline-none focus:border-artisan-accent w-24" />
                    </td>
                    <td className="px-10 py-4">
                      <input type="number" name="pricePer100g" value={editForm?.pricePer100g} onChange={handleChange} className="bg-artisan-dark border border-white/10 rounded-xl px-4 py-2 text-xs font-black text-white outline-none focus:border-artisan-accent w-20" />
                    </td>
                    <td className="px-10 py-4 flex gap-4">
                      <button onClick={handleSave} className="text-artisan-accent hover:scale-110 transition-transform"><Save size={18} /></button>
                      <button onClick={() => setEditingId(null)} className="text-white/20 hover:text-white"><X size={18} /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-serif font-black text-white uppercase italic">{cheese.name}</span>
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{cheese.region}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="bg-artisan-dark px-4 py-1.5 rounded-full text-[9px] font-black text-artisan-accent uppercase border border-white/5">
                        {cheese.type}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-black text-white/40 uppercase tracking-tight">{cheese.milk}</td>
                    <td className="px-10 py-8 text-sm font-serif text-white">{cheese.pricePer100g} ₴</td>
                    <td className="px-10 py-8">
                      <button
                        onClick={() => startEdit(cheese)}
                        className="opacity-0 group-hover:opacity-100 p-3 bg-white/5 rounded-xl text-white/40 hover:text-artisan-accent hover:bg-white/10 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredWines.length === 0 && (
        <div className="p-20 text-center flex flex-col items-center">
          <Search size={48} className="text-white/5 mb-4" />
          <p className="text-white/20 font-serif italic">Жодних записів не знайдено...</p>
        </div>
      )}
    </div>
  );
};

export default CheeseTable;
