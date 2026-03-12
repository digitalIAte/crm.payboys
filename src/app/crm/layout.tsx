"use client";

import Link from "next/link";
import { Users, LayoutDashboard, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import AuthProvider from "@/app/crm/AuthProvider";

export default function CRMLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/crm/login";

    if (isLoginPage) {
        return <div className="min-h-screen bg-[#0a0a0a]">{children}</div>;
    }

    return (
        <AuthProvider>
            <div className="flex h-screen bg-[#000000] text-gray-100">
                <Sidebar />
                <main className="flex-1 overflow-y-auto relative">
                    {/* Subtle top decoration */}
                    <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-payboys/10 to-transparent -z-10 pointer-events-none"></div>

                    <div className="p-10 pt-12 min-h-full">
                        {children}
                    </div>
                </main>
            </div>
        </AuthProvider>
    );
}
