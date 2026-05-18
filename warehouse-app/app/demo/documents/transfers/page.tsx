"use client";

import Link from "next/link";
import { useDemo } from "@/lib/demo/store";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    DRAFT: { label: "Жоба", cls: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { label: "Расталды", cls: "bg-green-100 text-green-700" },
    CANCELLED: { label: "Болдырылмады", cls: "bg-gray-100 text-gray-500" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-500" };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{label}</span>;
}

export default function DemoTransfers() {
  const { state } = useDemo();
  const transfers = [...state.transfers].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-semibold">Ауыстырулар</h1><p className="text-sm text-gray-500">Қоймалар арасындағы ауыстыру құжаттары</p></div>
        <Link href="/demo/documents/transfers/new" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">+ Жаңа ауыстыру</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Нөмірі</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Күні</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Қайдан</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Қайда</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Позициялар</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Күйі</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transfers.map((doc) => {
              const fromWh = state.warehouses.find((w) => w.id === doc.fromWarehouseId);
              const toWh = state.warehouses.find((w) => w.id === doc.toWarehouseId);
              return (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/demo/documents/transfers/${doc.id}`} className="font-mono font-medium text-blue-600 hover:underline">{doc.documentNumber}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{doc.date}</td>
                  <td className="px-4 py-3">{fromWh?.name ?? "—"}</td>
                  <td className="px-4 py-3">{toWh?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-right">{doc.items.length}</td>
                  <td className="px-4 py-3"><StatusBadge status={doc.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
