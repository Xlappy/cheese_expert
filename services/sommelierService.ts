
import { Cheese, UserPreferences, Recommendation } from "../types";

export class FromagerService {
  getRecommendations(
    cheeses: Cheese[], 
    preferences: UserPreferences,
    excludedIds: string[] = []
  ): Recommendation[] {
    const candidates = cheeses.filter(cheese => {
      // 1. Технічні виключення (вже вибрані або замінені)
      if (excludedIds.includes(cheese.id)) return false;
      
      // 2. СУВОРІ ФІЛЬТРИ ВИКЛЮЧЕННЯ (Exclusions)
      if (preferences.dislikedTypes.includes(cheese.type)) return false;
      if (preferences.dislikedMilk.includes(cheese.milk)) return false;
      
      const flavorStr = cheese.flavorProfile.toLowerCase();
      const hasDislikedNote = preferences.dislikedNotes.some(note => 
        flavorStr.includes(note.toLowerCase())
      );
      if (hasDislikedNote) return false;

      // 3. Фільтри діапазонів
      if (cheese.pricePer100g > preferences.priceRange[1]) return false;
      if (preferences.minAging && cheese.agingMonths < preferences.minAging) return false;
      
      return true;
    });

    const scoredCandidates = candidates.map(cheese => {
      let score = 0;
      const dataStr = `${cheese.flavorProfile} ${cheese.bestPairing} ${cheese.region} ${cheese.type} ${cheese.milk}`.toLowerCase();
      
      // Бонуси за вподобання
      preferences.likedTypes.forEach(t => {
        if (cheese.type === t) score += 40;
      });

      preferences.preferredMilk.forEach(m => {
        if (cheese.milk === m) score += 30;
      });

      preferences.favoriteNotes.forEach(note => {
        if (dataStr.includes(note.toLowerCase())) score += 25;
      });

      // Інтенсивність (чим ближче, тим краще)
      const intensityDiff = Math.abs(cheese.intensity - preferences.preferredIntensity);
      score += (5 - intensityDiff) * 15;

      // Пріоритет українським крафтовим сирам
      if (cheese.origin === 'Ukrainian') score += 10;

      return { cheese, score };
    });

    // Сортування за балами
    scoredCandidates.sort((a, b) => b.score - a.score);

    return scoredCandidates.map(item => ({
      cheeseId: item.cheese.id,
      explanation: this.generateExplanation(item.cheese, preferences, item.score),
      score: Math.min(100, Math.round(item.score))
    }));
  }

  private generateExplanation(cheese: Cheese, prefs: UserPreferences, score: number): string {
    const typeMap: any = { 'Hard': 'твердий', 'Blue': 'з пліснявою', 'Soft-Ripened': 'м’який', 'Fresh': 'свіжий' };
    const milkMap: any = { 'Cow': 'коров’ячого', 'Goat': 'козячого', 'Sheep': 'овечого', 'Buffalo': 'буйволячого' };
    
    let text = `Цей ${typeMap[cheese.type] || 'особливий'} сир з ${milkMap[cheese.milk]} молока ідеально підходить під ваш запит. `;
    text += `Він має ${cheese.intensity >= 4 ? 'потужний' : 'збалансований'} характер з нотами ${cheese.flavorProfile.toLowerCase()}. `;
    text += `Чудово пасує до: ${cheese.bestPairing.toLowerCase()}.`;
    return text;
  }
}
