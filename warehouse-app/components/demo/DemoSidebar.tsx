"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/lib/demo/store";

const NAV = [
  { href: "/demo/dashboard", label: "Басты бет", group: null },
  { href: null, label: "АНЫҚТАМАЛЫҚТАР", group: "header" },
  { href: "/demo/products", label: "Тауарлар", group: "refs" },
  { href: "/demo/categories", label: "Санаттар", group: "refs" },
  { href: "/demo/units", label: "Өлшем бірліктері", group: "refs" },
  { href: "/demo/warehouses", label: "Қоймалар", group: "refs" },
  { href: "/demo/locations", label: "Сақтау орындары", group: "refs" },
  { href: "/demo/suppliers", label: "Жеткізушілер", group: "refs" },
  { href: null, label: "ҚҰЖАТТАР", group: "header" },
  { href: "/demo/documents/receipts", label: "Кірістер", group: "docs" },
  { href: "/demo/documents/issues", label: "Шығыстар", group: "docs" },
  { href: "/demo/documents/transfers", label: "Ауыстырулар", group: "docs" },
  { href: null, label: "ЕСЕП", group: "header" },
  { href: "/demo/stock", label: "Қалдықтар", group: "stock" },
  { href: "/demo/reports/stock", label: "Есептер", group: "stock" },
  { href: null, label: "ӘКІМШІЛІК", group: "header" },
  { href: "/demo/users", label: "Пайдаланушылар", group: "admin" },
  { href: "/demo/audit", label: "Әрекеттер журналы", group: "admin" },
];

export function DemoSidebar() {
  const pathname = usePathname();
  const { dispatch } = useDemo();

  return (
    <aside className="w-60 flex-shrink-0 bg-slate-800 flex flex-col">
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-700">
        <span className="text-white font-bold text-lg tracking-tight">Sklad</span>
        <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded font-medium">DEMO</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {NAV.map((item, i) => {
          if (!item.href) {
            return (
              <p key={i} className="px-4 pt-4 pb-1 text-xs font-semibold text-slate-500 tracking-widest">
                {item.label}
              </p>
            );
          }
          const active = pathname === item.href || (item.href !== "/demo/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm transition-colors ${
                active ? "bg-slate-700 text-white font-medium" : "text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-700">
        <button
          onClick={() => { if (confirm("Барлық демо деректерін бастапқы күйге қайтару керек пе?")) dispatch({ type: "RESET" }); }}
          className="w-full text-xs text-slate-500 hover:text-red-400 py-1 transition-colors"
        >
          Демо деректерін қалпына келтіру
        </button>
      </div>
    </aside>
  );
}
