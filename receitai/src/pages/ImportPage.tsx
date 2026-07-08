import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { extractRecipe, ExtractionError } from "../lib/extract";
import { getApiKey, newId, saveRecipe } from "../lib/storage";
import type { ExtractedRecipe } from "../lib/types";
import { Link } from "react-router-dom";

export default function ImportPage() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<ExtractedRecipe | null>(null);
  const hasKey = Boolean(getApiKey());

  async function handleExtract() {
    setError("");
    setLoading(true);
    try {
      const input = sourceUrl ? `${text}\n\nFonte: ${sourceUrl}` : text;
      const recipe = await extractRecipe(input);
      if (sourceUrl && !recipe.sourceUrl) recipe.sourceUrl = sourceUrl;
      setPreview(recipe);
    } catch (e) {
      setError(e instanceof ExtractionError ? e.message : "Erro inesperado ao extrair a receita.");
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!preview) return;
    const id = newId();
    saveRecipe({ ...preview, id, createdAt: new Date().toISOString() });
    navigate(`/receita/${id}`);
  }

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-brand">
            Receita extraída — confira antes de salvar
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            {preview.emoji} {preview.title}
          </h2>
          <p className="mt-1 text-sm text-stone-500">{preview.description}</p>

          <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-stone-400">
            Ingredientes ({preview.ingredients.length})
          </h3>
          <ul className="mt-2 space-y-1 text-sm">
            {preview.ingredients.map((ing, i) => (
              <li key={i}>
                {ing.emoji} {ing.quantity > 0 ? `${ing.quantity} ` : ""}
                {ing.unit ? `${ing.unit} de ` : ""}
                <span className="font-medium">{ing.name}</span>
                {ing.note ? <span className="text-stone-400"> — {ing.note}</span> : null}
              </li>
            ))}
          </ul>

          <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-stone-400">
            Modo de preparo ({preview.instructions.length} passos)
          </h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            {preview.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 rounded-2xl bg-brand px-4 py-3 font-semibold text-white shadow hover:opacity-90"
          >
            💾 Salvar receita
          </button>
          <button
            onClick={() => setPreview(null)}
            className="rounded-2xl border border-stone-300 px-4 py-3 font-semibold text-stone-600 hover:bg-stone-100"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-brand-soft p-5 text-sm text-orange-900">
        <p className="font-semibold">✨ Como funciona</p>
        <p className="mt-1">
          Viu uma receita num Reel ou TikTok? Copie a legenda do post (ou digite a receita) e cole
          aqui. A IA identifica ingredientes, quantidades e o passo a passo — e você ainda pode
          mandar tudo para a lista de compras.
        </p>
      </div>

      {!hasKey && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          ⚠️ Para importar com IA, configure sua chave da API da Anthropic em{" "}
          <Link to="/ajustes" className="font-semibold underline">
            Ajustes
          </Link>
          .
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder={"Cole aqui a legenda do Reel…\n\nEx.: GRANOLA CASEIRA 🥣 3 cups oats, 1/2 cup pistachios, 1/3 cup maple syrup… bake at 325F for 25 min"}
        className="w-full rounded-3xl border border-orange-200 bg-white p-4 text-sm outline-none focus:border-brand"
      />

      <input
        type="url"
        value={sourceUrl}
        onChange={(e) => setSourceUrl(e.target.value)}
        placeholder="Link do post original (opcional)"
        className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handleExtract}
        disabled={loading || text.trim().length < 20}
        className="w-full rounded-2xl bg-brand px-4 py-3.5 font-semibold text-white shadow hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "🪄 Extraindo receita…" : "✨ Extrair receita com IA"}
      </button>
    </div>
  );
}
