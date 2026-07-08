export const GROCERY_CATEGORIES = [
  "Hortifrúti",
  "Açougue e Peixaria",
  "Laticínios e Ovos",
  "Padaria",
  "Mercearia",
  "Congelados",
  "Bebidas",
  "Temperos e Condimentos",
  "Outros",
] as const;

export type GroceryCategory = (typeof GROCERY_CATEGORIES)[number];

export interface Ingredient {
  name: string;
  /** Quantidade numérica; 0 quando não especificada (ex.: "a gosto") */
  quantity: number;
  /** Unidade de medida (ex.: "xícara", "g", "colher de sopa"); vazio quando não há */
  unit: string;
  /** Observação opcional (ex.: "picado grosseiramente") */
  note: string;
  category: GroceryCategory;
  emoji: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  emoji: string;
  sourceUrl: string;
  servings: number;
  totalTimeMinutes: number;
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
  createdAt: string;
}

/** Receita como retornada pela IA, antes de ganhar id/data */
export type ExtractedRecipe = Omit<Recipe, "id" | "createdAt">;

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: GroceryCategory;
  recipeTitle: string;
  checked: boolean;
}
