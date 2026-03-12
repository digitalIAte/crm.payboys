import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
    const session = await getServerSession();
    if (!session) {
        redirect("/crm/login");
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <CalendarClient />
        </div>
    );
}
