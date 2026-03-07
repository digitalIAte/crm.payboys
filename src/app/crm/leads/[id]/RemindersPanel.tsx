"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Reminder {
    id: string;
    text: string;
    due_date: string;
    done: boolean;
}

export default function RemindersPanel({ leadId }: { leadId: string }) {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [text, setText] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        fetch(`/api/reminders?leadId=${leadId}`)
            .then(res => res.json())
            .then(data => {
                if (data.reminders) setReminders(data.reminders);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [leadId]);

    const addReminder = async () => {
        if (!text || !date) return;

        const payload = { lead_id: leadId, text, due_date: new Date(date).toISOString() };

        const res = await fetch("/api/reminders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const data = await res.json();
            setReminders(prev => [...prev, data.reminder].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()));
            setText("");
            setDate("");
            startTransition(() => router.refresh());
        }
    };

    const toggleReminder = async (id: string, currentDone: boolean) => {
        // Optimistic update
        setReminders(prev => prev.map(r => r.id === id ? { ...r, done: !currentDone } : r));

        const res = await fetch("/api/reminders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, done: !currentDone })
        });

        if (!res.ok) {
            // Revert
            setReminders(prev => prev.map(r => r.id === id ? { ...r, done: currentDone } : r));
        } else {
            startTransition(() => router.refresh());
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                📅 Tareas y Recordatorios
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {reminders.filter(r => !r.done).length} pendientes
                </span>
            </h3>

            {loading ? (
                <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div></div>
            ) : reminders.length === 0 ? (
                <p className="text-sm text-gray-500 italic mb-4">No hay tareas programadas para este lead.</p>
            ) : (
                <ul className="space-y-3 mb-6">
                    {reminders.map(r => {
                        const isOverdue = !r.done && new Date(r.due_date).getTime() < Date.now();
                        return (
                            <li key={r.id} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${r.done ? 'bg-gray-50 border-gray-100 opacity-60' : isOverdue ? 'bg-red-50/50 border-red-100' : 'bg-white border-gray-200 hover:border-payboys/30'}`}>
                                <input
                                    type="checkbox"
                                    checked={r.done}
                                    onChange={() => toggleReminder(r.id, r.done)}
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-payboys focus:ring-payboys"
                                />
                                <div className="flex-1">
                                    <p className={`text-sm ${r.done ? 'line-through text-gray-500' : 'text-gray-900 font-medium'}`}>
                                        {r.text}
                                    </p>
                                    <p className={`text-xs mt-1 font-medium ${r.done ? 'text-gray-400' : isOverdue ? 'text-red-600' : 'text-payboys'}`}>
                                        {isOverdue && !r.done && "⚠️ "}
                                        {new Date(r.due_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200/60">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Nueva Tarea</h4>
                <div className="space-y-3">
                    <input
                        type="text"
                        placeholder="Ej: Llamar para confirmar presupuesto..."
                        value={text}
                        onChange={e => setText(e.target.value)}
                        className="w-full text-sm border-gray-200 rounded-md py-2 focus:ring-payboys"
                    />
                    <div className="flex gap-2">
                        <input
                            type="datetime-local"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="flex-1 text-sm border-gray-200 rounded-md py-2 focus:ring-payboys"
                        />
                        <button
                            onClick={addReminder}
                            disabled={!text || !date || isPending}
                            className="bg-payboys text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-payboys-dark disabled:opacity-50 shadow-sm"
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
