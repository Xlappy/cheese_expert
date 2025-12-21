
export interface Cheese {
  id: string;
  name: string;
  type: 'Fresh' | 'Soft-Ripened' | 'Semi-Soft' | 'Hard' | 'Blue' | 'Washed-Rind';
  milk: 'Cow' | 'Goat' | 'Sheep' | 'Buffalo' | 'Mixed';
  origin: 'Ukrainian' | 'Import';
  region: string;
  agingMonths: number;
  intensity: number; // 1-5
  texture: number; // 1-5 (soft to hard)
  saltiness: number; // 1-5
  pungency: number; // 1-5
  flavorProfile: string;
  bestPairing: string;
  pricePer100g: number;
}

export interface UserPreferences {
  likedTypes: string[];
  dislikedTypes: string[]; // Нове поле
  preferredMilk: string[];
  dislikedMilk: string[]; // Нове поле
  priceRange: [number, number];
  minAging: number;
  favoriteNotes: string[];
  dislikedNotes: string[];
  preferredIntensity: number;
}

export interface Recommendation {
  cheeseId: string;
  explanation: string;
  score?: number;
}

export type AppView = 'expert' | 'database' | 'favorites';
