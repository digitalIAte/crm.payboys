import { getLeads, getKanbanColumns } from "@/lib/services";
import LeadsPageClient from "./LeadsPageClient";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
    try {
        const [leads, columns] = await Promise.all([
            getLeads(),
            getKanbanColumns()
        ]);
        console.log(`LeadsPage fetched ${leads?.length || 0} leads and ${columns?.length || 0} columns`);
        return (
            <>
                <div id="debug-server-leads" style={{ display: 'none' }}>
                    {JSON.stringify({ count: leads?.length || 0, timestamp: new Date().toISOString() })}
                </div>
                <LeadsPageClient initialLeads={leads || []} columns={columns || []} />
            </>
        );
    } catch (error: any) {
        console.error("LeadsPage ERROR:", error);
        return (
            <div className="p-8 text-red-500 bg-red-50 rounded-xl border border-red-200">
                <h2 className="font-bold text-lg mb-2">Error cargando leads</h2>
                <p className="text-sm">{error.message}</p>
                <p className="text-xs mt-4 text-gray-400 font-mono">Verifica la conexión a la base de datos (DATABASE_URL).</p>
            </div>
        );
    }
}
