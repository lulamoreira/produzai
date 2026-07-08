import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addGroceryItems, deleteRecipe, newId, useRecipes } from "../lib/storage";
import { formatQuantity } from "../lib/scale";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipes = useRecipes();
  const recipe = recipes.find((r) => r.id === id);

  const [servings, setServings] = useState(recipe?.servings ?? 1);
  const [cookStep, setCookStep] = useState<number | null>(null);
  const [addedToList, setAddedToList] = useState(false);

  if (!recipe) {
    return (
      <div className="rounded-3xl border border-dashed border-orange-200 bg-white/60 p-10 text-center">
        <p>Receita não encontrada.</p>
        <Link to="/" className="mt-2 inline-block font-semibold text-brand underline">
          Voltar às receitas
        </Link>
      </div>
    );
  }

  const factor = servings / recipe.servings;

  function handleAddToGroceries() {
    if (!recipe) return;
    addGroceryItems(
      recipe.ingredients.map((ing) => ({
        id: newId(),
        name: ing.name,
        quantity: ing.quantity * factor,
        unit: ing.unit,
        category: ing.category,
        recipeTitle: recipe.title,
        checked: false,
      })),
    );
    setAddedToList(true);
    setTimeout(() => setAddedToList(false), 2500);
  }

  function handleDelete() {
    if (!recipe) return;
    if (confirm(`Excluir a receita "${recipe.title}"?`)) {
      deleteRecipe(recipe.id);
      navigate("/");
    }
  }

  // Modo cozinha: um passo por vez, em tela cheia
  if (cookStep !== null) {
    const last = cookStep === recipe.instructions.length - 1;
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-cream p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-wide text-brand">
            👩‍🍳 {recipe.title}
          </p>
          <button
            onClick={() => setCookStep(null)}
            className="rounded-full border border-stone-300 px-4 py-1.5 text-sm font-semibold text-stone-600"
          >
            Sair
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold text-stone-400">
            Passo {cookStep + 1} de {recipe.instructions.length}
          </p>
          <p className="mt-6 max-w-lg font-display text-3xl font-medium leading-snug">
            {recipe.instructions[cookStep]}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setCookStep(Math.max(0, cookStep - 1))}
            disabled={cookStep === 0}
            className="flex-1 rounded-2xl border border-stone-300 px-4 py-4 font-semibold text-stone-600 disabled:opacity-30"
          >
            ← Anterior
          </button>
          <button
            onClick={() => (last ? setCookStep(null) : setCookStep(cookStep + 1))}
            className="flex-1 rounded-2xl bg-brand px-4 py-4 font-semibold text-white"
          >
            {last ? "🎉 Concluir" : "Próximo →"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <Link to="/" className="text-sm font-semibold text-stone-400 hover:text-stone-600">
          ← Receitas
        </Link>
        <h2 className="mt-2 font-display text-3xl font-semibold leading-tight">
          {recipe.emoji} {recipe.title}
        </h2>
        <p className="mt-1 text-stone-500">{recipe.description}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {recipe.totalTimeMinutes > 0 && (
            <span className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-600">
              ⏱️ {recipe.totalTimeMinutes} min
            </span>
          )}
          {recipe.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-brand-soft px-2.5 py-1 font-medium text-brand">
              {tag}
            </span>
          ))}
          {recipe.sourceUrl && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-600 underline"
            >
              🔗 Post original
            </a>
          )}
        </div>
      </div>

      <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-stone-400">Ingredientes</h3>
          <div className="flex items-center gap-3 rounded-full border border-orange-200 px-3 py-1">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="text-lg font-bold text-brand"
              aria-label="Menos porções"
            >
              −
            </button>
            <span className="min-w-16 text-center text-sm font-semibold">
              {servings} {servings === 1 ? "porção" : "porções"}
            </span>
            <button
              onClick={() => setServings(servings + 1)}
              className="text-lg font-bold text-brand"
              aria-label="Mais porções"
            >
              +
            </button>
          </div>
        </div>

        <ul className="mt-4 space-y-2.5">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="flex items-baseline gap-2 text-sm">
              <span>{ing.emoji}</span>
              <span>
                {ing.quantity > 0 && (
                  <strong>
                    {formatQuantity(ing.quantity, factor)}
                    {ing.unit ? ` ${ing.unit}` : ""}{" "}
                  </strong>
                )}
                {ing.quantity > 0 && ing.unit ? "de " : ""}
                {ing.name}
                {ing.note && <span className="text-stone-400"> — {ing.note}</span>}
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleAddToGroceries}
          className="mt-5 w-full rounded-2xl bg-brand-soft px-4 py-3 font-semibold text-brand hover:opacity-80"
        >
          {addedToList ? "✅ Adicionado à lista!" : "🛒 Adicionar à lista de compras"}
        </button>
      </section>

      <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-stone-400">
            Modo de preparo
          </h3>
          <button
            onClick={() => setCookStep(0)}
            className="rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90"
          >
            ▶️ Cozinhar passo a passo
          </button>
        </div>
        <ol className="mt-4 space-y-3">
          {recipe.instructions.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <button
        onClick={handleDelete}
        className="w-full rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
      >
        🗑️ Excluir receita
      </button>
    </div>
  );
}
