import { useState } from "react";
import { getApiKey, setApiKey } from "../lib/storage";

export default function SettingsPage() {
  const [key, setKey] = useState(getApiKey());
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setApiKey(key.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold">Chave da API da Anthropic</h2>
        <p className="mt-1 text-sm text-stone-500">
          A importação de receitas usa o Claude para transformar a legenda do post numa receita
          estruturada. Crie sua chave em{" "}
          <a
            href="https://platform.claude.com/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-brand underline"
          >
            platform.claude.com
          </a>
          .
        </p>

        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-ant-…"
          className="mt-4 w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 font-mono text-sm outline-none focus:border-brand"
        />

        <button
          onClick={handleSave}
          className="mt-3 w-full rounded-2xl bg-brand px-4 py-3 font-semibold text-white hover:opacity-90"
        >
          {saved ? "✅ Salvo!" : "Salvar chave"}
        </button>

        <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
          🔒 A chave fica salva apenas neste navegador (localStorage) e as chamadas vão direto do
          seu dispositivo para a API da Anthropic. Para um app publicado para outras pessoas, o
          recomendado é mover essa chamada para um backend (ex.: Supabase Edge Function) — assim a
          chave nunca chega ao navegador.
        </p>
      </section>

      <section className="rounded-3xl border border-orange-100 bg-white p-6 text-sm text-stone-500 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-ink">Sobre o ReceitAI</h2>
        <p className="mt-2">
          MVP inspirado no ReciMe: cole a legenda de um Reel/TikTok e a IA extrai a receita com
          ingredientes, quantidades, passo a passo, conversor de porções, lista de compras por
          corredor e modo cozinha.
        </p>
        <p className="mt-2">
          Seus dados (receitas e lista de compras) ficam no armazenamento local do navegador.
        </p>
      </section>
    </div>
  );
}
