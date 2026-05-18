"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import { genId, now } from "@/lib/demo/types";

export default function DemoNewProduct() {
  const router = useRouter();
  const { state, dispatch } = useDemo();
  const [form, setForm] = useState({ name: "", sku: "", categoryId: "", unitId: "", minStock: "0", description: "", barcode: "" });
  const [error, setError] = useState("");

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.sku || !form.categoryId || !form.unitId) { setError("Міндетті өрістерді толтырыңыз"); return; }
    if (state.products.some((p) => p.sku === form.sku)) { setError("Мұндай артикулы бар тауар бұрыннан бар"); return; }
    const id = genId();
    dispatch({ type: "CREATE_PRODUCT", p: { id, name: form.name, sku: form.sku, barcode: form.barcode || undefined, categoryId: form.categoryId, unitId: form.unitId, description: form.description || undefined, minStock: parseFloat(form.minStock) || 0, isActive: true, createdAt: now() } });
    dispatch({ type: "NOTIFY", message: "Тауар сәтті құрылды", kind: "success" });
    router.push("/demo/products");
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => router.back()} className="text-xs text-blue-600 hover:underline mb-1 block">← Артқа</button>
          <h1 className="text-xl font-semibold">Тауар құру</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <F label="Атауы *"><input value={form.name} onChange={(e) => set("name", e.target.value)} className={inp} required /></F>
          <F label="Артикул (SKU) *"><input value={form.sku} onChange={(e) => set("sku", e.target.value)} className={inp} required /></F>
          <F label="Санаты *">
            <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={inp} required>
              <option value="">— таңдаңыз —</option>
              {state.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </F>
          <F label="Өлшем бірлігі *">
            <select value={form.unitId} onChange={(e) => set("unitId", e.target.value)} className={inp} required>
              <option value="">— таңдаңыз —</option>
              {state.units.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>)}
            </select>
          </F>
          <F label="Мин. қалдық"><input type="number" value={form.minStock} onChange={(e) => set("minStock", e.target.value)} className={inp} min="0" /></F>
          <F label="Штрихкод"><input value={form.barcode} onChange={(e) => set("barcode", e.target.value)} className={inp} /></F>
          <F label="Сипаттамасы" className="col-span-2"><textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className={inp} /></F>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Құру</button>
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">Болдырмау</button>
        </div>
      </form>
    </div>
  );
}

const inp = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
function F({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>;
}
