"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lead } from "@/lib/api";
import { KanbanColumn } from "@/lib/services";
import { submitLeadUpdate, submitNewActivity, triggerWhatsApp, triggerEmail, deleteLead } from "./actions";
import { Mail, MessageCircle, Trash2 } from "lucide-react";

export default function LeadActions({ lead, columns }: { lead: Lead, columns: KanbanColumn[] }) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [note, setNote] = useState("");
    const [isAddingNote, setIsAddingNote] = useState(false);

    const [isActioning, setIsActioning] = useState(false);

    const [currentStatus, setCurrentStatus] = useState(lead.status || (columns?.[0]?.id || ""));
    const [currentStage, setCurrentStage] = useState(lead.stage);

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        const prevStatus = currentStatus;
        setCurrentStatus(newStatus); // Optimistic update
        try {
            await submitLeadUpdate(lead.id, { status: newStatus });
            router.refresh(); // Tells Next.js to re-fetch Server Component data
        } catch (error) {
            setCurrentStatus(prevStatus); // Revert on error
            alert("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleStageChange = async (newStage: string) => {
        setIsUpdating(true);
        const prevStage = currentStage;
        setCurrentStage(newStage); // Optimistic update
        try {
            await submitLeadUpdate(lead.id, { stage: newStage });
            router.refresh();
        } catch (error) {
            setCurrentStage(prevStage); // Revert on error
            alert("Failed to update stage");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddNote = async () => {
        if (!note.trim()) return;
        setIsAddingNote(true);
        try {
            await submitNewActivity({
                lead_id: lead.id,
                type: "note",
                note: note,
                source: "Dashboard User"
            });
            setNote("");
            router.refresh();
        } catch (error) {
            alert("Failed to add note");
        } finally {
            setIsAddingNote(false);
        }
    };

    return (
        <>
            {/* Status & Stage Controls */}
            <div className="flex space-x-4 mb-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Status</label>
                    <select
                        disabled={isUpdating}
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 text-sm"
                    >
                        {columns && columns.length > 0 ? columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>) : (
                            <>
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="qualified">Qualified</option>
                                <option value="lost">Lost</option>
                            </>
                        )}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Stage</label>
                    <select
                        disabled={isUpdating}
                        value={currentStage}
                        onChange={(e) => handleStageChange(e.target.value)}
                        className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 text-sm"
                    >
                        <option value="inbound">Inbound</option>
                        <option value="discovery">Discovery</option>
                        <option value="proposal">Proposal</option>
                        <option value="won">Won</option>
                    </select>
                </div>
                {isUpdating && <div className="flex items-center text-sm text-payboys animate-pulse mt-4">Saving...</div>}
            </div>

            {/* Quick Communicator */}
            <div className="pt-4 border-t border-gray-100 flex items-center space-x-3">
                <h4 className="text-sm font-semibold text-gray-500 mr-2 uppercase tracking-wide">Quick Outreach:</h4>
                <button
                    onClick={async () => {
                        setIsActioning(true);
                        const success = await triggerWhatsApp(lead, "¡Hola! Te contactamos de PAYBOYS.");
                        alert(success ? "WhatsApp message queued successfully!" : "Failed to queue WhatsApp message.");
                        setIsActioning(false);
                    }}
                    disabled={isActioning || !lead.phone}
                    className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                </button>
                <button
                    onClick={async () => {
                        setIsActioning(true);
                        const success = await triggerEmail(lead, "Seguimiento de PAYBOYS", "Hola, queríamos hacer un seguimiento de tu solicitud reciente.");
                        alert(success ? "Email queued successfully!" : "Failed to queue Email.");
                        setIsActioning(false);
                    }}
                    disabled={isActioning || !lead.email}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                    <Mail size={16} />
                    <span>Email</span>
                </button>
                {isActioning && <span className="text-sm text-gray-400 animate-pulse ml-4">Dispatching...</span>}
            </div>

            {/* Note Input */}
            <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">New Note</h4>
                <textarea
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-payboys outline-none"
                    rows={3}
                    placeholder="Add a note or log an external interaction..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={isAddingNote}
                />
                <button
                    onClick={handleAddNote}
                    disabled={isAddingNote || !note.trim()}
                    className="mt-2 bg-payboys text-black text-sm font-bold px-5 py-2 rounded-md hover:bg-payboys-dark disabled:opacity-50 transition-colors shadow-sm"
                >
                    {isAddingNote ? "Saving Note..." : "Save Note"}
                </button>
            </div>

            {/* Danger Zone */}
            <div className="mt-8 pt-4 border-t border-red-100">
                <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-3">Danger Zone</h4>
                <button
                    onClick={async () => {
                        const confirmed = window.confirm(`Are you sure you want to permanently delete the lead for ${lead.name}? This action cannot be undone.`);
                        if (!confirmed) return;
                        const ok = await deleteLead(lead.id, lead.email);
                        if (ok) {
                            router.push("/crm/leads");
                            router.refresh();
                        } else {
                            alert("Failed to delete lead. Please try again.");
                        }
                    }}
                    className="flex items-center space-x-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                    <Trash2 size={15} />
                    <span>Delete Lead</span>
                </button>
            </div>
        </>
    );
}
