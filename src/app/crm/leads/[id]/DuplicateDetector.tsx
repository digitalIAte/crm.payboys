"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lead } from "@/lib/api";

export default function DuplicateDetector({ lead }: { lead: Lead }) {
    const [duplicates, setDuplicates] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!lead.email && !lead.phone) {
            setLoading(false);
            return;
        }

        const params = new URLSearchParams();
        if (lead.email) params.append("email", lead.email);
        if (lead.phone) params.append("phone", lead.phone);
        params.append("excludeId", lead.id);

        fetch(`/api/leads/duplicates?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                if (data.duplicates) setDuplicates(data.duplicates);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [lead]);

    if (loading || duplicates.length === 0) return null;

    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-md">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                        {duplicates.length === 1 ? 'Posible lead duplicado detectado' : `${duplicates.length} posibles leads duplicados`}
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                        <p>Hemos encontrado leads existentes con el mismo email o teléfono:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            {duplicates.map(dup => (
                                <li key={dup.id}>
                                    <Link href={`/crm/leads/${dup.id}`} className="font-semibold underline hover:text-yellow-600">
                                        {dup.name || "Unknown"} ({dup.email || dup.phone})
                                    </Link>
                                    <span className="text-xs ml-2 text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded">{dup.status}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
