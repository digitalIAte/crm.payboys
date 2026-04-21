import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const currentId = searchParams.get("excludeId");

    if (!email && !phone) {
        return NextResponse.json({ duplicates: [] });
    }

    try {
        const client = await pool.connect();
        try {
            // Check for exact email or phone matches, excluding the current lead
            const result = await client.query(
                `SELECT id, name, email, status, created_at 
                 FROM pb_leads 
                 WHERE (email = $1 OR (phone = $2 AND phone IS NOT NULL AND phone != ''))
                 AND id != $3
                 LIMIT 5`,
                [email, phone, currentId]
            );

            return NextResponse.json({ duplicates: result.rows });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error("Duplicate detection DB error:", error.message);
        return NextResponse.json({ error: "Failed to check duplicates" }, { status: 500 });
    }
}
