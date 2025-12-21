
import { Cheese, UserPreferences, Recommendation } from "../types";

export class FromagerService {
  /**
   * Головний метод підбору. Працює суто на математичних вагах та логічних правилах.
   * Слобність алгоритму: O(N), де N - кількість сирів у базі.
   */
  getRecommendations(
    cheeses: Cheese[], 
    preferences: UserPreferences,
    excludedIds: string[] = []
  ): Recommendation[] {
    const candidates = cheeses.filter(cheese => {
      // 1. Технічні виключення (вже вибрані або замінені)
      if (excludedIds.includes(cheese.id)) return false;
      
      // 2. СУВОРІ ФІЛЬТРИ ВИКЛЮЧЕННЯ (Boolean Reduction)
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
      
      // Система вагових коефіцієнтів (Weighted Ranking)
      if (preferences.likedTypes.includes(cheese.type)) score += 45;
      if (preferences.preferredMilk.includes(cheese.milk)) score += 35;

      // Пошук збігів у смаковому профілі
      preferences.favoriteNotes.forEach(note => {
        if (dataStr.includes(note.toLowerCase())) score += 25;
      });

      // Математична близькість інтенсивності (Fuzzy matching)
      // Чим менша різниця (intensityDiff), тим більше балів (Max 50)
      const intensityDiff = Math.abs(cheese.intensity - preferences.preferredIntensity);
      score += (5 - intensityDiff) * 10;

      // Пріоритет локального продукту
      if (cheese.origin === 'Ukrainian') score += 15;

      return { cheese, score };
    });

    // Сортування за релевантністю (Descending order)
    scoredCandidates.sort((a, b) => b.score - a.score);

    return scoredCandidates.map(item => ({
      cheeseId: item.cheese.id,
      explanation: this.generateDeterministicExplanation(item.cheese, preferences),
      score: Math.min(100, Math.round((item.score / 200) * 100)) // Нормалізація до 100%
    }));
  }

  /**
   * Детермінований генератор пояснень на основі правил (Rule-based Explanation Generator).
   */
  private generateDeterministicExplanation(cheese: Cheese, prefs: UserPreferences): string {
    const typeMap: Record<string, string> = { 
      'Hard': 'витриманий твердий', 
      'Blue': 'пікантний блакитний', 
      'Soft-Ripened': 'делікатний м’який', 
      'Fresh': 'ніжний свіжий',
      'Washed-Rind': 'ароматний промитий',
      'Semi-Soft': 'напівм’який'
    };
    
    const milkMap: Record<string, string> = { 
      'Cow': 'коров’ячого', 
      'Goat': 'козячого', 
      'Sheep': 'овечого', 
      'Buffalo': 'буйволячого',
      'Mixed': 'суміші'
    };

    let intro = `Система обрала цей ${typeMap[cheese.type] || 'крафтовий'} сир з ${milkMap[cheese.milk]} молока. `;
    
    // Пошук ключових збігів для обґрунтування вибору
    const matchingNotes = prefs.favoriteNotes.filter(note => 
      cheese.flavorProfile.toLowerCase().includes(note.toLowerCase())
    );

    let middle = '';
    if (matchingNotes.length > 0) {
      middle = `Він ідеально збігається з вашим запитом на ${matchingNotes.join(', ').toLowerCase()} відтінки смаку. `;
    } else {
      middle = `Його унікальний профіль (${cheese.flavorProfile.toLowerCase()}) розширить ваші гастрономічні горизонти. `;
    }

    let conclusion = `Рекомендована пара: ${cheese.bestPairing.toLowerCase()}.`;
    
    if (cheese.origin === 'Ukrainian') {
      conclusion += ` Це високоякісний продукт з регіону ${cheese.region}.`;
    }

    return intro + middle + conclusion;
  }
}
