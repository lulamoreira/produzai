const FRACTIONS: [number, string][] = [
  [1 / 8, "⅛"],
  [1 / 4, "¼"],
  [1 / 3, "⅓"],
  [3 / 8, "⅜"],
  [1 / 2, "½"],
  [5 / 8, "⅝"],
  [2 / 3, "⅔"],
  [3 / 4, "¾"],
  [7 / 8, "⅞"],
];

/** Formata quantidade escalada de forma amigável (1.5 → "1½", 0.33 → "⅓") */
export function formatQuantity(quantity: number, factor: number): string {
  const value = quantity * factor;
  if (value === 0) return "";
  const whole = Math.floor(value);
  const frac = value - whole;
  if (frac < 0.03) return String(whole);
  let best = "";
  let bestDiff = Infinity;
  for (const [f, symbol] of FRACTIONS) {
    const diff = Math.abs(frac - f);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = symbol;
    }
  }
  if (bestDiff > 0.05) {
    // não bate com fração comum — mostra decimal
    return value.toFixed(1).replace(".", ",").replace(",0", "");
  }
  return whole > 0 ? `${whole}${best}` : best;
}
