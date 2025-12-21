
import { GoogleGenAI, Type } from "@google/genai";
import { Cheese, UserPreferences, Recommendation } from "../types";

export class SommelierService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  // Update getRecommendations to use Cheese type and correct preference properties
  async getRecommendations(
    cheeses: Cheese[], 
    preferences: UserPreferences,
    feedback?: { rejectedId: string, reason: string }
  ): Promise<Recommendation[]> {
    const prompt = `
      Ти — експерт-фромажер (фахівець із сирів) світового класу. Твоє завдання — надати професійну пораду українською мовою.
      
      Доступна колекція сирів: ${JSON.stringify(cheeses)}
      
      Уподобання користувача:
      - Улюблені типи: ${preferences.likedTypes.join(', ')}
      - Бажане молоко: ${preferences.preferredMilk.join(', ')}
      - Діапазон цін: ${preferences.priceRange[0]} - ${preferences.priceRange[1]} грн/100г
      - Улюблені ноти: ${preferences.favoriteNotes.join(', ')}
      - Небажані ноти: ${preferences.dislikedNotes.join(', ')}
      - Бажана інтенсивність (1-5): ${preferences.preferredIntensity}
      
      ${feedback ? `КРИТИЧНЕ ОНОВЛЕННЯ: Користувач щойно відхилив сир з ID "${feedback.rejectedId}" через: "${feedback.reason}". Запропонуй заміну, виключивши цей сир.` : ''}

      Завдання: Рекомендуй рівно 3 сири з наданого списку, які найкраще відповідають цим критеріям.
      Якщо відповідних сирів менше 3, запропонуй найближчі варіанти.
      Поясни ЧОМУ для кожної рекомендації професійним, але привітним тоном українською мовою.
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cheeseId: { type: Type.STRING, description: "ID сиру з наданого списку" },
              explanation: { type: Type.STRING, description: "Детальне пояснення українською мовою" }
            },
            required: ["cheeseId", "explanation"]
          }
        }
      }
    });

    try {
      // Direct access to .text property as per guidelines
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse fromager response", e);
      return [];
    }
  }
}
