import { getLeads, getKanbanColumns } from "./src/lib/services.ts";

async function run() {
    console.time("getLeads");
    try {
        const leads = await getLeads();
        console.log("Leads count:", leads.length);
    } catch (e) {
        console.error("error getting leads", e);
    }
    console.timeEnd("getLeads");

    console.time("getKanbanColumns");
    try {
        const cols = await getKanbanColumns();
        console.log("Cols count:", cols.length);
    } catch (e) {
        console.error("error getting cols", e);
    }
    console.timeEnd("getKanbanColumns");
}

run();
