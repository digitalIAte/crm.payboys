"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { Lead } from "@/lib/api";

const STATUS_OPTIONS = ["", "new", "contacted", "qualified", "lost"];
const STAGE_OPTIONS = ["", "Inbound", "Outbound", "Nurturing", "Closed"];

const STATUS_STYLES: Record<string, string> = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    contacted: "bg-yellow-50 text-yellow-700 border-yellow-200",
    qualified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    lost: "bg-red-50 text-red-700 border-red-200",
};

function exportToCSV(leads: Lead[]) {
    const headers = ["Name", "Email", "Phone", "Status", "Stage", "Score", "Owner", "Created"];
    const rows = leads.map(l => [
        l.name, l.email, l.phone || "", l.status, l.stage,
        l.score, l.owner_email, new Date(l.created_at).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "leads.csv"; a.click();
    URL.revokeObjectURL(url);
}

interface Props { leads: Lead[]; onBulkDelete?: (ids: string[]) => void; onBulkStatus?: (ids: string[], status: string) => void; }

export default function LeadsClient({ leads, onBulkDelete, onBulkStatus }: Props) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [stageFilter, setStageFilter] = useState("");
    const [minScore, setMinScore] = useState(0);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [bulkStatus, setBulkStatus] = useState("contacted");
    const [isPending, startTransition] = useTransition();

    const filtered = useMemo(() => leads.filter(l => {
        const q = search.toLowerCase();
        const matchSearch = !q || (l.name || "").toLowerCase().includes(q) || (l.email || "").toLowerCase().includes(q);
        const matchStatus = !statusFilter || l.status === statusFilter;
        const matchStage = !stageFilter || l.stage === stageFilter;
        const matchScore = l.score >= minScore;
        return matchSearch && matchStatus && matchStage && matchScore;
    }), [leads, search, statusFilter, stageFilter, minScore]);

    const allSelected = filtered.length > 0 && filtered.every(l => selected.has(l.id));

    function toggleAll() {
        setSelected(prev => {
            const next = new Set(prev);
            if (allSelected) filtered.forEach(l => next.delete(l.id));
            else filtered.forEach(l => next.add(l.id));
            return next;
        });
    }

    function toggleOne(id: string) {
        setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    }

    const selectedArr = Array.from(selected);

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <input
                    type="text" placeholder="🔍  Buscar por nombre o email..." value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 min-w-48 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-payboys/30"
                />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-payboys/30">
                    <option value="">Todos los estados</option>
                    {STATUS_OPTIONS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-payboys/30">
                    <option value="">Todas las etapas</option>
                    {STAGE_OPTIONS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Score ≥</span>
                    <input type="range" min={0} max={100} step={5} value={minScore} onChange={e => setMinScore(Number(e.target.value))}
                        className="w-24 accent-payboys" />
                    <span className="font-bold text-gray-700 w-6">{minScore}</span>
                </div>
                <button onClick={() => exportToCSV(filtered)}
                    className="ml-auto flex items-center gap-1.5 bg-payboys text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-payboys-dark transition-colors shadow-sm">
                    ⬇︎ Exportar CSV
                </button>
            </div>

            {/* Bulk action bar */}
            {selected.size > 0 && (
                <div className="flex items-center gap-3 bg-payboys/10 border border-payboys/20 px-4 py-3 rounded-xl text-sm font-medium text-payboys-dark">
                    <span className="font-bold">{selected.size} seleccionado{selected.size > 1 ? "s" : ""}</span>
                    <div className="flex items-center gap-2 ml-auto">
                        <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}
                            className="border border-payboys/30 rounded-lg px-2 py-1.5 text-sm bg-white">
                            {STATUS_OPTIONS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={() => { startTransition(() => onBulkStatus?.(selectedArr, bulkStatus)); setSelected(new Set()); }}
                            className="bg-payboys text-white px-3 py-1.5 rounded-lg hover:bg-payboys-dark transition">
                            Cambiar estado
                        </button>
                        <button onClick={() => { if (confirm(`¿Borrar ${selected.size} leads?`)) { startTransition(() => onBulkDelete?.(selectedArr)); setSelected(new Set()); } }}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition">
                            🗑 Borrar
                        </button>
                    </div>
                </div>
            )}

            {/* Results count */}
            <p className="text-xs text-gray-400 px-1">{filtered.length} lead{filtered.length !== 1 ? "s" : ""} mostrado{filtered.length !== 1 ? "s" : ""}</p>

            {/* Table */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 w-10">
                                <input type="checkbox" checked={allSelected} onChange={toggleAll}
                                    className="rounded accent-payboys cursor-pointer" />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Origen</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Etapa</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Creado</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Acción</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {filtered.length === 0 ? (
                            <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No hay leads que coincidan con los filtros.</td></tr>
                        ) : filtered.map(lead => (
                            <tr key={lead.id} className={`hover:bg-slate-50 transition-colors ${selected.has(lead.id) ? "bg-blue-50/50" : ""}`}>
                                <td className="px-4 py-4">
                                    <input type="checkbox" checked={selected.has(lead.id)} onChange={() => toggleOne(lead.id)}
                                        className="rounded accent-payboys cursor-pointer" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-payboys to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                            {(lead.name || "?").charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">{lead.name || "Unknown"}</div>
                                            <div className="text-xs text-gray-500">{lead.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lead.source === 'formulario' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}`}>
                                        {lead.source === 'formulario' ? '📝 Formulario' : '🤖 Chatbot'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full border ${STATUS_STYLES[lead.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.stage || "—"}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-14 bg-gray-200 rounded-full h-1.5">
                                            <div className="h-1.5 rounded-full bg-payboys" style={{ width: `${lead.score}%` }} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{lead.score}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.owner_email || "—"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(lead.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <Link href={`/crm/leads/${lead.id}`}
                                        className="text-payboys font-medium hover:text-payboys-dark bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 text-sm transition-colors">
                                        Ver →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
