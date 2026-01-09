import React, { useState } from 'react';
import { Cheese } from '../types';
import { CHEESE_TYPES, MILK_TYPES } from '../types';
import { Edit2, Save, X, Trash2, Search, Filter, ChevronRight, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CheeseTableProps {
    wines: Cheese[];
    onUpdate: (updatedWines: Cheese[]) => void;
    onSelect: (id: string) => void;
    title: string;
}

const CheeseTable: React.FC<CheeseTableProps> = ({ wines, onUpdate, title }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Cheese | null>(null);
    const [localSearch, setLocalSearch] = useState('');

    // Filtering states
    const [selectedType, setSelectedType] = useState<string | 'All'>('All');
    const [selectedMilk, setSelectedMilk] = useState<string | 'All'>('All');
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [showFilters, setShowFilters] = useState(false);

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

    const filteredWines = wines.filter(w => {
        const matchesSearch = w.name.toLowerCase().includes(localSearch.toLowerCase()) ||
            w.type.toLowerCase().includes(localSearch.toLowerCase()) ||
            w.region?.toLowerCase().includes(localSearch.toLowerCase());

        const matchesType = selectedType === 'All' || w.type === selectedType;
        const matchesMilk = selectedMilk === 'All' || w.milk === selectedMilk;
        const matchesPrice = w.pricePer100g <= maxPrice;

        return matchesSearch && matchesType && matchesMilk && matchesPrice;
    });

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* HEADER SECTION */}
            <div className="px-12 py-12 space-y-10 bg-white/[0.01]">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Hash size={14} className="text-artisan-accent" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Registry Control</span>
                        </div>
                        <h3 className="text-3xl font-serif text-white uppercase tracking-tighter italic">{title}</h3>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                            Curated collection of {wines.length} varieties • Currently showing {filteredWines.length}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-grow lg:w-96 group">
                            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-artisan-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="Шукати сорт за назвою..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                className="w-full bg-artisan-dark/50 border border-white/[0.05] rounded-[1.5rem] py-5 pl-14 pr-8 text-xs font-black text-white placeholder:text-white/10 outline-none focus:border-artisan-accent/50 focus:bg-artisan-dark/80 transition-all uppercase tracking-tight"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-5 rounded-[1.5rem] border transition-all duration-500 flex items-center gap-3 ${showFilters ? 'bg-artisan-accent border-artisan-accent text-artisan-dark' : 'bg-white/5 border-white/5 text-white/30 hover:text-white hover:bg-white/10'}`}
                        >
                            <Filter size={20} />
                            {showFilters && <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Приховати фільтри</span>}
                        </button>
                    </div>
                </div>

                {/* EXPANDABLE FILTERS */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, y: -20 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -10 }}
                            className="overflow-hidden space-y-10 pt-8 border-t border-white/[0.03]"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Type Filter */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-1 rounded-full bg-artisan-accent"></div>
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Категорія шедевру</label>
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        <button
                                            onClick={() => setSelectedType('All')}
                                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${selectedType === 'All' ? 'bg-white text-artisan-dark' : 'bg-white/[0.03] text-white/40 hover:bg-white/10'}`}
                                        >
                                            Всі типи
                                        </button>
                                        {CHEESE_TYPES.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${selectedType === type ? 'bg-artisan-accent text-artisan-dark shadow-accent' : 'bg-white/[0.03] text-white/40 hover:bg-white/10'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Milk Filter */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-1 rounded-full bg-artisan-accent"></div>
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Походження (Молоко)</label>
                                    </div>
                                    <div className="flex flex-wrap gap-2.5">
                                        <button
                                            onClick={() => setSelectedMilk('All')}
                                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${selectedMilk === 'All' ? 'bg-white text-artisan-dark' : 'bg-white/[0.03] text-white/40 hover:bg-white/10'}`}
                                        >
                                            Будь-яке
                                        </button>
                                        {MILK_TYPES.map(milk => (
                                            <button
                                                key={milk}
                                                onClick={() => setSelectedMilk(milk)}
                                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${selectedMilk === milk ? 'bg-artisan-olive text-white shadow-xl' : 'bg-white/[0.03] text-white/40 hover:bg-white/10'}`}
                                            >
                                                {milk}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Filter */}
                                <div className="space-y-5 md:col-span-2 glass-panel p-8 rounded-[2rem]">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-1 rounded-full bg-artisan-accent"></div>
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Бюджетний ліміт (₴/100г)</label>
                                        </div>
                                        <span className="text-artisan-accent font-serif italic text-xl">{maxPrice} ₴</span>
                                    </div>
                                    <input
                                        type="range" min="30" max="1000" step="10"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        className="w-full h-1.5 bg-white/5 accent-artisan-accent appearance-none rounded-full cursor-pointer"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="overflow-x-auto artisan-scroll pb-12">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-white/[0.03] border-y border-white/[0.05]">
                            {['Продукт', 'Категорія', 'Молоко', 'Ціна (100г)', 'Дії'].map(h => (
                                <th key={h} className="px-12 py-7 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {filteredWines.map((cheese) => (
                            <tr
                                key={cheese.id}
                                onClick={() => onSelect(cheese.id)}
                                className="hover:bg-white/[0.04] transition-colors group relative cursor-pointer border-l-2 border-transparent hover:border-artisan-accent"
                            >
                                {editingId === cheese.id ? (
                                    <>
                                        <td className="px-12 py-7">
                                            <input name="name" value={editForm?.name} onChange={handleChange} className="bg-artisan-dark border border-white/[0.1] rounded-xl px-5 py-3 text-xs font-black text-white uppercase outline-none focus:border-artisan-accent w-full" />
                                        </td>
                                        <td className="px-12 py-7">
                                            <select name="type" value={editForm?.type} onChange={handleChange} className="bg-artisan-dark border border-white/[0.1] rounded-xl px-5 py-3 text-xs font-black text-white uppercase outline-none focus:border-artisan-accent w-full">
                                                {CHEESE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-12 py-7">
                                            <input name="milk" value={editForm?.milk} onChange={handleChange} className="bg-artisan-dark border border-white/[0.1] rounded-xl px-5 py-3 text-xs font-black text-white uppercase outline-none focus:border-artisan-accent w-full" />
                                        </td>
                                        <td className="px-12 py-7">
                                            <input type="number" name="pricePer100g" value={editForm?.pricePer100g} onChange={handleChange} className="bg-artisan-dark border border-white/[0.1] rounded-xl px-5 py-3 text-xs font-black text-white outline-none focus:border-artisan-accent w-full" />
                                        </td>
                                        <td className="px-12 py-7 flex gap-4">
                                            <button onClick={handleSave} className="p-3 bg-artisan-accent text-artisan-dark rounded-xl shadow-accent hover:scale-110 transition-all"><Save size={18} /></button>
                                            <button onClick={() => setEditingId(null)} className="p-3 bg-white/5 text-white/40 rounded-xl hover:text-white transition-all"><X size={18} /></button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-12 py-10">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-sm font-serif font-black text-white uppercase italic tracking-tight group-hover:text-artisan-accent transition-colors">{cheese.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-[1px] bg-white/10"></div>
                                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">{cheese.region || 'World Origins'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border transition-all ${cheese.type === 'Hard' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                cheese.type === 'Blue' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                    'bg-white/5 text-white/40 border-white/[0.05]'
                                                }`}>
                                                {cheese.type}
                                            </span>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.1)] ${cheese.milk === 'Cow' ? 'bg-sky-400' :
                                                    cheese.milk === 'Goat' ? 'bg-amber-400' :
                                                        cheese.milk === 'Sheep' ? 'bg-emerald-400' : 'bg-red-400'
                                                    }`}></div>
                                                <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">{cheese.milk}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-base font-serif font-bold text-white tracking-tighter">{cheese.pricePer100g}</span>
                                                <span className="text-[10px] font-black text-white/20 uppercase">₴</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => startEdit(cheese)}
                                                    className="opacity-0 group-hover:opacity-100 p-4 bg-white/5 rounded-2xl text-white/30 hover:text-artisan-accent hover:bg-white/10 hover:shadow-2xl transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <ChevronRight size={16} className="text-white/[0.03] group-hover:translate-x-2 group-hover:text-white/20 transition-all duration-500" />
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredWines.length === 0 && (
                <div className="py-40 text-center flex flex-col items-center wood-texture">
                    <div className="bg-white/5 p-16 rounded-full mb-10 relative">
                        <div className="absolute inset-0 bg-artisan-accent/5 blur-[40px] rounded-full"></div>
                        <Search size={64} className="text-white/10 relative z-10" strokeWidth={0.5} />
                    </div>
                    <h4 className="text-2xl font-serif italic text-white/30 mb-8">Майстри не знайшли відповідних записів</h4>
                    <button
                        onClick={() => { setLocalSearch(''); setSelectedType('All'); setSelectedMilk('All'); setMaxPrice(1000); }}
                        className="px-10 py-4 bg-artisan-accent text-artisan-dark text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-accent"
                    >
                        Скинути Архівні Фільтри
                    </button>
                </div>
            )}
        </div>
    );
};

export default CheeseTable;
