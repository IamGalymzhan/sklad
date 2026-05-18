"use client";

import { useDemo } from "@/lib/demo/store";

const ACTION_LABELS: Record<string, string> = {
  CREATE: "Құру",
  UPDATE: "Өзгерту",
  CONFIRM: "Растау",
  DELETE: "Жою",
};

const ENTITY_LABELS: Record<string, string> = {
  Product: "Тауар",
  Category: "Санат",
  Unit: "Өлш. бір.",
  Warehouse: "Қойма",
  StorageLocation: "Сақтау орны",
  Supplier: "Жеткізуші",
  ReceiptDocument: "Кіріс",
  IssueDocument: "Шығыс",
  TransferDocument: "Ауыстыру",
  User: "Пайдаланушы",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("kk-KZ", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function DemoAudit() {
  const { state } = useDemo();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Әрекеттер журналы</h1>
        <p className="text-sm text-gray-500">Жүйедегі өзгерістер тарихы</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Күні</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Пайдаланушы</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Әрекет</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Объект</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Толық мәлімет</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {state.auditLog.map((entry) => {
              const user = state.users.find((u) => u.id === entry.userId);
              return (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(entry.createdAt)}</td>
                  <td className="px-4 py-3 font-medium">{user?.name ?? entry.userId}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      entry.action === "CONFIRM" ? "bg-green-100 text-green-700"
                      : entry.action === "CREATE" ? "bg-blue-100 text-blue-700"
                      : entry.action === "DELETE" ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                    }`}>
                      {ACTION_LABELS[entry.action] ?? entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{ENTITY_LABELS[entry.entityType] ?? entry.entityType}</td>
                  <td className="px-4 py-3 text-gray-500">{entry.details ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
