"use client";

import Link from "next/link";
import { useState } from "react";
import { useDemo } from "@/lib/demo/store";

export default function DemoProducts() {
  const { state } = useDemo();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");

  const products = state.products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.categoryId === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Тауарлар</h1>
          <p className="text-sm text-gray-500">Тауар позицияларының каталогы</p>
        </div>
        <Link href="/demo/products/new" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          + Тауар құру
        </Link>
      </div>

      <div className="flex gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Атауы немесе SKU бойынша іздеу..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
          <option value="">Барлық санаттар</option>
          {state.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Атауы", "Артикул", "Санаты", "Өлш. бір.", "Мин. қалдық", "Күйі", ""].map((h) => (
                <th key={h} className={`px-4 py-3 font-medium text-gray-500 ${h === "Мин. қалдық" || h === "" ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => {
              const cat = state.categories.find((c) => c.id === p.categoryId);
              const unit = state.units.find((u) => u.id === p.unitId);
              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-gray-600 text-xs">{p.sku}</td>
                  <td className="px-4 py-3">{cat?.name ?? "—"}</td>
                  <td className="px-4 py-3">{unit?.symbol ?? "—"}</td>
                  <td className="px-4 py-3 text-right">{p.minStock}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.isActive ? "Белсенді" : "Белсенді емес"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/demo/products/${p.id}`} className="text-blue-600 hover:underline text-xs">Өңдеу</Link>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Ештеңе табылмады</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
