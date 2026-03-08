import { NextResponse } from "next/server";
import { getLeads } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const leads = await getLeads();
        return NextResponse.json(leads);
    } catch (error: any) {
        console.error("Fetch leads error:", error.message);
        return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
}
