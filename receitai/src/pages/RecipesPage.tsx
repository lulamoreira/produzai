import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRecipes } from "../lib/storage";

export default function RecipesPage() {
  const recipes = useRecipes();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(q)),
    );
  }, [recipes, query]);

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nome, tag ou ingrediente…"
        className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
      />

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-orange-200 bg-white/60 p-10 text-center">
          <p className="text-4xl">🍽️</p>
          <p className="mt-2 font-semibold">Nenhuma receita por aqui</p>
          <p className="mt-1 text-sm text-stone-500">
            Viu uma receita num Reel? Cole a legenda na aba{" "}
            <Link to="/importar" className="font-semibold text-brand underline">
              Importar
            </Link>{" "}
            e deixe a IA organizar tudo.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((recipe) => (
            <li key={recipe.id}>
              <Link
                to={`/receita/${recipe.id}`}
                className="flex h-full flex-col rounded-3xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <span className="text-4xl">{recipe.emoji || "🍽️"}</span>
                  <div>
                    <h2 className="font-display text-lg font-semibold leading-snug">
                      {recipe.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                      {recipe.description}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  {recipe.totalTimeMinutes > 0 && (
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-600">
                      ⏱️ {recipe.totalTimeMinutes} min
                    </span>
                  )}
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-600">
                    🍽️ {recipe.servings} porções
                  </span>
                  {recipe.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-brand-soft px-2.5 py-1 font-medium text-brand"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
