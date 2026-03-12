import { getLeads } from "@/lib/services";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
    let leads: any[] = [];
    let error: string | null = null;
    let poolStats: any = {};
    let envCheck = {
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlStart: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + "..." : "missing",
        nodeEnv: process.env.NODE_ENV
    };

    try {
        leads = await getLeads();
        poolStats = {
            totalCount: (pool as any).totalCount,
            idleCount: (pool as any).idleCount,
            waitingCount: (pool as any).waitingCount
        };
    } catch (e: any) {
        error = e.message;
    }

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Debug DB Connection</h1>

            <section className="bg-gray-100 p-4 rounded">
                <h2 className="font-bold">Environment</h2>
                <pre>{JSON.stringify(envCheck, null, 2)}</pre>
            </section>

            <section className="bg-gray-100 p-4 rounded">
                <h2 className="font-bold">Pool Stats</h2>
                <pre>{JSON.stringify(poolStats, null, 2)}</pre>
            </section>

            <section className="bg-gray-100 p-4 rounded">
                <h2 className="font-bold">Results</h2>
                <p>Leads Count: {leads.length}</p>
                {error && <p className="text-red-500">Error: {error}</p>}
                <div className="mt-2 text-xs overflow-auto max-h-40">
                    <pre>{JSON.stringify(leads.slice(0, 2), null, 2)}</pre>
                </div>
            </section>
        </div>
    );
}
