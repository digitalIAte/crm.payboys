"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname === "/crm/login") {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative">
                {/* Subtle top decoration */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-payboys/10 to-transparent -z-10 pointer-events-none"></div>

                <div className="p-10 pt-12 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
