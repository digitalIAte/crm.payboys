"use client";

import { useState } from "react";
import { Lead } from "@/lib/api";
import { KanbanColumn } from "@/lib/services";
import LeadsClient from "./LeadsClient";
import KanbanBoard from "./KanbanBoard";
import { bulkDeleteLeads, bulkUpdateStatus } from "./bulk-actions";

export default function LeadsPageClient({ initialLeads, columns }: { initialLeads: Lead[], columns: KanbanColumn[] }) {
    console.log("LeadsPageClient received leads:", initialLeads?.length || 0);
    const [view, setView] = useState<"table" | "kanban">("table");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Leads Pipeline</h2>
                <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setView("table")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${view === "table" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        ☰ Tabla
                    </button>
                    <button
                        onClick={() => setView("kanban")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${view === "kanban" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        ◫ Kanban
                    </button>
                </div>
            </div>

            {view === "table" ? (
                <LeadsClient
                    leads={initialLeads}
                    columns={columns}
                    onBulkDelete={bulkDeleteLeads}
                    onBulkStatus={bulkUpdateStatus}
                />
            ) : (
                <KanbanBoard leads={initialLeads} columns={columns} onStatusUpdate={bulkUpdateStatus} />
            )}
        </div>
    );
}
