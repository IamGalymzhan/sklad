"use client";

import { useState } from "react";
import { useDemo } from "@/lib/demo/store";

export default function DemoSuppliers() {
  const { state, dispatch } = useDemo();
  const [f, setF] = useState({ name: "", contactPerson: "", phone: "", email: "", address: "" });
  const [open, setOpen] = useState(false);

  function create(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) return;
    dispatch({ type: "CREATE_SUPPLIER", name: f.name.trim(), contactPerson: f.contactPerson.trim() || undefined, phone: f.phone.trim() || undefined, email: f.email.trim() || undefined, address: f.address.trim() || undefined });
    dispatch({ type: "NOTIFY", message: "Жеткізуші құрылды", kind: "success" });
    setF({ name: "", contactPerson: "", phone: "", email: "", address: "" });
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-semibold">Жеткізушілер</h1><p className="text-sm text-gray-500">Жеткізушілер анықтамалығы</p></div>
        <button onClick={() => setOpen(!open)} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">+ Жеткізушіні қосу</button>
      </div>

      {open && (
        <form onSubmit={create} className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3 max-w-2xl">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="text-xs font-medium text-gray-700 block mb-1">Атауы *</label><input value={f.name} onChange={(e) => setF((x) => ({ ...x, name: e.target.value }))} className={inp} required /></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Байланыс тұлғасы</label><input value={f.contactPerson} onChange={(e) => setF((x) => ({ ...x, contactPerson: e.target.value }))} className={inp} /></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Телефон</label><input value={f.phone} onChange={(e) => setF((x) => ({ ...x, phone: e.target.value }))} className={inp} placeholder="+7 727 ..." /></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Email</label><input type="email" value={f.email} onChange={(e) => setF((x) => ({ ...x, email: e.target.value }))} className={inp} /></div>
            <div><label className="text-xs font-medium text-gray-700 block mb-1">Мекенжайы</label><input value={f.address} onChange={(e) => setF((x) => ({ ...x, address: e.target.value }))} className={inp} /></div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-3 py-2 bg-blue-600 text-white text-xs rounded-lg">Құру</button>
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 border border-gray-300 text-gray-600 text-xs rounded-lg">✕</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Атауы</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Байланыс</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Телефон</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Жеткізілімдер</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {state.suppliers.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-gray-600">{s.contactPerson ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{s.phone ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{s.email ?? "—"}</td>
                <td className="px-4 py-3 text-right">{state.receipts.filter((r) => r.supplierId === s.id).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const inp = "w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500";
