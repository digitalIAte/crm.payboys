import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import { Lead } from "@/lib/api";
import { KanbanColumn } from "@/lib/services";
import { addKanbanColumnAction, updateKanbanColumnAction } from "./bulk-actions";

export default function KanbanBoard({ leads, columns, onStatusUpdate }: { leads: Lead[], columns: KanbanColumn[], onStatusUpdate: (ids: string[], status: string) => Promise<boolean> }) {
    const [localLeads, setLocalLeads] = useState<Lead[]>(leads);
    const [isPending, startTransition] = useTransition();

    const [editingColId, setEditingColId] = useState<string | null>(null);
    const [editColName, setEditColName] = useState("");

    const [isAddingCol, setIsAddingCol] = useState(false);
    const [newColName, setNewColName] = useState("");

    const editInputRef = useRef<HTMLInputElement>(null);
    const newColInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingColId && editInputRef.current) editInputRef.current.focus();
        if (isAddingCol && newColInputRef.current) newColInputRef.current.focus();
    }, [editingColId, isAddingCol]);

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

    const saveEditCol = () => {
        if (!editingColId || !editColName.trim()) {
            setEditingColId(null);
            return;
        }
        startTransition(async () => {
            await updateKanbanColumnAction(editingColId, editColName.trim());
            setEditingColId(null);
        });
    };

    const saveNewCol = () => {
        if (!newColName.trim()) {
            setIsAddingCol(false);
            return;
        }
        startTransition(async () => {
            await addKanbanColumnAction(newColName.trim(), "border-gray-200 bg-gray-50/50");
            setIsAddingCol(false);
            setNewColName("");
        });
    };

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)] min-h-[500px] items-start">
            {columns.map((col, index) => {
                const columnLeads = localLeads.filter(l => l.status === col.id || (!l.status && index === 0)); // Put unassigned in first column

                return (
                    <div
                        key={col.id}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, col.id)}
                        className={`flex-none w-80 flex flex-col rounded-xl border border-gray-200 bg-gray-50/30 transition-colors h-full`}
                    >
                        <div className={`p-4 border-b ${col.color || "border-gray-200 bg-white"} rounded-t-xl group`}>
                            {editingColId === col.id ? (
                                <input
                                    ref={editInputRef}
                                    type="text"
                                    value={editColName}
                                    onChange={(e) => setEditColName(e.target.value)}
                                    onBlur={saveEditCol}
                                    onKeyDown={(e) => e.key === 'Enter' && saveEditCol()}
                                    className="w-full text-gray-800 font-bold bg-white/80 border-b border-payboys outline-none px-1 py-0.5 rounded shadow-inner"
                                />
                            ) : (
                                <div className="flex items-center justify-between">
                                    <h3
                                        className="font-bold text-gray-800 flex-1 truncate cursor-pointer hover:text-payboys transition-colors"
                                        onClick={() => { setEditingColId(col.id); setEditColName(col.title); }}
                                        title="Click para editar"
                                    >
                                        {col.title}
                                    </h3>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-gray-500 shadow-sm border border-gray-100 ml-2 shrink-0">
                                        {columnLeads.length}
                                    </span>
                                </div>
                            )}
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
                                        <h4 className="font-semibold text-gray-900 group-hover:text-payboys transition-colors truncate pr-2">
                                            {lead.name || "Unknown"}
                                        </h4>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 shrink-0">
                                            <div className="w-1.5 h-1.5 rounded-full bg-payboys"></div>
                                            <span className="text-xs font-medium text-gray-600">{lead.score}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3 truncate">{lead.email}</p>

                                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider truncate mr-2">
                                            {lead.stage || "—"}
                                        </span>
                                        <Link
                                            href={`/crm/leads/${lead.id}`}
                                            className="text-xs font-medium text-payboys hover:text-payboys-dark shrink-0"
                                        >
                                            Ver →
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

            {/* Add New Column Button / Input */}
            <div className="flex-none w-80">
                {isAddingCol ? (
                    <div className="bg-white p-3 rounded-xl border border-payboys shadow-md flex items-center gap-2">
                        <input
                            ref={newColInputRef}
                            type="text"
                            placeholder="Nombre de la columna..."
                            value={newColName}
                            onChange={(e) => setNewColName(e.target.value)}
                            onBlur={saveNewCol}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') saveNewCol();
                                if (e.key === 'Escape') { setIsAddingCol(false); setNewColName(""); }
                            }}
                            className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-payboys"
                        />
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAddingCol(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-dashed border-gray-300 rounded-xl transition-colors font-medium text-sm"
                    >
                        <span className="text-lg">+</span> Añadir Columna
                    </button>
                )}
            </div>
        </div>
    );
}
