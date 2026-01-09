import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Heart,
  Database,
  ChefHat,
  Plus,
  Settings2,
  ArrowRight,
  User,
  LogOut,
  Info,
  Sparkles,
  Loader2,
  Bookmark,
  Hexagon
} from 'lucide-react';
import { Cheese, UserPreferences, Recommendation, AppView } from './types';
import { CheeseAPI } from './services/api';
import { FromagerService } from './services/sommelierService';
import CheeseCard from './components/CheeseCard';
import PreferenceManager from './components/PreferenceManager';
import CheeseModal from './components/WineModal';
import AddCheeseModal from './components/AddWineModal';
import PairingAssistant from './components/PairingAssistant';
import CheeseTable from './components/CheeseTable';
import ReplacementModal from './components/ReplacementModal';
import { RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('expert');
  const [cheeses, setCheeses] = useState<Cheese[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [preferences, setPreferences] = useState<UserPreferences>({
    likedTypes: [],
    dislikedTypes: [],
    preferredMilk: [],
    dislikedMilk: [],
    priceRange: [0, 500],
    minAging: 0,
    favoriteNotes: ['Вершковий', 'Горіховий'],
    dislikedNotes: [],
    preferredIntensity: 3,
  });

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [selectedCheeseId, setSelectedCheeseId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('cheeseexpert_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [replacingCheeseId, setReplacingCheeseId] = useState<string | null>(null);

  const fromager = useMemo(() => new FromagerService(), []);

  useEffect(() => {
    const loadCheeses = async () => {
      try {
        setDataLoading(true);
        setDataError(null);
        const data = await CheeseAPI.getAllCheeses();
        setCheeses(data);
      } catch (error) {
        console.error('Failed to load cheeses:', error);
        setDataError(error instanceof Error ? error.message : 'Failed to connect to fromagerie server');
      } finally {
        setDataLoading(false);
      }
    };
    loadCheeses();
  }, []);

  useEffect(() => {
    localStorage.setItem('cheeseexpert_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchRecommendations = useCallback(() => {
    setRecommendLoading(true);
    if (!hasAnalyzed) setHasAnalyzed(true);
    setTimeout(() => {
      const recs = fromager.getRecommendations(cheeses, preferences, rejectedIds);
      setRecommendations(recs.slice(0, 5));
      setRecommendLoading(false);
    }, 1200);
  }, [cheeses, preferences, fromager, hasAnalyzed, rejectedIds]);

  const updateCheese = async (updatedWines: Cheese[]) => {
    try {
      for (const c of updatedWines) {
        await CheeseAPI.updateCheese(c.id, c);
      }
      const data = await CheeseAPI.getAllCheeses();
      setCheeses(data);
    } catch (error) {
      console.error('Failed to update cheese:', error);
    }
  };

  const addCheese = async (newCheese: Cheese) => {
    try {
      await CheeseAPI.addCheese(newCheese);
      const updated = await CheeseAPI.getAllCheeses();
      setCheeses(updated);
      setIsAddModalOpen(false);
    } catch (error) {
      alert('Помилка реєстрації продукту');
    }
  };

  const selectedCheese = useMemo(() => cheeses.find(c => c.id === selectedCheeseId), [cheeses, selectedCheeseId]);

  const categories = [
    { name: 'Тверді та витримані', filter: (c: Cheese) => c.type === 'Hard', icon: '⛰️' },
    { name: 'М\'які та кремові', filter: (c: Cheese) => c.type === 'Soft-Ripened' || c.type === 'Fresh', icon: '☁️' },
    { name: 'З благородною пліснявою', filter: (c: Cheese) => c.type === 'Blue', icon: '🏺' },
    { name: 'Миті та пікантні', filter: (c: Cheese) => c.type === 'Washed-Rind' || c.type === 'Semi-Soft', icon: '🧀' },
  ];

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-artisan-dark flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="text-artisan-accent"
        >
          <Hexagon size={64} strokeWidth={1} />
        </motion.div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif italic text-white/80">Відчиняємо льох...</h2>
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20">Preparing the artisan database</p>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-artisan-dark flex flex-col items-center justify-center p-10">
        <div className="bg-red-950/20 border border-red-500/20 p-12 rounded-[3rem] text-center max-w-lg space-y-6">
          <div className="text-red-500 flex justify-center"><Info size={48} /></div>
          <h2 className="text-3xl font-serif text-white">Сталася прикра помилка</h2>
          <p className="text-white/40 font-medium leading-relaxed">{dataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all"
          >
            Спробувати ще раз
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-artisan-cream flex overflow-hidden">
      {/* SIDEBAR RIBBON */}
      <nav className="w-20 md:w-24 shrink-0 border-r border-white/[0.03] flex flex-col items-center py-10 gap-12 relative z-50 glass-panel">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="bg-artisan-accent p-4 rounded-3xl text-artisan-dark shadow-2xl shadow-artisan-accent/20 cursor-pointer mb-4"
          onClick={() => setView('expert')}
        >
          <ChefHat size={32} strokeWidth={2.5} />
        </motion.div>

        <div className="flex flex-col gap-8">
          {[
            { id: 'expert', icon: Search, label: 'Fromager' },
            { id: 'database', icon: Database, label: 'Архів' },
            { id: 'favorites', icon: Heart, label: 'Обране' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setView(btn.id as AppView)}
              className={`p-5 rounded-[1.5rem] transition-all relative group ${view === btn.id ? 'bg-artisan-accent/10 text-artisan-accent' : 'text-white/20 hover:text-white/60'}`}
            >
              <btn.icon size={24} strokeWidth={view === btn.id ? 2.5 : 2} />
              <div className="absolute left-full ml-5 px-4 py-2 bg-artisan-accent text-artisan-dark text-[10px] font-black rounded-xl opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap z-50 pointer-events-none uppercase tracking-widest shadow-2xl">
                {btn.label}
              </div>
              {view === btn.id && (
                <motion.div layoutId="nav-active" className="absolute inset-0 border-2 border-artisan-accent/30 rounded-[1.5rem]" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-8 items-center">
          <button onClick={() => setIsAddModalOpen(true)} className="p-5 rounded-full text-white/20 hover:text-artisan-accent hover:bg-white/5 transition-all">
            <Plus size={24} />
          </button>
          <div className="p-1 rounded-full border-2 border-white/5 hover:border-artisan-accent/30 transition-all cursor-pointer">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User" className="w-10 h-10 rounded-full bg-artisan-surface grayscale group-hover:grayscale-0 transition-all" />
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow overflow-y-auto artisan-scroll relative pb-32">
        {/* TOP STATUS BAR */}
        <header className="px-12 py-8 flex justify-between items-center sticky top-0 z-40 bg-artisan-dark/40 backdrop-blur-xl border-b border-white/[0.03]">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Edition MMXXVI</span>
            <div className="h-4 w-px bg-white/5"></div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest">Cellar Sync: OK</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Temperature</p>
              <p className="font-serif italic text-sm text-artisan-accent">12.4°C / 84% RH</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Vault Status</p>
              <p className="font-serif italic text-sm text-white">{cheeses.length} Items</p>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="px-8 md:px-16 pt-12"
          >
            {view === 'expert' && (
              <div className="space-y-24">
                {/* HERO EXPERT SECTION */}
                <section className="flex flex-col xl:flex-row gap-20 items-stretch">
                  <div className="w-full xl:w-[480px] shrink-0">
                    <div className="mb-12 relative">
                      <Bookmark className="absolute -left-12 top-0 text-artisan-accent/20" size={48} />
                      <h2 className="text-5xl font-serif text-white leading-[1.1] uppercase tracking-tighter">
                        Персональний <br />
                        <span className="text-artisan-accent italic text-glow">Fromager</span>
                      </h2>
                      <p className="text-white/40 text-xs font-medium mt-6 max-w-xs leading-relaxed uppercase tracking-widest">
                        Алгоритмічне поєднання традицій та ваших вишуканих преференцій
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 bg-artisan-accent/5 blur-[80px] -z-10 rounded-full"></div>
                      <PreferenceManager preferences={preferences} onChange={setPreferences} />
                    </div>

                    <button
                      onClick={fetchRecommendations}
                      disabled={recommendLoading}
                      className="w-full mt-10 bg-artisan-accent text-artisan-dark py-7 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-artisan shadow-accent"
                    >
                      {recommendLoading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={20} />}
                      Аналізувати Смакову Палітру
                    </button>
                  </div>

                  <div className="flex-grow w-full h-full min-h-[600px]">
                    <AnimatePresence mode="wait">
                      {hasAnalyzed ? (
                        <motion.div
                          key="recs"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-12"
                        >
                          <div className="flex justify-between items-center glass-panel p-10 rounded-[4rem] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
                              <Hexagon size={160} />
                            </div>
                            <div className="relative z-10">
                              <h3 className="text-white text-2xl font-serif italic mb-2 tracking-tight">Ваш гармонійний вибір</h3>
                              <p className="text-[10px] font-black text-artisan-accent uppercase tracking-[0.3em]">Found 5 optimized matches for your profile</p>
                            </div>
                            <div className="hidden md:flex flex-col items-center gap-2 relative z-10">
                              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Marco" className="w-20 h-20 rounded-full border-2 border-artisan-accent/20 bg-white/5 p-1" alt="Marco" />
                              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Curator Marco</span>
                            </div>
                          </div>

                          <div className="flex overflow-x-auto artisan-scroll pt-12 pb-12 gap-10 -mx-8 px-8 items-center">
                            {recommendations.map((rec, idx) => {
                              const cheese = cheeses.find(c => c.id === rec.cheeseId);
                              if (!cheese) return null;
                              return (
                                <motion.div
                                  key={cheese.id}
                                  whileHover={{ zIndex: 50 }}
                                  className="relative shrink-0"
                                >
                                  <CheeseCard
                                    cheese={cheese}
                                    onClick={() => setSelectedCheeseId(cheese.id)}
                                    onReplace={(e) => { e.stopPropagation(); setReplacingCheeseId(cheese.id); }}
                                  />
                                </motion.div>
                              );
                            })}
                            <div className="w-80 shrink-0 flex items-center justify-center border-4 border-dashed border-white/5 rounded-full aspect-square text-white/10 hover:text-artisan-accent hover:border-artisan-accent transition-all cursor-pointer group">
                              <div className="flex flex-col items-center gap-4">
                                <ArrowRight size={48} className="group-hover:translate-x-4 transition-transform" />
                                <span className="text-[9px] font-black uppercase tracking-widest">More results</span>
                              </div>
                            </div>
                          </div>

                          {selectedCheese && <PairingAssistant cheese={selectedCheese} />}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="h-full flex flex-col items-center justify-center p-20 border-2 border-dashed border-white/[0.03] rounded-[5rem] text-center text-white/5 bg-white/[0.01]"
                        >
                          <div className="bg-white/[0.02] p-16 rounded-full mb-10 relative">
                            <div className="absolute inset-0 bg-artisan-accent/5 blur-[40px] rounded-full"></div>
                            <Settings2 size={100} strokeWidth={0.5} className="relative z-10" />
                          </div>
                          <h3 className="text-3xl font-serif uppercase tracking-widest opacity-40 mb-6">Очікування налаштувань</h3>
                          <p className="text-[10px] uppercase tracking-[0.5em] font-black text-white/10 max-w-sm leading-loose">
                            Підготуйте ваші вподобання ліворуч, щоб наш ШІ-Fromager міг просканувати глибини льоху
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </section>

                {/* HORIZONTAL CATEGORIES */}
                <section className="pt-32 border-t border-white/[0.03]">
                  <div className="flex items-center gap-10 mb-20">
                    <h2 className="text-4xl font-serif text-white uppercase italic tracking-tighter">Експозиція Колекції</h2>
                    <div className="flex-grow h-px bg-gradient-to-r from-white/10 to-transparent"></div>
                  </div>

                  <div className="space-y-32">
                    {categories.map((cat, idx) => (
                      <div key={idx} className="space-y-12">
                        <div className="flex justify-between items-end border-b border-white/[0.05] pb-6">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl">{cat.icon}</span>
                            <div>
                              <h4 className="text-2xl font-serif italic text-white tracking-tight uppercase">{cat.name}</h4>
                              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">Found {cheeses.filter(cat.filter).length} specimens</p>
                            </div>
                          </div>
                          <button className="text-[10px] font-black uppercase text-artisan-accent tracking-widest flex items-center gap-3 hover:gap-6 transition-all group">
                            Відкрити весь список <ArrowRight size={16} className="group-hover:scale-x-125 transition-transform" />
                          </button>
                        </div>
                        <div className="flex overflow-x-auto artisan-scroll pb-12 gap-10 -mx-8 px-8">
                          {cheeses.filter(cat.filter).slice(0, 10).map(cheese => (
                            <CheeseCard key={cheese.id} cheese={cheese} onClick={() => setSelectedCheeseId(cheese.id)} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {view === 'favorites' && (
              <div className="space-y-16 mt-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="bg-artisan-accent/10 p-8 rounded-5xl text-artisan-accent border border-artisan-accent/20">
                      <Heart size={48} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-5xl font-serif uppercase text-white italic tracking-tighter text-glow">Особиста Скарбниця</h2>
                      <p className="text-white/20 text-[11px] font-black uppercase tracking-[0.4em] mt-3">Колекція з {favorites.length} поцінованих шедеврів</p>
                    </div>
                  </div>
                  <div className="h-px flex-grow mx-20 bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>

                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-12">
                    {cheeses.filter(c => favorites.includes(c.id)).map(cheese => (
                      <CheeseCard key={cheese.id} cheese={cheese} onClick={() => setSelectedCheeseId(cheese.id)} />
                    ))}
                  </div>
                ) : (
                  <div className="py-40 glass-panel rounded-[5rem] text-center border-dashed border-white/5 wood-texture">
                    <Heart size={80} className="mx-auto text-white/[0.03] mb-8" strokeWidth={0.5} />
                    <h3 className="text-2xl font-serif text-white/20 uppercase tracking-[0.2em] italic mb-8">Скарбниця наразі порожня</h3>
                    <button onClick={() => setView('expert')} className="px-12 py-5 bg-artisan-accent text-artisan-dark rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-accent">Почати пошук скарбів</button>
                  </div>
                )}
              </div>
            )}

            {view === 'database' && (
              <div className="mt-12 space-y-16">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-artisan-accent text-[10px] font-black uppercase tracking-[0.4em]">Full Registry</span>
                      <div className="w-12 h-px bg-artisan-accent/30"></div>
                    </div>
                    <h2 className="text-5xl font-serif uppercase text-white italic tracking-tighter">Реєстр Цеху</h2>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mt-2">{cheeses.length} доступних витворів мистецтва у льоху</p>
                  </div>
                  <button onClick={() => setIsAddModalOpen(true)} className="bg-artisan-cream text-artisan-dark px-10 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-artisan">
                    <Plus size={20} strokeWidth={3} /> Реєстрація сорту
                  </button>
                </div>

                <div className="glass-panel rounded-[4rem] overflow-hidden border-white/[0.05] shadow-2xl">
                  <CheeseTable wines={cheeses} onUpdate={updateCheese} onSelect={(id) => setSelectedCheeseId(id)} title="Архів Льоху" />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedCheeseId && selectedCheese && (
          <CheeseModal
            cheese={selectedCheese}
            isOpen={!!selectedCheeseId}
            onClose={() => setSelectedCheeseId(null)}
            isFavorite={favorites.includes(selectedCheese.id)}
            onToggleFavorite={(id) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {replacingCheeseId && cheeses.find(c => c.id === replacingCheeseId) && (
          <ReplacementModal
            isOpen={!!replacingCheeseId}
            onClose={() => setReplacingCheeseId(null)}
            originalWine={cheeses.find(c => c.id === replacingCheeseId)!}
            alternatives={fromager.getRecommendations(cheeses, preferences, [replacingCheeseId, ...recommendations.map(r => r.cheeseId)]).slice(0, 3)}
            allWines={cheeses}
            onSelect={(newId) => {
              setRecommendations(prev => prev.map(r => r.cheeseId === replacingCheeseId ? { cheeseId: newId, explanation: 'Цей варіант підібрано як альтернативу.', score: 85 } : r));
              setRejectedIds(prev => [...prev, replacingCheeseId]);
              setReplacingCheeseId(null);
            }}
            onAutoSelect={() => {
              const alternative = fromager.getRecommendations(cheeses, preferences, [replacingCheeseId, ...recommendations.map(r => r.cheeseId)])[0];
              if (alternative) {
                setRecommendations(prev => prev.map(r => r.cheeseId === replacingCheeseId ? alternative : r));
                setRejectedIds(prev => [...prev, replacingCheeseId]);
              }
              setReplacingCheeseId(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddCheeseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addCheese} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
