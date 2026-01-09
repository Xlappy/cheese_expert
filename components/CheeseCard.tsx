import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cheese } from '../types';
import { BadgeCheck, Info, ChevronRight, Star, TrendingUp, RefreshCcw } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface CheeseCardProps {
    cheese: Cheese;
    onClick: () => void;
    onReplace?: (e: React.MouseEvent) => void;
}

const CheeseCard: React.FC<CheeseCardProps> = ({ cheese, onClick, onReplace }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Debug indicator
    const hasReplace = !!onReplace;

    // Data for radar chart
    const radarData = [
        { subject: 'Сіль', A: cheese.saltiness * 20 },
        { subject: 'Гострота', A: cheese.pungency * 20 },
        { subject: 'Тіло', A: cheese.intensity * 20 },
        { subject: 'Текстура', A: cheese.texture * 20 },
        { subject: 'Вік', A: Math.min(cheese.agingMonths * 5, 100) },
    ];

    const getEmoji = (type: string) => {
        switch (type) {
            case 'Blue': return '🌩️';
            case 'Soft-Ripened': return '🍯';
            case 'Hard': return '🏔️';
            case 'Fresh': return '🥛';
            case 'Washed-Rind': return '🧀';
            case 'Semi-Soft': return '🌾';
            default: return '🧀';
        }
    };

    return (
        <motion.div
            className="relative w-80 h-80 shrink-0 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* The Circular Body */}
            <div className="absolute inset-0 rounded-full shadow-artisan overflow-hidden border border-white/[0.05] group-hover:border-artisan-accent/50 transition-all duration-700 flex items-center justify-center paper-texture bg-artisan-surface">

                {/* SOLID BASE LAYER - MUST BE SOLID TO PREVENT FLICKER */}
                <div className="absolute inset-0 bg-[#1c1917] z-0" />

                {/* Visual Background Glow */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-artisan-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[1]"></div>

                {/* Transitions */}
                <AnimatePresence initial={false}>
                    {!isHovered ? (
                        <motion.div
                            key="front"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="text-center p-10 flex flex-col items-center relative z-10"
                        >
                            <div className="relative mb-6">
                                <motion.span
                                    className="text-7xl block transition-all duration-700 group-hover:scale-110"
                                >
                                    {getEmoji(cheese.type)}
                                </motion.span>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-artisan-accent/20 blur-sm rounded-full"></div>
                            </div>

                            <h3 className="text-white text-xl font-serif font-black leading-tight uppercase tracking-tighter line-clamp-2 px-4 italic">
                                {cheese.name}
                            </h3>

                            <div className="flex items-center gap-3 mt-4">
                                <span className="h-px w-6 bg-white/10"></span>
                                <p className="text-artisan-accent text-[9px] font-black tracking-[0.3em] uppercase">
                                    {cheese.type}
                                </p>
                                <span className="h-px w-6 bg-white/10"></span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="back"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full p-8 flex flex-col items-center justify-center bg-[#0c0a09] relative z-10"
                        >
                            <div className="w-full h-40 mb-2 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                                        <PolarGrid stroke="#ffffff10" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 7, fontWeight: 900 }} />
                                        <Radar
                                            name="Profile"
                                            dataKey="A"
                                            stroke="#f9a435"
                                            strokeWidth={2}
                                            fill="#f9a435"
                                            fillOpacity={0.4}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-3 text-center">
                                <div className="flex items-center justify-center gap-4 text-white/40 text-[9px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-1">
                                        <Star size={10} className="text-artisan-accent" />
                                        <span>{cheese.agingMonths}m Aging</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-white/10"></div>
                                    <div className="flex items-center gap-1">
                                        <TrendingUp size={10} className="text-artisan-accent" />
                                        <span>Intensity {cheese.intensity}/5</span>
                                    </div>
                                </div>

                                <p className="text-[10px] text-white/70 font-serif italic leading-relaxed px-6 line-clamp-2">
                                    "{cheese.flavorProfile}"
                                </p>

                                <div className="pt-2 flex items-center justify-center gap-2 text-artisan-accent font-black text-[9px] uppercase tracking-[0.2em] group/btn">
                                    <span>Відкрити паспорт</span>
                                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Decorative Label */}
            {cheese.origin === 'Ukrainian' && (
                <div className="absolute top-4 -right-4 bg-artisan-olive text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl transform rotate-6 z-20 flex items-center gap-2 border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                    <span>Крафт</span>
                </div>
            )}

            {/* Replace Button - Moved to top-right inside and made even more prominent */}
            {hasReplace && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 left-4 z-[100]"
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onReplace?.(e);
                        }}
                        className="w-16 h-16 bg-artisan-accent text-artisan-dark rounded-full shadow-[0_0_40px_rgba(249,164,53,0.6)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all border-4 border-[#0c0a09]"
                    >
                        <RefreshCcw size={28} strokeWidth={3} className="animate-[spin_10s_linear_infinite]" />
                    </button>
                </motion.div>
            )}

            {/* Price Tag */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-artisan-dark px-6 py-2.5 rounded-full font-black text-xs shadow-2xl z-30 border-2 border-artisan-dark uppercase tracking-widest"
            >
                {cheese.pricePer100g} ₴ <span className="text-[9px] opacity-40 ml-1">/ 100g</span>
            </motion.div>

        </motion.div>
    );
};

export default CheeseCard;
