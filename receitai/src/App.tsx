import { NavLink, Route, Routes } from "react-router-dom";
import RecipesPage from "./pages/RecipesPage";
import ImportPage from "./pages/ImportPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import GroceriesPage from "./pages/GroceriesPage";
import SettingsPage from "./pages/SettingsPage";
import { useGroceries } from "./lib/storage";

const NAV = [
  { to: "/", label: "Receitas", icon: "📖" },
  { to: "/importar", label: "Importar", icon: "✨" },
  { to: "/compras", label: "Compras", icon: "🛒" },
  { to: "/ajustes", label: "Ajustes", icon: "⚙️" },
];

export default function App() {
  const groceries = useGroceries();
  const pending = groceries.filter((g) => !g.checked).length;

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-24">
      <header className="flex items-center gap-2 py-6">
        <span className="text-3xl">🍳</span>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Receit<span className="text-brand">AI</span>
        </h1>
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<RecipesPage />} />
          <Route path="/importar" element={<ImportPage />} />
          <Route path="/receita/:id" element={<RecipeDetailPage />} />
          <Route path="/compras" element={<GroceriesPage />} />
          <Route path="/ajustes" element={<SettingsPage />} />
        </Routes>
      </main>

      <nav className="fixed inset-x-0 bottom-0 border-t border-orange-100 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl justify-around py-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-xs font-semibold ${
                  isActive ? "bg-brand-soft text-brand" : "text-stone-500 hover:text-stone-700"
                }`
              }
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
              {item.to === "/compras" && pending > 0 && (
                <span className="absolute -top-1 right-1 rounded-full bg-brand px-1.5 text-[10px] font-bold text-white">
                  {pending}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
