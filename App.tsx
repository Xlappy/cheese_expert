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
  Loader2
} from 'lucide-react';
import { Cheese, UserPreferences, Recommendation, AppView } from './types';
import { CheeseAPI } from './services/api';
import { FromagerService } from './services/sommelierService';
import CheeseCard from './components/CheeseCard';
import PreferenceManager from './components/PreferenceManager';
import CheeseModal from './components/WineModal';
import AddCheeseModal from './components/AddWineModal';
import PairingAssistant from './components/PairingAssistant';
import CheeseTable from './components/WineTable';

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
      const recs = fromager.getRecommendations(cheeses, preferences);
      setRecommendations(recs.slice(0, 5));
      setRecommendLoading(false);
    }, 1200);
  }, [cheeses, preferences, fromager, hasAnalyzed]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
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
    { name: 'Тверді сири', filter: (c: Cheese) => c.type === 'Hard' },
    { name: 'М\'які та кремові', filter: (c: Cheese) => c.type === 'Soft-Ripened' || c.type === 'Fresh' },
    { name: 'З пліснявою', filter: (c: Cheese) => c.type === 'Blue' },
    { name: 'Миті та пікантні', filter: (c: Cheese) => c.type === 'Washed-Rind' || c.type === 'Semi-Soft' },
  ];

  return (
    <div className="min-h-screen bg-artisan-dark text-artisan-cream flex overflow-hidden">
      {/* SIDEBAR RIBBON */}
      <nav className="w-16 md:w-20 shrink-0 border-r border-white/5 flex flex-col items-center py-8 gap-10 relative z-50 bg-artisan-dark paper-texture">
        <div className="bg-artisan-accent p-3 rounded-2xl text-artisan-dark shadow-lg shadow-artisan-accent/20 cursor-pointer" onClick={() => setView('expert')}>
          <ChefHat size={28} strokeWidth={2.5} />
        </div>

        <div className="flex flex-col gap-6">
          {[
            { id: 'expert', icon: Search, label: 'Підбір' },
            { id: 'database', icon: Database, label: 'Погріб' },
            { id: 'favorites', icon: Heart, label: 'Скарби' },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setView(btn.id as AppView)}
              className={`p-4 rounded-2xl transition-all relative group ${view === btn.id ? 'bg-white/10 text-artisan-accent' : 'text-stone-500 hover:text-white'}`}
            >
              <btn.icon size={22} />
              <span className="absolute left-full ml-4 px-3 py-1 bg-artisan-accent text-artisan-dark text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none uppercase tracking-widest shadow-xl">
                {btn.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-6">
          <button onClick={() => setIsAddModalOpen(true)} className="p-4 rounded-2xl text-stone-500 hover:text-artisan-accent transition-colors">
            <Plus size={22} />
          </button>
          <div className="w-10 h-10 rounded-full bg-stone-800 border border-white/10 overflow-hidden cursor-pointer">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User" />
          </div>
        </div>
      </nav>

      <main className="flex-grow relative overflow-y-auto artisan-scroll h-screen">
        {/* Header Decor */}
        <header className="px-10 pt-12 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-serif font-black tracking-tighter text-white uppercase italic">Modern Artisan</h1>
            <p className="text-artisan-accent text-[10px] font-black tracking-[0.4em] uppercase mt-2 opacity-60">Handcrafted Selection • 1892 Tradition</p>
          </div>

          <div className="hidden lg:flex items-center gap-4 bg-artisan-surface/50 border border-white/5 py-2 px-6 rounded-3xl paper-texture">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-white/40 uppercase">Температура льоху</span>
              <span className="text-artisan-accent font-serif text-lg">12.5°C</span>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-white/40 uppercase">Всього сортів</span>
              <span className="text-artisan-cream font-serif text-lg">{cheeses.length}</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {dataLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[60vh] text-artisan-accent"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                <ChefHat size={60} strokeWidth={1} />
              </motion.div>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.3em]">Відкриваємо двері льоху...</p>
            </motion.div>
          ) : dataError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="mx-10 mt-12 p-20 bg-red-950/20 border-2 border-red-500/20 rounded-[4rem] text-center paper-texture"
            >
              <Info size={48} className="text-red-500 mx-auto mb-6" />
              <h2 className="text-2xl font-serif mb-4 text-white uppercase tracking-wider">Проблеми з підключенням</h2>
              <p className="text-red-400 max-w-md mx-auto mb-10 text-sm font-sans font-bold">{dataError}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-red-400 transition-all shadow-2xl"
              >
                Спробувати зайти знову
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-10 pb-32"
            >
              {view === 'expert' && (
                <div className="space-y-16 mt-8">
                  {/* HERO EXPERT SECTION */}
                  <section className="flex flex-col xl:flex-row gap-12 items-start">
                    <div className="w-full xl:w-[450px] shrink-0">
                      <div className="mb-10">
                        <h2 className="text-4xl font-serif text-artisan-accent mt-2 leading-tight uppercase">Персональний <br /> Fromager</h2>
                        <div className="w-20 h-1 bg-artisan-accent mt-6"></div>
                      </div>
                      <PreferenceManager preferences={preferences} onChange={setPreferences} />
                      <button
                        onClick={fetchRecommendations}
                        disabled={recommendLoading}
                        className="w-full mt-8 bg-artisan-accent text-artisan-dark py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {recommendLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={18} />}
                        Запустити аналіз смаку
                      </button>
                    </div>

                    <div className="flex-grow w-full">
                      {hasAnalyzed ? (
                        <div className="space-y-10">
                          <div className="flex justify-between items-center bg-artisan-surface/30 p-8 rounded-[3rem] border border-white/5">
                            <div>
                              <h3 className="text-artisan-cream text-lg font-serif">Результати відбору за Логікою Смаку</h3>
                              <p className="text-[10px] font-black text-artisan-accent uppercase tracking-widest mt-1">Found 5 matches in current cellar</p>
                            </div>
                            <div className="hidden sm:block">
                              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Marco" className="w-16 h-16 grayscale opacity-50" alt="Marco" />
                            </div>
                          </div>

                          <div className="flex overflow-x-auto artisan-scroll pb-10 gap-8 -mx-10 px-10">
                            {recommendations.map((rec) => {
                              const cheese = cheeses.find(c => c.id === rec.cheeseId);
                              if (!cheese) return null;
                              return <CheeseCard key={cheese.id} cheese={cheese} onClick={() => setSelectedCheeseId(cheese.id)} />;
                            })}
                            <div className="w-72 shrink-0 flex items-center justify-center border-4 border-dashed border-white/5 rounded-full aspect-square text-white/10 hover:text-artisan-accent hover:border-artisan-accent transition-all cursor-pointer">
                              <ArrowRight size={48} />
                            </div>
                          </div>

                          {selectedCheese && <PairingAssistant cheese={selectedCheese} />}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-20 border-2 border-dashed border-white/5 rounded-[4rem] text-center text-white/10">
                          <div className="bg-white/5 p-10 rounded-full mb-8">
                            <Settings2 size={80} strokeWidth={0.5} />
                          </div>
                          <h3 className="text-2xl font-serif uppercase tracking-widest opacity-30">Налаштуй палітру преференцій</h3>
                          <p className="text-xs uppercase tracking-[0.3em] font-black mt-4 max-w-sm">Наш ШІ Fromager готовий підібрати ідеальну головку сиру саме для тебе</p>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* HORIZONTAL CATEGORIES */}
                  <div className="pt-20 border-t border-white/5">
                    <h2 className="text-3xl font-serif text-white mb-12 uppercase tracking-tight">Прогулянка Льохом</h2>

                    <div className="space-y-24">
                      {categories.map((cat, idx) => (
                        <div key={idx} className="space-y-8">
                          <div className="flex justify-between items-end border-b border-white/5 pb-4">
                            <h4 className="text-xl font-serif italic text-white/50">{cat.name}</h4>
                            <button className="text-[10px] font-black uppercase text-artisan-accent tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                              Переглянути всі <ArrowRight size={14} />
                            </button>
                          </div>
                          <div className="flex overflow-x-auto artisan-scroll pb-6 gap-8 -mx-10 px-10">
                            {cheeses.filter(cat.filter).slice(0, 10).map(cheese => (
                              <CheeseCard key={cheese.id} cheese={cheese} onClick={() => setSelectedCheeseId(cheese.id)} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {view === 'favorites' && (
                <div className="space-y-12 mt-12">
                  <div className="flex items-center gap-6">
                    <div className="bg-artisan-accent/20 p-6 rounded-[2.5rem] text-artisan-accent">
                      <Heart size={40} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-serif uppercase text-white">Твої Скарби</h2>
                      <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest mt-1">{favorites.length} поцінованих екземплярів</p>
                    </div>
                  </div>

                  {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                      {cheeses.filter(c => favorites.includes(c.id)).map(cheese => (
                        <CheeseCard key={cheese.id} cheese={cheese} onClick={() => setSelectedCheeseId(cheese.id)} />
                      ))}
                    </div>
                  ) : (
                    <div className="p-32 bg-artisan-surface/20 rounded-[4rem] text-center border border-dashed border-white/5">
                      <Heart size={64} className="mx-auto text-white/5 mb-6" />
                      <h3 className="text-xl font-serif text-white/20 uppercase tracking-widest italic">Ще немає обраних сирів</h3>
                      <button onClick={() => setView('expert')} className="mt-8 text-artisan-accent text-xs font-black uppercase tracking-widest hover:underline">Розпочати пошук →</button>
                    </div>
                  )}
                </div>
              )}

              {view === 'database' && (
                <div className="mt-12">
                  <div className="flex justify-between items-end mb-12">
                    <div>
                      <h2 className="text-3xl font-serif uppercase text-white">Реєстр Цеху</h2>
                      <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest mt-1">Повний список доступних сортів</p>
                    </div>
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-artisan-cream text-artisan-dark px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 active:scale-95 transition-all">
                      <Plus size={18} /> Додати новий сорт
                    </button>
                  </div>

                  <div className="bg-artisan-surface/30 rounded-[3rem] border border-white/5 overflow-hidden paper-texture">
                    {/* Using the updated Table component with Artisan theme would be here */}
                    <CheeseTable wines={cheeses} onUpdate={fetchRecommendations} title="Архів Льоху" />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER RIBBON */}
      <footer className="fixed bottom-6 right-6 flex items-center gap-4 bg-artisan-dark/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl z-[60] shadow-2xl">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${!dataError ? 'bg-artisan-olive' : 'bg-red-500'} animate-pulse`}></div>
          <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Fromager Engine v2.0</span>
        </div>
        <div className="w-px h-4 bg-white/10 mx-2"></div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-artisan-accent italic animate-fadeIn">Deterministic Full-Stack Edition</span>
      </footer>

      {/* MODALS */}
      {selectedCheese && (
        <CheeseModal
          wine={selectedCheese}
          isOpen={!!selectedCheeseId}
          onClose={() => setSelectedCheeseId(null)}
          isFavorite={favorites.includes(selectedCheese.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      <AddCheeseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addCheese} />
    </div>
  );
};


export default App;
