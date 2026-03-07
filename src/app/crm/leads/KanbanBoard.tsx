"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Lead } from "@/lib/api";

const COLUMNS = [
    { id: "new", title: "Nuevos", color: "border-blue-200 bg-blue-50/50" },
    { id: "contacted", title: "Contactados", color: "border-yellow-200 bg-yellow-50/50" },
    { id: "qualified", title: "Cualificados", color: "border-emerald-200 bg-emerald-50/50" },
    { id: "lost", title: "Perdidos", color: "border-red-200 bg-red-50/50" }
];

export default function KanbanBoard({ leads, onStatusUpdate }: { leads: Lead[], onStatusUpdate: (ids: string[], status: string) => Promise<boolean> }) {
    const [localLeads, setLocalLeads] = useState<Lead[]>(leads);
    const [isPending, startTransition] = useTransition();

    const handleDragStart = (e: React.DragEvent, leadId: string) => {
        e.dataTransfer.setData("leadId", leadId);
        e.currentTarget.classList.add("opacity-50");
    };

    const handleDragEnd = (e: React.DragEvent) => {
        e.currentTarget.classList.remove("opacity-50");
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add("bg-gray-100/50");
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove("bg-gray-100/50");
    };

    const handleDrop = (e: React.DragEvent, columnId: string) => {
        e.preventDefault();
        e.currentTarget.classList.remove("bg-gray-100/50");
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
        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)] min-h-[500px]">
            {COLUMNS.map(col => {
                const columnLeads = localLeads.filter(l => l.status === col.id || (!l.status && col.id === "new"));

                return (
                    <div
                        key={col.id}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, col.id)}
                        className={`flex-1 min-w-[300px] max-w-[400px] flex flex-col rounded-xl border border-gray-200 bg-gray-50/30 transition-colors`}
                    >
                        <div className={`p-4 border-b ${col.color} rounded-t-xl bg-white`}>
                            <h3 className="font-bold text-gray-800 flex items-center justify-between">
                                {col.title}
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-gray-500 shadow-sm border border-gray-100">
                                    {columnLeads.length}
                                </span>
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {columnLeads.map(lead => (
                                <div
                                    key={lead.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, lead.id)}
                                    onDragEnd={handleDragEnd}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-payboys/30 transition-all select-none group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-900 group-hover:text-payboys transition-colors">
                                            {lead.name || "Unknown"}
                                        </h4>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-payboys"></div>
                                            <span className="text-xs font-medium text-gray-600">{lead.score}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3 break-all">{lead.email}</p>

                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                                            {lead.stage || "—"}
                                        </span>
                                        <Link
                                            href={`/crm/leads/${lead.id}`}
                                            className="text-xs font-medium text-payboys hover:text-payboys-dark"
                                        >
                                            Ver lead →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            {columnLeads.length === 0 && (
                                <div className="h-24 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400">
                                    Mover leads aquí
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
