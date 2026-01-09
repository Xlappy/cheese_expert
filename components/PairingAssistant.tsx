import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, Utensils, Apple, Nut, Sparkles, Loader2 } from 'lucide-react';
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
                    label: 'Вино',
                    text: cheese.type === 'Blue' ? 'Стильний Портвейн або Сотерн' :
                        cheese.type === 'Hard' ? 'Витримане Каберне' : 'Легке Шардоне'
                },
                {
                    icon: Apple,
                    label: 'Фрукти',
                    text: cheese.type === 'Soft-Ripened' ? 'Свіжа груша або інжир' : 'Зелене яблуко'
                },
                {
                    icon: Nut,
                    label: 'Горіхи',
                    text: 'Смажений фундук або грецький горіх у меді'
                }
            ];
            setPairings(suggestions);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="mt-8">
            {!pairings && !isLoading ? (
                <motion.button
                    onClick={generatePairings}
                    className="group relative flex items-center gap-3 bg-artisan-surface border-2 border-dashed border-artisan-accent/30 hover:border-artisan-accent p-6 rounded-3xl w-full transition-all overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="bg-artisan-accent p-3 rounded-2xl text-artisan-dark group-hover:rotate-12 transition-transform">
                        <Sparkles size={24} />
                    </div>
                    <div className="text-left">
                        <h4 className="text-artisan-cream font-serif text-lg font-bold uppercase tracking-tight">Порада ШІ-Марко</h4>
                        <p className="text-artisan-cream/50 text-[10px] uppercase font-black tracking-widest">Дізнайся ідеальну гастро-пару</p>
                    </div>
                    <div className="ml-auto bg-artisan-dark/50 px-4 py-2 rounded-xl text-artisan-accent text-[10px] font-black uppercase tracking-tighter">
                        Analyse
                    </div>
                </motion.button>
            ) : (
                <div className="bg-stone-900 border-4 border-stone-800 p-8 rounded-[3rem] relative wood-texture shadow-inner">
                    <div className="absolute top-6 right-8 text-artisan-accent/20">
                        <Utensils size={120} />
                    </div>

                    <h3 className="text-artisan-accent font-serif text-2xl mb-8 relative z-10">
                        Рекомендації нашого Fromager
                    </h3>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-artisan-accent">
                            <Loader2 size={40} className="animate-spin mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] font-sans">Вивчаю профіль смаку...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            {pairings?.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="bg-artisan-dark/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 hover:border-artisan-accent/30 transition-colors"
                                >
                                    <item.icon className="text-artisan-accent mb-4" size={24} />
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-artisan-accent/60 mb-2">{item.label}</h5>
                                    <p className="text-artisan-cream text-xs font-serif leading-relaxed italic">
                                        "{item.text}"
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[9px] font-black text-artisan-cream/30 uppercase tracking-widest">
                        <span>Deterministic AI Analysis</span>
                        <button onClick={() => setPairings(null)} className="hover:text-artisan-accent border-b border-transparent hover:border-artisan-accent transition-all">Скинути пораду</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PairingAssistant;
