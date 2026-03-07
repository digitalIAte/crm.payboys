import { Metadata } from "next";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
    title: "PAYBOYS CRM",
    description: "Intelligent Lead Management Dashboard",
};

export default function CRMLayout({ children }: { children: React.ReactNode }) {
    return <ClientLayout>{children}</ClientLayout>;
}
