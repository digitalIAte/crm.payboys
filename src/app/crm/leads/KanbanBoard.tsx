"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Lead } from "@/lib/api";

type Column = {
    id: string;
    title: string;
    color: string;
    isCustom?: boolean;
};

const INITIAL_COLUMNS: Column[] = [
    { id: "new", title: "Nuevos", color: "border-blue-800 bg-blue-900/20" },
    { id: "contacted", title: "Contactados", color: "border-payboys/40 bg-payboys/10" },
    { id: "qualified", title: "Cualificados", color: "border-emerald-800 bg-emerald-900/20" },
    { id: "lost", title: "Perdidos", color: "border-red-800 bg-red-900/20" }
];

export default function KanbanBoard({ leads, onStatusUpdate }: { leads: Lead[], onStatusUpdate: (ids: string[], status: string) => Promise<boolean> }) {
    const [localLeads, setLocalLeads] = useState<Lead[]>(leads);
    const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
    const [isPending, startTransition] = useTransition();

    const handleAddColumn = () => {
        const title = prompt("Nombre de la nueva columna:");
        if (title) {
            const id = title.toLowerCase().replace(/\s+/g, '-');
            setColumns([...columns, { id, title, color: "border-gray-700 bg-gray-800/30", isCustom: true }]);
        }
    };

    const handleDeleteColumn = (id: string, title: string) => {
        if (confirm(`¿Seguro que quieres borrar la columna "${title}"? Sus leads volverán a "Nuevos".`)) {
            setColumns(columns.filter(c => c.id !== id));
            setLocalLeads(localLeads.map(l => l.status === id ? { ...l, status: "new" } : l));
        }
    };

    const handleDragStart = (e: React.DragEvent, leadId: string) => {
        e.dataTransfer.setData("leadId", leadId);
        e.currentTarget.classList.add("opacity-50");
    };

    const handleDragEnd = (e: React.DragEvent) => {
        e.currentTarget.classList.remove("opacity-50");
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add("bg-white/5");
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove("bg-white/5");
    };

    const handleDrop = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        e.currentTarget.classList.remove("bg-white/5");
        const leadId = e.dataTransfer.getData("leadId");

        const targetLead = localLeads.find(l => l.id === leadId);
        if (!targetLead || targetLead.status === columnId) return;

        // Optimistic UI update
        const updatedLeads = localLeads.map(l =>
            l.id === leadId ? { ...l, status: columnId } : l
        );
        setLocalLeads(updatedLeads);

        startTransition(async () => {
            const success = await onStatusUpdate([leadId], columnId);
            if (!success) {
                // Revert on failure
                setLocalLeads(localLeads);
                alert("Error al actualizar el estado del lead. Por favor, inténtalo de nuevo.");
            }
        });
    };

    return (
        <div>
            <div className="mb-4 flex flex-wrap gap-3 items-center justify-end">
                <button
                    onClick={handleAddColumn}
                    className="bg-payboys/10 text-payboys hover:bg-payboys/20 border border-payboys/20 shadow-sm px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                >
                    + Añadir Columna
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)] min-h-[500px] scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {columns.map(col => {
                    const columnLeads = localLeads.filter(l => l.status === col.id || (!l.status && col.id === "new"));

                    return (
                        <div
                            key={col.id}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, col.id)}
                            className={`flex-1 min-w-[300px] max-w-[400px] flex flex-col rounded-xl border border-gray-800 bg-[#111111]/80 transition-colors shadow-sm`}
                        >
                            <div className={`p-4 border-b border-gray-800 ${col.color} rounded-t-xl bg-[#1a1a1a]`}>
                                <h3 className="font-bold text-white flex items-center justify-between">
                                    {col.title}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#222222] text-gray-300 shadow-sm border border-gray-700">
                                            {columnLeads.length}
                                        </span>
                                        {(col as any).isCustom && (
                                            <button onClick={() => handleDeleteColumn(col.id, col.title)} className="p-1 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded transition-colors" title="Borrar columna">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                                {columnLeads.map(lead => (
                                    <div
                                        key={lead.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, lead.id)}
                                        onDragEnd={handleDragEnd}
                                        className="bg-[#1a1a1a] p-4 rounded-lg shadow-sm border border-gray-800 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-payboys/40 transition-all select-none group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-white group-hover:text-payboys transition-colors">
                                                {lead.name || "Unknown"}
                                            </h4>
                                            <div className="flex items-center gap-1.5 bg-[#222222] px-2 py-1 rounded-md border border-gray-800">
                                                <div className="w-1.5 h-1.5 rounded-full bg-payboys shadow-[0_0_8px_rgba(255,193,7,0.8)]"></div>
                                                <span className="text-xs font-medium text-gray-300">{lead.score}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-3 break-all">{lead.email}</p>

                                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-800">
                                            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                                {lead.stage || "—"}
                                            </span>
                                            <Link
                                                href={`/crm/leads/${lead.id}`}
                                                className="text-xs font-medium text-payboys hover:text-payboys-dark transition-colors"
                                            >
                                                Ver lead →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                                {columnLeads.length === 0 && (
                                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-800 rounded-lg text-sm text-gray-600">
                                        Mover leads aquí
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
