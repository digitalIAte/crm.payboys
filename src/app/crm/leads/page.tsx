import { fetchLeads } from "@/lib/api";
import LeadsPageClient from "./LeadsPageClient";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
    const leads = await fetchLeads();
    return <LeadsPageClient initialLeads={leads} />;
}
