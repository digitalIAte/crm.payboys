import { fetchLeads } from "@/lib/api";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CRMPage() {
    const leads = await fetchLeads();

    // Calculate KPIs
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(l => l.status === "qualified").length;
    const avgScore = totalLeads > 0
        ? Math.round(leads.reduce((acc, l) => acc + (l.score || 0), 0) / totalLeads)
        : 0;

    // Get 5 most recent leads
    const recentLeads = [...leads]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
                <Link href="/crm/leads" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors">
                    View All Leads
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Leads</p>
                        <h3 className="text-4xl font-extrabold text-gray-900">{totalLeads}</h3>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-full">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Qualified</p>
                        <h3 className="text-4xl font-extrabold text-emerald-600">{qualifiedLeads}</h3>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-full">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-md">
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Avg Score</p>
                        <h3 className="text-4xl font-extrabold text-amber-500">{avgScore}</h3>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-full">
                        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                    </div>
                </div>
            </div>

            {/* Recent Leads Table */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Recent Leads</h3>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Last 5 additions</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Added</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {recentLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No leads found.</td>
                                </tr>
                            ) : recentLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold shadow-inner">
                                                {lead.name ? lead.name.charAt(0).toUpperCase() : "?"}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">{lead.name || "Unknown"}</div>
                                                <div className="text-xs text-gray-500">{lead.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border 
                                            ${lead.status === 'qualified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                lead.status === 'lost' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm font-medium text-gray-900">
                                            {lead.score}
                                            {lead.score >= 50 && <span className="ml-1.5 w-2 h-2 rounded-full bg-amber-400"></span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(lead.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <Link href={`/crm/leads/${lead.id}`} className="text-indigo-600 font-medium hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
