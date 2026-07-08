import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  clearCheckedGroceries,
  removeGroceryItem,
  toggleGroceryItem,
  useGroceries,
} from "../lib/storage";
import { GROCERY_CATEGORIES } from "../lib/types";
import { formatQuantity } from "../lib/scale";

export default function GroceriesPage() {
  const items = useGroceries();

  const byCategory = useMemo(() => {
    return GROCERY_CATEGORIES.map((category) => ({
      category,
      items: items.filter((i) => i.category === category),
    })).filter((group) => group.items.length > 0);
  }, [items]);

  const checkedCount = items.filter((i) => i.checked).length;

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-orange-200 bg-white/60 p-10 text-center">
        <p className="text-4xl">🛒</p>
        <p className="mt-2 font-semibold">Lista de compras vazia</p>
        <p className="mt-1 text-sm text-stone-500">
          Abra uma{" "}
          <Link to="/" className="font-semibold text-brand underline">
            receita
          </Link>{" "}
          e toque em "Adicionar à lista de compras".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-stone-500">
          {items.length} {items.length === 1 ? "item" : "itens"} · organizados por corredor
        </p>
        {checkedCount > 0 && (
          <button
            onClick={clearCheckedGroceries}
            className="rounded-full border border-stone-300 px-3 py-1 text-xs font-semibold text-stone-500 hover:bg-stone-100"
          >
            Limpar comprados ({checkedCount})
          </button>
        )}
      </div>

      {byCategory.map(({ category, items: group }) => (
        <section
          key={category}
          className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm"
        >
          <h3 className="text-sm font-bold uppercase tracking-wide text-brand">{category}</h3>
          <ul className="mt-3 space-y-2">
            {group.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleGroceryItem(item.id)}
                  className="h-5 w-5 shrink-0 accent-orange-700"
                />
                <div className={`flex-1 text-sm ${item.checked ? "text-stone-300 line-through" : ""}`}>
                  <span className="font-medium">{item.name}</span>
                  {item.quantity > 0 && (
                    <span className="text-stone-500">
                      {" "}
                      — {formatQuantity(item.quantity, 1)}
                      {item.unit ? ` ${item.unit}` : ""}
                    </span>
                  )}
                  <span className="block text-xs text-stone-400">{item.recipeTitle}</span>
                </div>
                <button
                  onClick={() => removeGroceryItem(item.id)}
                  className="text-stone-300 hover:text-red-400"
                  aria-label={`Remover ${item.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
