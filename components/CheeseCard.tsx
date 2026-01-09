import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cheese } from '../types';
import { BadgeCheck, Info, ChevronRight, Star } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface CheeseCardProps {
    cheese: Cheese;
    onClick: () => void;
}

const CheeseCard: React.FC<CheeseCardProps> = ({ cheese, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Data for radar chart
    const radarData = [
        { subject: 'Солоність', A: cheese.saltiness * 20 },
        { subject: 'Гострота', A: cheese.pungency * 20 },
        { subject: 'Інтенсивність', A: cheese.intensity * 20 },
        { subject: 'Текстура', A: cheese.texture * 20 },
        { subject: 'Витримка', A: Math.min(cheese.agingMonths * 5, 100) },
    ];

    const getEmoji = (type: string) => {
        switch (type) {
            case 'Blue': return '🧀';
            case 'Soft-Ripened': return '⚪';
            case 'Hard': return '🧱';
            case 'Fresh': return '🥛';
            case 'Washed-Rind': return '🟠';
            default: return '🧀';
        }
    };

    return (
        <motion.div
            className="relative w-72 h-72 shrink-0 group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            {/* The Circular Body */}
            <div className="absolute inset-0 bg-artisan-surface rounded-full shadow-2xl overflow-hidden border-4 border-artisan-accent/20 group-hover:border-artisan-accent/50 transition-colors flex items-center justify-center paper-texture">
                {/* Front View */}
                <AnimatePresence mode="wait">
                    {!isHovered ? (
                        <motion.div
                            key="front"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center p-6 flex flex-col items-center"
                        >
                            <span className="text-6xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                                {getEmoji(cheese.type)}
                            </span>
                            <h3 className="text-artisan-cream text-lg font-serif font-bold leading-tight uppercase tracking-tight line-clamp-2">
                                {cheese.name}
                            </h3>
                            <p className="text-artisan-accent text-[10px] font-black tracking-widest mt-2 uppercase">
                                {cheese.type}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="back"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="w-full h-full p-4 flex flex-col items-center justify-center bg-artisan-dark/80 backdrop-blur-sm"
                        >
                            <div className="w-full h-32 mb-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#444" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#f5f5f4', fontSize: 8 }} />
                                        <Radar
                                            name="Smack"
                                            dataKey="A"
                                            stroke="#eb9b34"
                                            fill="#eb9b34"
                                            fillOpacity={0.6}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex items-center gap-1 text-artisan-accent mb-1">
                                <Star size={12} fill="currentColor" />
                                <span className="text-[10px] font-bold">ВИТРИМКА: {cheese.agingMonths}м</span>
                            </div>
                            <p className="text-[9px] text-artisan-cream/70 italic text-center px-4 line-clamp-3">
                                {cheese.flavorProfile}
                            </p>
                            <div className="mt-3 flex items-center gap-1 text-artisan-accent font-black text-[9px] uppercase tracking-tighter">
                                <span>Паспорт сиру</span>
                                <ChevronRight size={12} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Decorative Ribbon for Ukrainian cheese */}
            {cheese.origin === 'Ukrainian' && (
                <div className="absolute top-2 -right-2 bg-artisan-olive text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg transform rotate-12 z-10 flex items-center gap-1">
                    <BadgeCheck size={10} />
                    <span>Local Art</span>
                </div>
            )}

            {/* Price Tag */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-artisan-accent text-artisan-dark px-4 py-1.5 rounded-2xl font-black text-xs shadow-xl z-10">
                {cheese.pricePer100g} ₴
            </div>
        </motion.div>
    );
};

export default CheeseCard;
