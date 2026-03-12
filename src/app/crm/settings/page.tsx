import { Settings } from "lucide-react";
import { getWorkspaceSettings } from "@/lib/services";
import { getServerSession } from "next-auth/next";
import SettingsClient from "./SettingsClient";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await getServerSession();
    if (!session) {
        redirect("/crm/login");
    }

    const settings = await getWorkspaceSettings();

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center">
                    <Settings className="mr-4 h-10 w-10 text-digitaliate" />
                    Configuración
                </h1>
                <p className="text-gray-500 mt-2 text-lg">Gestiona tu espacio de trabajo e integraciones.</p>
            </div>

            <SettingsClient 
                settings={settings} 
                userEmail={session.user?.email || "admin@digitaliate.com"} 
            />
        </div>
    );
}
