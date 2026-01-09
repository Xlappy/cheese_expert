
import React, { useState } from 'react';
import { Cheese } from '../types';
import { CHEESE_TYPES } from '../types';

interface WineTableProps {
  wines: Cheese[];
  onUpdate: (updatedWines: Cheese[]) => void;
  title: string;
}

const WineTable: React.FC<WineTableProps> = ({ wines, onUpdate, title }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Cheese | null>(null);

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

  return (
    <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-stone-100 animate-fadeIn">
      <div className="px-10 py-7 border-b border-stone-50 flex justify-between items-center bg-stone-50/20">
        <h3 className="text-xs font-bold text-stone-900 uppercase tracking-widest">{title}</h3>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{wines.length} РЕЄСТРАЦІЙ</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50/50 border-b border-stone-100">
              {['Назва', 'Тип', 'Молоко', 'Ціна (₴)', 'Дії'].map(h => (
                <th key={h} className="px-10 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {wines.map((cheese) => (
              <tr key={cheese.id} className="hover:bg-stone-50/40 transition-colors group">
                {editingId === cheese.id ? (
                  <>
                    <td className="px-10 py-4"><input className="w-full bg-stone-50 border-none rounded-xl p-3 text-xs font-black focus:ring-1 focus:ring-stone-900 outline-none uppercase tracking-tight" name="name" value={editForm?.name} onChange={handleChange} /></td>
                    <td className="px-10 py-4">
                      <select className="w-full bg-stone-50 border-none rounded-xl p-3 text-xs font-black focus:ring-1 focus:ring-stone-900 outline-none uppercase tracking-tight" name="type" value={editForm?.type} onChange={handleChange}>
                        {CHEESE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </td>
                    <td className="px-10 py-4"><input className="w-full bg-stone-50 border-none rounded-xl p-3 text-xs font-black focus:ring-1 focus:ring-stone-900 outline-none uppercase tracking-tight" name="milk" value={editForm?.milk} onChange={handleChange} /></td>
                    <td className="px-10 py-4"><input className="w-28 bg-stone-50 border-none rounded-xl p-3 text-xs font-black focus:ring-1 focus:ring-stone-900 outline-none" type="number" name="pricePer100g" value={editForm?.pricePer100g} onChange={handleChange} /></td>
                    <td className="px-10 py-4 space-x-6">
                      <button onClick={handleSave} className="text-stone-900 font-bold text-[10px] uppercase tracking-wider hover:underline">ЗБЕРЕГТИ</button>
                      <button onClick={() => setEditingId(null)} className="text-stone-300 font-bold text-[10px] uppercase tracking-wider hover:text-stone-500">СКАСУВАТИ</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-10 py-6 text-sm font-black text-stone-900 tracking-tight uppercase">{cheese.name}</td>
                    <td className="px-10 py-6 text-[11px] text-stone-500 font-bold uppercase tracking-wide">{cheese.type}</td>
                    <td className="px-10 py-6 text-[11px] text-stone-400 font-black tracking-tight">{cheese.milk}</td>
                    <td className="px-10 py-6 text-sm font-black text-stone-900 tracking-tight">{cheese.pricePer100g}</td>
                    <td className="px-10 py-6">
                      <button onClick={() => startEdit(cheese)} className="text-stone-400 group-hover:text-stone-900 text-[10px] font-bold uppercase tracking-wider transition-colors hover:underline">РЕДАГУВАТИ</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WineTable;
