import type { Recipe } from "./types";

export const SEED_RECIPES: Recipe[] = [
  {
    id: "seed-granola",
    title: "Granola de Pistache e Aveia",
    description:
      "Granola crocante de forno com pistache, aveia e maple syrup — perfeita com iogurte no café da manhã.",
    emoji: "🥣",
    sourceUrl: "",
    servings: 8,
    totalTimeMinutes: 35,
    tags: ["café da manhã", "saudável", "forno"],
    ingredients: [
      { name: "pistache", quantity: 0.5, unit: "xícara", note: "picado grosseiramente", category: "Mercearia", emoji: "🥜" },
      { name: "aveia em flocos", quantity: 3, unit: "xícara", note: "", category: "Mercearia", emoji: "🌾" },
      { name: "maple syrup", quantity: 0.33, unit: "xícara", note: "ou mel", category: "Mercearia", emoji: "🍯" },
      { name: "óleo vegetal", quantity: 0.33, unit: "xícara", note: "pode usar óleo de coco", category: "Mercearia", emoji: "🫒" },
      { name: "sal", quantity: 0, unit: "", note: "uma pitada", category: "Temperos e Condimentos", emoji: "🧂" },
    ],
    instructions: [
      "Preaqueça o forno a 160 °C e forre uma assadeira grande com papel manteiga.",
      "Pique grosseiramente os pistaches.",
      "Em uma tigela grande, misture a aveia, o maple syrup, o óleo e o sal até tudo ficar bem envolvido.",
      "Espalhe a mistura na assadeira em camada uniforme e junte os pistaches.",
      "Asse por 20 a 25 minutos, mexendo na metade do tempo, até dourar.",
      "Deixe esfriar completamente na assadeira para ficar crocante e guarde em pote fechado.",
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-penne",
    title: "Penne Cremoso com Frango e Brócolis",
    description:
      "Massa de uma panela só com frango dourado, brócolis e molho cremoso — jantar de semana em 30 minutos.",
    emoji: "🍝",
    sourceUrl: "",
    servings: 4,
    totalTimeMinutes: 30,
    tags: ["massa", "jantar", "rápido"],
    ingredients: [
      { name: "penne", quantity: 400, unit: "g", note: "", category: "Mercearia", emoji: "🍝" },
      { name: "peito de frango", quantity: 500, unit: "g", note: "em cubos", category: "Açougue e Peixaria", emoji: "🍗" },
      { name: "brócolis", quantity: 1, unit: "unidade", note: "em floretes", category: "Hortifrúti", emoji: "🥦" },
      { name: "ervilha", quantity: 1, unit: "xícara", note: "congelada", category: "Congelados", emoji: "🟢" },
      { name: "creme de leite", quantity: 200, unit: "ml", note: "", category: "Laticínios e Ovos", emoji: "🥛" },
      { name: "alho", quantity: 3, unit: "dente", note: "picado", category: "Hortifrúti", emoji: "🧄" },
      { name: "azeite", quantity: 2, unit: "colher de sopa", note: "", category: "Mercearia", emoji: "🫒" },
      { name: "sal e pimenta-do-reino", quantity: 0, unit: "", note: "a gosto", category: "Temperos e Condimentos", emoji: "🧂" },
    ],
    instructions: [
      "Cozinhe o penne em água fervente com sal até ficar al dente; reserve uma xícara da água do cozimento.",
      "Tempere o frango com sal e pimenta e doure no azeite em fogo alto até cozinhar por completo.",
      "Junte o alho e refogue por 1 minuto até perfumar.",
      "Acrescente o brócolis e as ervilhas e cozinhe por 3 a 4 minutos.",
      "Adicione o creme de leite e um pouco da água do cozimento e deixe o molho encorpar.",
      "Misture o penne ao molho, ajuste o sal e sirva em seguida.",
    ],
    createdAt: new Date().toISOString(),
  },
];
