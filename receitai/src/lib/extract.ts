import Anthropic from "@anthropic-ai/sdk";
import { GROCERY_CATEGORIES, type ExtractedRecipe } from "./types";
import { getApiKey } from "./storage";

const RECIPE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "description",
    "emoji",
    "sourceUrl",
    "servings",
    "totalTimeMinutes",
    "tags",
    "ingredients",
    "instructions",
  ],
  properties: {
    title: { type: "string", description: "Nome da receita em português" },
    description: {
      type: "string",
      description: "Descrição curta e apetitosa (1-2 frases)",
    },
    emoji: { type: "string", description: "Um único emoji que representa o prato" },
    sourceUrl: {
      type: "string",
      description: "URL de origem se mencionada no texto; string vazia caso contrário",
    },
    servings: {
      type: "integer",
      description: "Número de porções; estime se não informado (mínimo 1)",
    },
    totalTimeMinutes: {
      type: "integer",
      description: "Tempo total estimado em minutos; 0 se impossível estimar",
    },
    tags: {
      type: "array",
      items: { type: "string" },
      description: "2 a 4 tags em português, ex.: 'massa', 'rápido', 'vegetariano'",
    },
    ingredients: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "quantity", "unit", "note", "category", "emoji"],
        properties: {
          name: { type: "string", description: "Nome do ingrediente, singular, minúsculas" },
          quantity: {
            type: "number",
            description: "Quantidade numérica (1/2 vira 0.5); 0 quando 'a gosto' ou não especificada",
          },
          unit: {
            type: "string",
            description: "Unidade: xícara, colher de sopa, colher de chá, g, kg, ml, l, unidade... String vazia se não houver",
          },
          note: { type: "string", description: "Preparo do ingrediente, ex.: 'picado'; vazio se não houver" },
          category: {
            type: "string",
            enum: [...GROCERY_CATEGORIES],
            description: "Corredor do mercado onde o item é encontrado",
          },
          emoji: { type: "string", description: "Um emoji para o ingrediente" },
        },
      },
    },
    instructions: {
      type: "array",
      items: { type: "string" },
      description: "Passos numerados do preparo, um passo por item, imperativo em português",
    },
  },
} as const;

const SYSTEM_PROMPT = `Você é o motor de extração de receitas do app ReceitAI.
O usuário cola o texto de uma receita — geralmente a legenda de um Reel do Instagram ou vídeo do TikTok, às vezes uma transcrição de fala ou um texto de blog, em qualquer idioma.

Extraia a receita de forma fiel e estruturada, em português do Brasil:
- Converta frações e medidas para números (1/2 → 0.5). Mantenha as unidades originais quando fizerem sentido no Brasil (cup → xícara, tbsp → colher de sopa, tsp → colher de chá).
- Se as instruções estiverem implícitas ou desordenadas no texto, organize-as em passos claros e sequenciais, sem inventar técnicas que não estejam no texto.
- Ignore hashtags, emojis decorativos, autopromoção ("me segue", "link na bio") e qualquer conteúdo que não seja a receita.
- Se o texto contiver mais de uma receita, extraia apenas a principal.`;

export class ExtractionError extends Error {}

export async function extractRecipe(rawText: string): Promise<ExtractedRecipe> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new ExtractionError(
      "Configure sua chave da API da Anthropic na aba Ajustes para usar a importação com IA.",
    );
  }

  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  let response: Anthropic.Message;
  try {
    response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      output_config: {
        format: { type: "json_schema", schema: RECIPE_SCHEMA },
      },
      messages: [
        {
          role: "user",
          content: `Extraia a receita deste texto:\n\n${rawText}`,
        },
      ],
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      throw new ExtractionError("Chave da API inválida. Verifique em Ajustes.");
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new ExtractionError("Limite de requisições atingido. Tente novamente em instantes.");
    }
    if (error instanceof Anthropic.APIError) {
      throw new ExtractionError(`Erro da API (${error.status}): ${error.message}`);
    }
    throw new ExtractionError("Falha de conexão com a API da Anthropic.");
  }

  if (response.stop_reason === "refusal") {
    throw new ExtractionError("A IA recusou este conteúdo. Tente colar apenas o texto da receita.");
  }

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new ExtractionError("A IA não retornou uma receita. Tente novamente.");
  }

  try {
    const recipe = JSON.parse(textBlock.text) as ExtractedRecipe;
    recipe.servings = Math.max(1, recipe.servings);
    return recipe;
  } catch {
    throw new ExtractionError("Não consegui interpretar a resposta da IA. Tente novamente.");
  }
}
