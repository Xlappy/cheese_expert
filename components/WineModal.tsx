import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cheese } from '../types';
import { X, Heart, ShieldCheck, Info, MapPin, Gauge } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';

interface CheeseModalProps {
  wine: Cheese;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const CheeseModal: React.FC<CheeseModalProps> = ({ wine: cheese, isOpen, onClose, isFavorite, onToggleFavorite }) => {
  if (!isOpen) return null;

  const radarData = [
    { subject: 'Солоність', A: cheese.saltiness * 20 },
    { subject: 'Гострота', A: cheese.pungency * 20 },
    { subject: 'Інтенсивність', A: cheese.intensity * 20 },
    { subject: 'Текстура', A: cheese.texture * 20 },
    { subject: 'Витримка', A: Math.min(cheese.agingMonths * 5, 100) },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-artisan-dark/95 backdrop-blur-xl"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className="relative bg-artisan-surface w-full max-w-5xl rounded-[4rem] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-white/10 paper-texture"
      >
        {/* Top Header Decor */}
        <div className="h-4 bg-artisan-accent w-full"></div>

        <div className="p-10 md:p-16 overflow-y-auto custom-scrollbar artisan-scroll">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column: Portrait & Info */}
            <div className="space-y-12">
              <div>
                <div className="flex items-center gap-4 text-artisan-accent mb-6 font-black uppercase text-[10px] tracking-[0.3em]">
                  <ShieldCheck size={18} />
                  <span>Certified Artisan Quality</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-serif font-black text-white leading-[0.9] uppercase italic mb-6">
                  <span className="text-artisan-accent not-italic">Cellar</span><br />{cheese.name}
                </h2>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="bg-artisan-dark px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/5">
                    <MapPin size={16} className="text-artisan-accent" />
                    <span className="text-xs font-black uppercase text-white/70 tracking-widest">{cheese.region}</span>
                  </div>
                  <div className="bg-artisan-dark px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/5">
                    <Gauge size={16} className="text-artisan-accent" />
                    <span className="text-xs font-black uppercase text-white/70 tracking-widest">{cheese.milk} milk</span>
                  </div>
                </div>
              </div>

              <div className="bg-artisan-dark/50 p-8 rounded-[3rem] border border-white/5 relative overflow-hidden wood-texture">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Info size={120} />
                </div>
                <h4 className="text-[10px] font-black uppercase text-artisan-accent tracking-widest mb-6">Профіль смаку</h4>
                <p className="text-2xl font-serif text-artisan-cream italic leading-snug mb-8">
                  "{cheese.flavorProfile}"
                </p>
                <div className="space-y-4">
                  <h5 className="text-[9px] font-black uppercase text-white/30 tracking-widest">Текстурний реєстр (1-5)</h5>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase font-bold text-white/40">М'який</span>
                    <div className="flex-grow h-1 bg-white/5 rounded-full relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(cheese.texture / 5) * 100}%` }}
                        className="h-full bg-artisan-accent rounded-full shadow-[0_0_15px_rgba(235,155,52,0.5)]"
                      />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-white/40">Твердий</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-white/30 tracking-widest block mb-2">Ринкова оцінка</span>
                  <span className="text-5xl font-serif text-white">{cheese.pricePer100g} <span className="text-xl text-artisan-accent">₴/100г</span></span>
                </div>
                <button
                  onClick={() => onToggleFavorite(cheese.id)}
                  className={`h-20 w-20 rounded-full flex items-center justify-center transition-all ${isFavorite ? 'bg-artisan-accent text-artisan-dark' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                  <Heart size={32} fill={isFavorite ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            {/* Right Column: Visualization & Passport */}
            <div className="bg-artisan-dark p-10 md:p-14 rounded-[4rem] border border-white/10 flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-2xl font-serif text-white uppercase tracking-tighter italic">Паспорт виробу</h3>
                  <p className="text-[10px] font-black text-artisan-accent uppercase tracking-widest mt-1">Flavor Analysis Chart</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow flex flex-col items-center justify-center">
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="85%" data={radarData}>
                      <PolarGrid stroke="#ffffff10" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff60', fontSize: 10, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Flavor"
                        dataKey="A"
                        stroke="#eb9b34"
                        fill="#eb9b34"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-12 grid grid-cols-2 gap-8 w-full">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                    <span className="text-[9px] font-black uppercase text-artisan-accent tracking-[0.2em] block mb-3">Витримка</span>
                    <span className="text-2xl font-serif text-white">{cheese.agingMonths} міс.</span>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                    <span className="text-[9px] font-black uppercase text-artisan-accent tracking-[0.2em] block mb-3">Тип молозива</span>
                    <span className="text-2xl font-serif text-white">{cheese.milk}</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-artisan-accent rounded-3xl text-artisan-dark">
                <h5 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-60">Рекомендована пара</h5>
                <p className="text-lg font-serif italic text-artisan-dark leading-tight">
                  "{cheese.bestPairing}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheeseModal;
