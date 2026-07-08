# 🍳 ReceitAI

App de receitas com IA, inspirado no [ReciMe](https://recime.app): viu uma receita num Reel do
Instagram ou TikTok? Cole a legenda do post e a IA (Claude) extrai a receita estruturada —
ingredientes com quantidades, passo a passo, porções ajustáveis e lista de compras organizada
por corredor do mercado.

## Funcionalidades

- ✨ **Importação com IA** — cole a legenda/texto de qualquer receita (em qualquer idioma) e o
  Claude devolve a receita estruturada em português, com preview antes de salvar
- 📖 **Minhas receitas** — grade com busca por nome, tag ou ingrediente
- ➗ **Conversor de porções** — ajuste o número de porções e as quantidades recalculam
  (com frações amigáveis: ½, ⅓, ¾…)
- 🛒 **Lista de compras** — ingredientes agrupados por corredor do mercado, com itens marcáveis
- 👩‍🍳 **Modo cozinha** — passo a passo em tela cheia, um passo por vez
- 🔗 Link para o post original de cada receita

## Rodando localmente

```sh
npm install
npm run dev
```

Abra http://localhost:5173, vá em **Ajustes** e cole sua chave da API da Anthropic
(crie em [platform.claude.com](https://platform.claude.com/)). Duas receitas de exemplo já vêm
carregadas para você explorar sem chave.

## Arquitetura (MVP)

- **React + Vite + TypeScript + Tailwind CSS v4**
- **Persistência**: `localStorage` (receitas, lista de compras e chave da API ficam só no seu
  navegador) — camada isolada em `src/lib/storage.ts`, fácil de trocar por Supabase depois
- **IA**: chamada direta do navegador para a API da Anthropic (`claude-opus-4-8`) com
  *structured outputs* (JSON Schema), em `src/lib/extract.ts`

### Próximos passos sugeridos

1. **Backend**: mover a chamada da IA para uma Supabase Edge Function (a chave sai do navegador)
   e persistir receitas no Postgres com login
2. **Importar por link**: o backend busca a legenda/transcrição do post automaticamente
3. **Meal plan semanal** e **coleções (cookbooks)**
4. **App nativo** (React Native/Expo) para ter o "compartilhar direto do Instagram" via share sheet
