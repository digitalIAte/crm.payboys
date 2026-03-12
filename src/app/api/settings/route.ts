import { NextResponse } from "next/server";
import { getWorkspaceSettings } from "@/lib/services";
import { getServerSession } from "next-auth";

export async function GET() {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const settings = await getWorkspaceSettings();
        return NextResponse.json(settings);
    } catch (e) {
        return NextResponse.json({ error: "DB Error" }, { status: 500 });
    }
}
