import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, Utensils, Apple, Nut, Sparkles, Loader2, RefreshCcw, Hand } from 'lucide-react';
import { Cheese } from '../types';

interface PairingAssistantProps {
    cheese: Cheese;
}

const PairingAssistant: React.FC<PairingAssistantProps> = ({ cheese }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [pairings, setPairings] = useState<{ icon: any, label: string, text: string }[] | null>(null);

    const generatePairings = () => {
        setIsLoading(true);
        // Simulate AI thinking
        setTimeout(() => {
            const suggestions = [
                {
                    icon: Wine,
                    label: 'Енологічний Вибір',
                    text: cheese.type === 'Blue' ? 'Стильний Портвейн або Сотерн' :
                        cheese.type === 'Hard' ? 'Витримане Каберне' : 'Легке Шардоне'
                },
                {
                    icon: Apple,
                    label: 'Плодовий Супровід',
                    text: cheese.type === 'Soft-Ripened' ? 'Свіжа груша або інжир' : 'Зелене яблуко'
                },
                {
                    icon: Nut,
                    label: 'Структурний Акцент',
                    text: 'Смажений фундук або грецький горіх у меді'
                }
            ];
            setPairings(suggestions);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="mt-12">
            {!pairings && !isLoading ? (
                <motion.button
                    onClick={generatePairings}
                    className="group relative flex items-center gap-6 glass-panel border border-white/[0.05] hover:border-artisan-accent/30 p-8 rounded-[2.5rem] w-full transition-all overflow-hidden shadow-2xl"
                    whileHover={{ scale: 1.01, y: -4 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-artisan-accent to-transparent opacity-0 group-hover:opacity-40 transition-opacity"></div>

                    <div className="bg-artisan-accent p-4 rounded-2xl text-artisan-dark shadow-accent group-hover:rotate-[15deg] transition-transform duration-500">
                        <Sparkles size={28} />
                    </div>
                    <div className="text-left">
                        <h4 className="text-white font-serif text-xl font-black uppercase tracking-tight italic">Порада Ено-Гастронома</h4>
                        <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.4em] mt-1">Отримати професійну рекомендацію</p>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest hidden sm:block">AI Curator Marco</span>
                        <div className="bg-white/5 group-hover:bg-artisan-accent group-hover:text-artisan-dark px-5 py-2.5 rounded-xl text-white/40 text-[10px] font-black uppercase tracking-widest transition-all">
                            Start Analysis
                        </div>
                    </div>
                </motion.button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-10 rounded-[3.5rem] relative wood-texture shadow-5xl border-white/[0.05]"
                >
                    <div className="absolute -top-10 -right-10 text-artisan-accent/5 pointer-events-none">
                        <Hand size={200} strokeWidth={1.5} />
                    </div>

                    <div className="flex justify-between items-center mb-12 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-artisan-accent shadow-accent"></div>
                            <h3 className="text-artisan-accent font-serif text-2xl uppercase italic tracking-tight">
                                Керамічна Дошка Рекомендацій
                            </h3>
                        </div>
                        <div className="h-px flex-grow mx-10 bg-white/5"></div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-artisan-accent relative z-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="mb-6"
                            >
                                <RefreshCcw size={48} strokeWidth={1.5} />
                            </motion.div>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 animate-pulse">Синхронізація смакових рецепторів...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                            {pairings?.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.15 }}
                                    className="glass-panel p-8 rounded-[2.5rem] hover:bg-white/[0.05] transition-colors border-white/[0.05] group/card"
                                >
                                    <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-artisan-accent group-hover/card:scale-110 group-hover/card:bg-artisan-accent group-hover/card:text-artisan-dark transition-all duration-500">
                                        <item.icon size={22} />
                                    </div>
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-3 group-hover/card:text-artisan-accent transition-colors">{item.label}</h5>
                                    <p className="text-white text-base font-serif leading-relaxed italic line-clamp-3">
                                        "{item.text}"
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-white/[0.05] flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-3">
                            <Sparkles size={14} className="text-artisan-accent" />
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Algorithmic Sommelier v4.0</span>
                        </div>
                        <button
                            onClick={() => setPairings(null)}
                            className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest transition-all hover:text-white"
                        >
                            Скинути аналіз
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default PairingAssistant;
