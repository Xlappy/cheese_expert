
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Cheese, UserPreferences, Recommendation, AppView } from './types';
import { CheeseAPI } from './services/api';
import { FromagerService } from './services/sommelierService';
import CheeseTable from './components/WineTable';
import PreferenceManager from './components/PreferenceManager';
import CheeseModal from './components/WineModal';
import ReplacementModal from './components/ReplacementModal';
import AddCheeseModal from './components/AddWineModal';

type DatabaseSubView = 'soft_ua' | 'hard_ua' | 'fresh_ua' | 'import' | 'blue';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('expert');
  const [dbSubView, setDbSubView] = useState<DatabaseSubView>('soft_ua');
  const [cheeses, setCheeses] = useState<Cheese[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

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
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [selectedCheeseId, setSelectedCheeseId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('cheeseexpert_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Використовуємо тільки детермінований сервіс
  const fromager = useMemo(() => new FromagerService(), []);

  // Load cheeses from API on mount
  useEffect(() => {
    const loadCheeses = async () => {
      try {
        setDataLoading(true);
        setDataError(null);
        const data = await CheeseAPI.getAllCheeses();
        setCheeses(data);
      } catch (error) {
        console.error('Failed to load cheeses:', error);
        setDataError(error instanceof Error ? error.message : 'Failed to load data from server');
      } finally {
        setDataLoading(false);
      }
    };

    loadCheeses();
  }, []);

  useEffect(() => {
    localStorage.setItem('cheeseexpert_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchRecommendations = useCallback((excluded: string[] = []) => {
    setLoading(true);
    if (!hasAnalyzed) setHasAnalyzed(true);

    // Імітація обробки даних для кращого UX
    setTimeout(() => {
      const recs = fromager.getRecommendations(cheeses, preferences, excluded);
      setRecommendations(recs.slice(0, 3));
      setLoading(false);
    }, 400);
  }, [cheeses, preferences, fromager, hasAnalyzed]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const addCheese = async (newCheese: Cheese) => {
    try {
      await CheeseAPI.addCheese(newCheese);
      // Reload cheeses from server to ensure consistency
      const updatedCheeses = await CheeseAPI.getAllCheeses();
      setCheeses(updatedCheeses);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add cheese:', error);
      alert('Failed to add cheese: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const updateCheeseList = async (updatedCheeses: Cheese[]) => {
    try {
      // Update each cheese in the database
      for (const cheese of updatedCheeses) {
        await CheeseAPI.updateCheese(cheese.id, cheese);
      }
      // Reload from server
      const freshData = await CheeseAPI.getAllCheeses();
      setCheeses(freshData);
    } catch (error) {
      console.error('Failed to update cheeses:', error);
      alert('Failed to update cheeses: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const filteredDatabase = useMemo(() => {
    switch (dbSubView) {
      case 'soft_ua': return cheeses.filter(c => c.origin === 'Ukrainian' && (c.type === 'Soft-Ripened' || c.type === 'Washed-Rind'));
      case 'hard_ua': return cheeses.filter(c => c.origin === 'Ukrainian' && c.type === 'Hard');
      case 'fresh_ua': return cheeses.filter(c => c.origin === 'Ukrainian' && c.type === 'Fresh');
      case 'blue': return cheeses.filter(c => c.type === 'Blue');
      case 'import': return cheeses.filter(c => c.origin === 'Import' && c.type !== 'Blue');
      default: return cheeses;
    }
  }, [cheeses, dbSubView]);

  const getCheeseIcon = (type: string) => {
    switch (type) {
      case 'Blue': return '🧀';
      case 'Soft-Ripened': return '⚪';
      case 'Hard': return '🧱';
      case 'Fresh': return '🥛';
      case 'Washed-Rind': return '🟠';
      default: return '🧀';
    }
  };

  const selectedCheese = useMemo(() => cheeses.find(c => c.id === selectedCheeseId), [cheeses, selectedCheeseId]);
  const replacingCheese = useMemo(() => cheeses.find(c => c.id === replacingId), [cheeses, replacingId]);

  return (
    <div className="min-h-screen selection:bg-amber-100 pb-24 font-['Montserrat'] bg-[#FFFEFA]">
      <nav className="bg-white/95 backdrop-blur-2xl border-b border-amber-100 sticky top-0 z-[70] px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setView('expert'); setHasAnalyzed(false); setRecommendations([]); }}>
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg transition-all group-hover:scale-105">
              <span className="text-white font-black text-lg">C</span>
            </div>
            <div>
              <h1 className="text-md font-black text-stone-900 leading-tight tracking-tight">CHEESEEXPERT</h1>
              <p className="text-[8px] font-bold text-amber-600 uppercase tracking-wider">Rule-Based Expert System</p>
            </div>
          </div>
          <div className="flex bg-amber-50 p-1 rounded-lg">
            {[
              { id: 'expert', label: 'Підбір' },
              { id: 'database', label: 'Сиротека' },
              { id: 'favorites', label: `Колекція (${favorites.length})` },
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setView(btn.id as AppView)}
                className={`px-5 py-2 rounded-md text-[11px] font-bold uppercase tracking-wide transition-all ${view === btn.id ? 'bg-white text-amber-700 shadow-sm' : 'text-stone-500 hover:text-amber-600'
                  }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-6 px-6 relative">
        {dataLoading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
            <p className="text-stone-500 font-bold text-sm uppercase tracking-wider">Завантаження даних з сервера...</p>
          </div>
        )}

        {dataError && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center animate-fadeIn">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-black text-red-900 mb-2 uppercase">Помилка підключення</h3>
            <p className="text-red-700 mb-4">{dataError}</p>
            <p className="text-sm text-red-600 mb-4">Переконайтеся, що сервер запущено на порту 3003</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-red-700 transition-all"
            >
              Спробувати знову
            </button>
          </div>
        )}

        {!dataLoading && !dataError && (
          <>
            {view === 'favorites' && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-black text-stone-900 tracking-tight uppercase">Ваша Колекція</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cheeses.filter(c => favorites.includes(c.id)).map(cheese => (
                    <div key={cheese.id} onClick={() => setSelectedCheeseId(cheese.id)} className="bg-white p-8 rounded-[2rem] border border-amber-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-5xl">{getCheeseIcon(cheese.type)}</span>
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(cheese.id); }} className="text-xl">💛</button>
                      </div>
                      <h3 className="font-black text-xl text-stone-900 mb-1 leading-tight">{cheese.name}</h3>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{cheese.region} • {cheese.milk} milk</p>
                      <div className="mt-6 pt-4 border-t border-amber-50 flex justify-between items-center">
                        <span className="text-stone-900 font-black text-lg">{cheese.pricePer100g} ₴/100г</span>
                        <span className="text-[10px] font-black text-amber-700 uppercase">Деталі →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'database' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black text-stone-900 tracking-tight uppercase">Сиротека</h2>
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-stone-900 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-lg hover:bg-black transition-all">+ Додати сир</button>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1 p-1 bg-amber-50 rounded-xl border border-amber-100">
                    {[
                      { id: 'soft_ua', label: 'М’які UA' },
                      { id: 'hard_ua', label: 'Тверді UA' },
                      { id: 'fresh_ua', label: 'Свіжі UA' },
                      { id: 'blue', label: 'Блакитні' },
                      { id: 'import', label: 'Імпорт' }
                    ].map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setDbSubView(sub.id as DatabaseSubView)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${dbSubView === sub.id ? 'bg-amber-500 text-white shadow-md' : 'text-stone-500 hover:bg-amber-100'
                          }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
                <CheeseTable wines={filteredDatabase} onUpdate={updateCheeseList} title={`База даних: ${dbSubView.replace('_', ' ').toUpperCase()}`} />
              </div>
            )}

            {view === 'expert' && (
              <div className="relative">
                <div className={`flex flex-col lg:flex-row gap-8 transition-all duration-700 ${hasAnalyzed ? 'items-start' : 'items-center justify-center pt-12 md:pt-20'}`}>
                  <div className={`transition-all duration-700 ${hasAnalyzed ? 'lg:w-[320px] w-full shrink-0 sticky top-24' : 'max-w-2xl w-full text-center'}`}>
                    {!hasAnalyzed && (
                      <div className="mb-10 animate-fadeIn">
                        <h2 className="text-4xl md:text-5xl font-black text-stone-900 tracking-tighter mb-4 leading-tight uppercase">ЛОГІЧНИЙ <br /><span className="text-amber-500">ПІДБІР СИРУ</span></h2>
                        <p className="text-stone-500 text-base font-medium max-w-md mx-auto leading-relaxed">Детермінована експертна система для точного гастрономічного вибору.</p>
                      </div>
                    )}
                    <PreferenceManager preferences={preferences} onChange={setPreferences} compact={!hasAnalyzed} />
                    <div className={`mt-8 ${!hasAnalyzed ? 'flex justify-center' : ''}`}>
                      <button onClick={() => fetchRecommendations()} disabled={loading} className={`bg-amber-500 text-white font-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${hasAnalyzed ? 'w-full py-4 rounded-2xl text-xs' : 'px-16 py-6 rounded-[2.5rem] text-lg'} ${loading ? 'opacity-50 cursor-wait' : 'hover:bg-amber-600'}`}>
                        {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : null}
                        <span className="uppercase tracking-widest">{hasAnalyzed ? 'Перерахувати' : 'Запустити аналіз'}</span>
                      </button>
                    </div>
                  </div>

                  <div className={`flex-grow w-full transition-all duration-1000 ${hasAnalyzed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none absolute invisible'}`}>
                    <div className="mb-6 flex justify-between items-center">
                      <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight">РЕЗУЛЬТАТИ АЛГОРИТМУ</h3>
                      <span className="text-[9px] font-bold text-amber-600 uppercase border border-amber-200 px-3 py-1 rounded-full">DETERMINISTIC ENGINE</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {recommendations.map((rec) => {
                        const cheese = cheeses.find(c => c.id === rec.cheeseId);
                        if (!cheese) return null;
                        return (
                          <div key={cheese.id} className="bg-white rounded-[2.5rem] border border-amber-50 flex flex-col overflow-hidden transition-all hover:shadow-xl animate-fadeIn group h-full">
                            <div className={`p-8 pb-5 relative ${cheese.type === 'Blue' ? 'bg-blue-50/20' : cheese.type === 'Hard' ? 'bg-amber-50/20' : 'bg-stone-50/20'}`}>
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-4xl">{getCheeseIcon(cheese.type)}</span>
                                <div className="text-right">
                                  <div className="text-lg font-black text-stone-900">{cheese.pricePer100g} ₴</div>
                                  <div className="text-[8px] font-bold text-amber-700 uppercase tracking-wider">SCORE: {rec.score}%</div>
                                </div>
                              </div>
                              <h3 className="font-black text-xl text-stone-900 mb-1 leading-tight uppercase line-clamp-2 min-h-[3rem]">{cheese.name}</h3>
                              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                                <span>{cheese.region}</span>
                                <span className="w-1 h-1 bg-amber-200 rounded-full my-auto"></span>
                                <span>{cheese.milk} milk</span>
                              </div>
                            </div>
                            <div className="p-8 pt-5 flex-grow flex flex-col">
                              <div className="bg-stone-50/50 p-5 rounded-2xl border border-stone-100 mb-6 flex-grow">
                                <p className="text-[13px] text-stone-600 leading-relaxed font-medium italic line-clamp-4">"{rec.explanation}"</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-bold text-stone-300 uppercase tracking-widest mb-1.5">Інтенсивність</span>
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(b => <div key={b} className={`h-1 flex-1 rounded-full ${cheese.intensity >= b ? 'bg-amber-500' : 'bg-stone-100'}`}></div>)}
                                  </div>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-bold text-stone-300 uppercase tracking-widest mb-1.5">Текстура</span>
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(b => <div key={b} className={`h-1 flex-1 rounded-full ${cheese.texture >= b ? 'bg-stone-600' : 'bg-stone-100'}`}></div>)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-3 mt-auto pt-4 border-t border-amber-50">
                                <button onClick={() => setSelectedCheeseId(cheese.id)} className="flex-1 bg-amber-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-amber-600 transition-all">Докладно</button>
                                <button onClick={() => setReplacingId(cheese.id)} className="flex-1 bg-white text-stone-900 border border-stone-200 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider hover:bg-stone-50 transition-all">Замінити</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 py-4 px-10 bg-white/80 backdrop-blur-xl border-t border-amber-100 z-[60]">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[9px] font-bold text-amber-700 uppercase tracking-widest">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${!dataError ? 'bg-green-500' : 'bg-red-500'}`}></span>
              RULE ENGINE v2.5 STABLE
            </span>
            <span className="opacity-30 hidden sm:inline">
              {!dataError ? `DATABASE: ${cheeses.length} CHEESES` : 'DATABASE OFFLINE'}
            </span>
          </div>
          <div className="flex items-center gap-2 italic lowercase font-medium text-stone-400">
            cheeseexpert <span className="text-[8px] not-italic uppercase font-black text-amber-600">full-stack edition</span>
          </div>
        </div>
      </footer>

      {selectedCheese && (
        <CheeseModal wine={selectedCheese} isOpen={!!selectedCheeseId} onClose={() => setSelectedCheeseId(null)} isFavorite={favorites.includes(selectedCheese.id)} onToggleFavorite={toggleFavorite} />
      )}
      {replacingCheese && (
        <ReplacementModal isOpen={!!replacingId} onClose={() => setReplacingId(null)} originalWine={replacingCheese} alternatives={recommendations} allWines={cheeses} onSelect={(id) => { setReplacingId(null); setSelectedCheeseId(id); }} onAutoSelect={() => {
          // Логіка автозаміни: виключаємо поточний ID і перераховуємо
          fetchRecommendations([replacingId]);
          setReplacingId(null);
        }} />
      )}
      <AddCheeseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addCheese} />
    </div>
  );
};

export default App;
