import { getLeadById, getKanbanColumns } from "@/lib/services";
import Link from "next/link";
import LeadActions from "./LeadActions";
import TagsEditor from "./TagsEditor";
import RemindersPanel from "./RemindersPanel";
import DuplicateDetector from "./DuplicateDetector";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
    const [rawData, columns] = await Promise.all([
        getLeadById(params.id),
        getKanbanColumns()
    ]);

    if (!rawData || !rawData.lead) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900">Lead not found</h2>
                <Link href="/crm/leads" className="text-indigo-600 hover:text-indigo-900 mt-4 inline-block">← Back to Leads</Link>
            </div>
        );
    }

    const { lead, conversations, activities } = rawData;
    const initialTags = lead.tags || [];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <DuplicateDetector lead={lead} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Link href="/crm/leads" className="text-payboys-dark hover:text-payboys font-bold flex items-center">&larr; Back to Leads</Link>
            </div>

            <div className="bg-white shadow-sm rounded-xl p-8 border border-gray-100 flex flex-col md:flex-row justify-between items-start">
                <div className="mb-6 md:mb-0">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">{lead.name || "Unknown"}</h2>
                    <p className="text-gray-500">{lead.email} {lead.phone ? `| ${lead.phone}` : ""}</p>
                    <div className="mt-5 flex items-center space-x-3">
                        <span className="bg-gradient-to-r from-payboys-light to-payboys text-black font-bold text-xs px-3 py-1 rounded-full border border-payboys/20 shadow-sm">
                            Score: {lead.score}
                        </span>
                        <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full border border-slate-200">
                            Owner: {lead.owner_email || "Unassigned"}
                        </span>
                    </div>
                </div>
                <div className="text-left md:text-right text-sm text-gray-400">
                    <p>Created: {new Date(lead.created_at).toLocaleDateString()}</p>
                    <p>ID: <span className="font-mono text-xs">{lead.id.split('-').pop()}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Timeline Conversations */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Conversations History</h3>
                    {conversations.length === 0 ? <p className="text-gray-500 text-sm italic">No conversations recorded yet.</p> :
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {conversations.map((c: any) => (
                                <div key={c.id} className="bg-blue-50/50 rounded-lg p-4 border border-blue-100/50 transition duration-150 hover:shadow-md">
                                    <div className="text-xs text-blue-800 mb-2 font-semibold flex justify-between">
                                        <span className="uppercase tracking-wider">Source: {c.source}</span>
                                        <span className="text-blue-600/70">{new Date(c.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{c.transcript}</p>
                                </div>
                            ))}
                        </div>
                    }
                    <TagsEditor leadId={lead.id} initialTags={initialTags} />
                </div>

                {/* Activities and Tracking */}
                <div className="space-y-6">
                    <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6 space-y-4">
                        <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Interaction Tracking</h3>

                        <LeadActions lead={lead} columns={columns} />

                        <div className="mt-8 space-y-3">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Activity Log</h4>
                            {activities.length === 0 ? <p className="text-gray-400 text-sm italic">No activities yet.</p> :
                                activities.map((a: any) => (
                                    <div key={a.id} className="group flex flex-col justify-center py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-4 px-4 transition duration-150">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="w-2 h-2 rounded-full bg-payboys"></span>
                                                <strong className="text-sm font-semibold text-gray-800 capitalize">{a.type}</strong>
                                            </div>
                                            <span className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">{new Date(a.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 pl-4">{a.note}</p>
                                        <div className="text-[10px] text-gray-400 mt-1 pl-4 uppercase">By: {a.owner_email || a.source || "System"}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <RemindersPanel leadId={lead.id} />
                </div>
            </div>
        </div>
    );
}
