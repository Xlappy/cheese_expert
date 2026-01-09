import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cheese } from '../types';
import { X, Heart, ShieldCheck, Info, MapPin, Gauge, Star, Quote, Award, Sparkles } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';

interface CheeseModalProps {
  cheese: Cheese;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const CheeseModal: React.FC<CheeseModalProps> = ({ cheese, isOpen, onClose, isFavorite, onToggleFavorite }) => {

  const radarData = [
    { subject: 'Сіль', A: cheese.saltiness * 20 },
    { subject: 'Гострота', A: cheese.pungency * 20 },
    { subject: 'Інтенсивність', A: cheese.intensity * 20 },
    { subject: 'Текстура', A: cheese.texture * 20 },
    { subject: 'Витримка', A: Math.min(cheese.agingMonths * 5, 100) },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 40, opacity: 0 }}
        className="relative bg-artisan-surface w-full max-w-6xl rounded-[4rem] shadow-5xl overflow-hidden max-h-[90vh] flex flex-col border border-white/[0.08] shadow-artisan"
      >
        {/* Top Glow Decor */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-artisan-accent to-transparent"></div>

        <div className="p-10 md:p-16 overflow-y-auto artisan-scroll relative paper-texture">
          {/* HEADER SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">

            {/* Left Column: Essential Detail */}
            <div className="space-y-16">
              <div className="space-y-8">
                <div className="flex items-center gap-4 text-artisan-accent font-black uppercase text-[10px] tracking-[0.4em]">
                  <Award size={20} className="text-glow" />
                  <span>Artisan Passport • Certified Grade</span>
                </div>

                <h2 className="text-6xl md:text-7xl font-serif font-black text-white leading-[0.85] uppercase tracking-tighter italic">
                  <span className="text-artisan-accent not-italic text-glow opacity-80 block mb-2 text-2xl tracking-[0.2em]">Cellar Registry</span>
                  {cheese.name}
                </h2>

                <div className="flex flex-wrap gap-5 items-center pt-4">
                  <div className="glass-panel px-6 py-4 rounded-[2rem] flex items-center gap-4 border-white/[0.05]">
                    <MapPin size={18} className="text-artisan-accent" />
                    <span className="text-xs font-black uppercase text-white/80 tracking-widest">{cheese.region || 'Artisan Region'}</span>
                  </div>
                  <div className="glass-panel px-6 py-4 rounded-[2rem] flex items-center gap-4 border-white/[0.05]">
                    <Gauge size={18} className="text-artisan-accent" />
                    <span className="text-xs font-black uppercase text-white/80 tracking-widest">{cheese.milk} Source</span>
                  </div>
                </div>
              </div>

              {/* FLAVOR BLOCK */}
              <div className="relative glass-card p-10 rounded-[3rem] overflow-hidden group">
                <Quote size={80} className="absolute -top-4 -right-4 text-white/[0.02] rotate-12" />
                <h4 className="text-[10px] font-black uppercase text-artisan-accent tracking-widest mb-8 flex items-center gap-3">
                  <Sparkles size={14} /> Смакова Експертиза
                </h4>
                <p className="text-3xl font-serif text-white italic leading-tight mb-12 tracking-tight">
                  "{cheese.flavorProfile}"
                </p>

                <div className="space-y-6">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/30">
                    <span>Ніжний / Soft</span>
                    <span>Твердий / Aged</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(cheese.texture / 5) * 100}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-artisan-accent rounded-full shadow-[0_0_20px_rgba(249,164,53,0.5)]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] block">Market Appraisal</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-serif font-black text-white italic leading-none">{cheese.pricePer100g}</span>
                    <span className="text-2xl text-artisan-accent font-black uppercase">₴<span className="text-xs opacity-40 ml-1">/ 100g</span></span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleFavorite(cheese.id)}
                  className={`h-24 w-24 rounded-full flex items-center justify-center transition-all shadow-2xl ${isFavorite ? 'bg-artisan-accent text-artisan-dark shadow-accent' : 'bg-white/5 text-white border border-white/10'}`}
                >
                  <Heart size={40} fill={isFavorite ? "currentColor" : "none"} strokeWidth={isFavorite ? 0 : 2} />
                </motion.button>
              </div>
            </div>

            {/* Right Column: Visual Registry */}
            <div className="bg-artisan-dark/40 p-12 md:p-16 rounded-[4.5rem] border border-white/[0.05] flex flex-col relative overflow-hidden wood-texture shadow-2xl">
              <div className="flex justify-between items-start mb-12 relative z-10">
                <div>
                  <h3 className="text-3xl font-serif text-white uppercase tracking-tighter italic">Аналітика Сорту</h3>
                  <p className="text-[10px] font-black text-artisan-accent uppercase tracking-[0.3em] mt-2">Laboratory Flavor Mapping</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-14 h-14 rounded-full border border-white/[0.08] flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow flex flex-col items-center justify-center relative z-10">
                <div className="w-full aspect-square max-w-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#ffffff08" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff30', fontSize: 9, fontWeight: 900, textTransform: 'uppercase' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Flavor"
                        dataKey="A"
                        stroke="#f9a435"
                        strokeWidth={3}
                        fill="#f9a435"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-16 grid grid-cols-2 gap-8 w-full">
                  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.04] text-center hover:bg-white/[0.05] transition-colors">
                    <span className="text-[9px] font-black uppercase text-artisan-accent tracking-[0.3em] block mb-4">Maturity Level</span>
                    <span className="text-3xl font-serif text-white italic">{cheese.agingMonths}m</span>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.04] text-center hover:bg-white/[0.05] transition-colors">
                    <span className="text-[9px] font-black uppercase text-artisan-accent tracking-[0.3em] block mb-4">Lipid Profile</span>
                    <span className="text-3xl font-serif text-white italic">{cheese.milk}</span>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 p-10 bg-artisan-accent rounded-[2.5rem] text-artisan-dark shadow-accent group"
              >
                <div className="flex items-center gap-3 mb-4 opacity-70">
                  <Info size={16} />
                  <h5 className="text-[10px] font-black uppercase tracking-[0.3em]">Perfect Pairing Ritual</h5>
                </div>
                <p className="text-2xl font-serif italic text-artisan-dark leading-tight group-hover:scale-[1.02] transition-transform origin-left">
                  "{cheese.bestPairing}"
                </p>
              </motion.div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheeseModal;
