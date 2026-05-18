"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import { genId, today, now, computeStock } from "@/lib/demo/types";
import type { DocItem } from "@/lib/demo/types";

interface ItemRow { productId: string; fromLocationId: string; toLocationId: string; quantity: string; }

export default function DemoTransferNew() {
  const router = useRouter();
  const { state, dispatch } = useDemo();

  const [fromWarehouseId, setFromWarehouseId] = useState("");
  const [toWarehouseId, setToWarehouseId] = useState("");
  const [date, setDate] = useState(today());
  const [comment, setComment] = useState("");
  const [items, setItems] = useState<ItemRow[]>([{ productId: "", fromLocationId: "", toLocationId: "", quantity: "" }]);
  const [error, setError] = useState("");

  const fromLocations = state.locations.filter((l) => l.warehouseId === fromWarehouseId);
  const toLocations = state.locations.filter((l) => l.warehouseId === toWarehouseId);
  const stock = computeStock(state.movements);

  function getAvailable(productId: string, locationId: string) {
    return stock.find((b) => b.productId === productId && b.warehouseId === fromWarehouseId && b.storageLocationId === locationId)?.quantity ?? 0;
  }

  function setItem(i: number, k: keyof ItemRow, v: string) {
    setItems((rows) => rows.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  }

  function addItem() { setItems((r) => [...r, { productId: "", fromLocationId: "", toLocationId: "", quantity: "" }]); }
  function removeItem(i: number) { setItems((r) => r.filter((_, idx) => idx !== i)); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fromWarehouseId || !toWarehouseId) { setError("Жөнелтуші мен алушы қоймаларды таңдаңыз"); return; }
    if (fromWarehouseId === toWarehouseId) { setError("Қоймалар әртүрлі болуы керек"); return; }
    if (items.some((r) => !r.productId || !r.fromLocationId || !r.toLocationId || !r.quantity)) { setError("Тауарлардың барлық жолдарын толтырыңыз"); return; }

    const nextNum = `TRF-${1000 + state.transfers.length + 1}`;
    const docItems: DocItem[] = items.map((r) => ({
      id: genId(), productId: r.productId, storageLocationId: r.fromLocationId,
      fromStorageLocationId: r.fromLocationId, toStorageLocationId: r.toLocationId,
      quantity: parseFloat(r.quantity),
    }));

    dispatch({
      type: "CREATE_TRANSFER",
      doc: { id: genId(), documentNumber: nextNum, fromWarehouseId, toWarehouseId, date, status: "DRAFT", comment: comment.trim() || undefined, createdById: "u-store", createdAt: now(), items: docItems },
    });
    dispatch({ type: "NOTIFY", message: `${nextNum} құжаты құрылды`, kind: "success" });
    router.push("/demo/documents/transfers");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <button onClick={() => router.back()} className="text-xs text-blue-600 hover:underline mb-1 block">← Артқа</button>
        <h1 className="text-xl font-semibold">Жаңа ауыстыру</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Құжаттың деректемелері</h2>
          <div className="grid grid-cols-2 gap-4">
            <F label="Қойма — қайдан *">
              <select value={fromWarehouseId} onChange={(e) => { setFromWarehouseId(e.target.value); setItems([{ productId: "", fromLocationId: "", toLocationId: "", quantity: "" }]); }} className={inp} required>
                <option value="">— таңдаңыз —</option>
                {state.warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </F>
            <F label="Қойма — қайда *">
              <select value={toWarehouseId} onChange={(e) => { setToWarehouseId(e.target.value); setItems([{ productId: "", fromLocationId: "", toLocationId: "", quantity: "" }]); }} className={inp} required>
                <option value="">— таңдаңыз —</option>
                {state.warehouses.filter((w) => w.id !== fromWarehouseId).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </F>
            <F label="Күні"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inp} required /></F>
            <F label="Ескертпе"><input value={comment} onChange={(e) => setComment(e.target.value)} className={inp} /></F>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Тауар позициялары</h2>
            <button type="button" onClick={addItem} className="text-xs text-blue-600 hover:underline">+ Жол қосу</button>
          </div>
          <div className="space-y-2">
            {items.map((row, i) => {
              const available = row.productId && row.fromLocationId ? getAvailable(row.productId, row.fromLocationId) : null;
              const qty = parseFloat(row.quantity) || 0;
              const insufficient = available !== null && qty > available;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      {i === 0 && <label className="text-xs text-gray-500 block mb-1">Тауар *</label>}
                      <select value={row.productId} onChange={(e) => setItem(i, "productId", e.target.value)} className={inp} required>
                        <option value="">— тауар —</option>
                        {state.products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="w-40">
                      {i === 0 && <label className="text-xs text-gray-500 block mb-1">Қайдан *</label>}
                      <select value={row.fromLocationId} onChange={(e) => setItem(i, "fromLocationId", e.target.value)} className={inp} required disabled={!fromWarehouseId}>
                        <option value="">— орын —</option>
                        {fromLocations.map((l) => <option key={l.id} value={l.id}>{l.code}</option>)}
                      </select>
                    </div>
                    <div className="w-40">
                      {i === 0 && <label className="text-xs text-gray-500 block mb-1">Қайда *</label>}
                      <select value={row.toLocationId} onChange={(e) => setItem(i, "toLocationId", e.target.value)} className={inp} required disabled={!toWarehouseId}>
                        <option value="">— орын —</option>
                        {toLocations.map((l) => <option key={l.id} value={l.id}>{l.code}</option>)}
                      </select>
                    </div>
                    <div className="w-24">
                      {i === 0 && <label className="text-xs text-gray-500 block mb-1">Саны *</label>}
                      <input type="number" min="0.001" step="any" value={row.quantity} onChange={(e) => setItem(i, "quantity", e.target.value)} className={`${inp} ${insufficient ? "border-red-400 bg-red-50" : ""}`} required placeholder="0" />
                    </div>
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(i)} className={`text-gray-400 hover:text-red-500 text-lg leading-none ${i === 0 ? "mt-5" : ""}`}>×</button>
                    )}
                  </div>
                  {available !== null && (
                    <p className={`text-xs ${insufficient ? "text-red-600" : "text-gray-500"}`}>
                      {insufficient ? `⚠ Жеткіліксіз: қол жетімді ${available}` : `Қоймада қол жетімді: ${available}`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Жоба құру</button>
          <button type="button" onClick={() => router.back()} className="px-5 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50">Болдырмау</button>
        </div>
      </form>
    </div>
  );
}

const inp = "w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500";
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>;
}
