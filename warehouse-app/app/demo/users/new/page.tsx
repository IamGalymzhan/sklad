"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo/store";
import { genId, now } from "@/lib/demo/types";

export default function DemoUserNew() {
  const router = useRouter();
  const { dispatch } = useDemo();
  const [f, setF] = useState({ name: "", email: "", role: "STOREKEEPER" as "ADMIN" | "STOREKEEPER" | "MANAGER" });
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.email.trim()) { setError("Міндетті өрістерді толтырыңыз"); return; }
    dispatch({
      type: "CREATE_USER",
      u: { id: genId(), name: f.name.trim(), email: f.email.trim(), role: f.role, isActive: true, createdAt: now() },
    });
    dispatch({ type: "NOTIFY", message: "Пайдаланушы құрылды", kind: "success" });
    router.push("/demo/users");
  }

  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <button onClick={() => router.back()} className="text-xs text-blue-600 hover:underline mb-1 block">← Пайдаланушыларға қайту</button>
        <h1 className="text-xl font-semibold">Жаңа пайдаланушы</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <F label="Толық аты *"><input value={f.name} onChange={(e) => setF((x) => ({ ...x, name: e.target.value }))} className={inp} required /></F>
        <F label="Email *"><input type="email" value={f.email} onChange={(e) => setF((x) => ({ ...x, email: e.target.value }))} className={inp} required /></F>
        <F label="Рөлі *">
          <select value={f.role} onChange={(e) => setF((x) => ({ ...x, role: e.target.value as typeof f.role }))} className={inp}>
            <option value="ADMIN">Әкімші</option>
            <option value="STOREKEEPER">Қойма меңгерушісі</option>
            <option value="MANAGER">Менеджер</option>
          </select>
        </F>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-700">
          Демо-режимде құпиясөз тағайындалмайды. Жұмыс жүйесінде жаңа пайдаланушы кіруге арналған сілтемесі бар хат алады.
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
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>;
}
