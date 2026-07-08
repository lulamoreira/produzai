import { useSyncExternalStore } from "react";
import type { GroceryItem, Recipe } from "./types";
import { SEED_RECIPES } from "./seed";

const RECIPES_KEY = "receitai.recipes";
const GROCERIES_KEY = "receitai.groceries";
const API_KEY_KEY = "receitai.apiKey";
const SEEDED_KEY = "receitai.seeded";

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  emit();
}

// Popula receitas de exemplo na primeira visita
export function ensureSeeded() {
  if (!localStorage.getItem(SEEDED_KEY)) {
    if (!localStorage.getItem(RECIPES_KEY)) {
      write(RECIPES_KEY, SEED_RECIPES);
    }
    localStorage.setItem(SEEDED_KEY, "1");
  }
}

let recipesCache: Recipe[] | null = null;
let groceriesCache: GroceryItem[] | null = null;
let recipesCacheRaw = "";
let groceriesCacheRaw = "";

function getRecipesSnapshot(): Recipe[] {
  const raw = localStorage.getItem(RECIPES_KEY) ?? "[]";
  if (raw !== recipesCacheRaw || recipesCache === null) {
    recipesCacheRaw = raw;
    recipesCache = JSON.parse(raw) as Recipe[];
  }
  return recipesCache;
}

function getGroceriesSnapshot(): GroceryItem[] {
  const raw = localStorage.getItem(GROCERIES_KEY) ?? "[]";
  if (raw !== groceriesCacheRaw || groceriesCache === null) {
    groceriesCacheRaw = raw;
    groceriesCache = JSON.parse(raw) as GroceryItem[];
  }
  return groceriesCache;
}

export function useRecipes(): Recipe[] {
  return useSyncExternalStore(subscribe, getRecipesSnapshot);
}

export function useGroceries(): GroceryItem[] {
  return useSyncExternalStore(subscribe, getGroceriesSnapshot);
}

export function saveRecipe(recipe: Recipe) {
  const recipes = getRecipesSnapshot();
  write(RECIPES_KEY, [recipe, ...recipes.filter((r) => r.id !== recipe.id)]);
}

export function deleteRecipe(id: string) {
  write(
    RECIPES_KEY,
    getRecipesSnapshot().filter((r) => r.id !== id),
  );
}

export function addGroceryItems(items: GroceryItem[]) {
  write(GROCERIES_KEY, [...getGroceriesSnapshot(), ...items]);
}

export function toggleGroceryItem(id: string) {
  write(
    GROCERIES_KEY,
    getGroceriesSnapshot().map((i) =>
      i.id === id ? { ...i, checked: !i.checked } : i,
    ),
  );
}

export function removeGroceryItem(id: string) {
  write(
    GROCERIES_KEY,
    getGroceriesSnapshot().filter((i) => i.id !== id),
  );
}

export function clearCheckedGroceries() {
  write(
    GROCERIES_KEY,
    getGroceriesSnapshot().filter((i) => !i.checked),
  );
}

export function getApiKey(): string {
  return localStorage.getItem(API_KEY_KEY) ?? "";
}

export function setApiKey(key: string) {
  localStorage.setItem(API_KEY_KEY, key);
  emit();
}

export function newId(): string {
  return crypto.randomUUID();
}
