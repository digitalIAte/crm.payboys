"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Template {
    id: string;
    name: string;
    channel: "whatsapp" | "email";
    subject?: string;
    body: string;
}

export default function TemplatesManager() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    // Form state
    const [name, setName] = useState("");
    const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/templates")
            .then(res => res.json())
            .then(d => {
                if (d.templates) setTemplates(d.templates);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { name, channel, subject, body };

        const res = await fetch("/api/templates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const data = await res.json();
            setTemplates(prev => [...prev, data.template].sort((a, b) => a.name.localeCompare(b.name)));
            setIsFormOpen(false);
            setName(""); setSubject(""); setBody(""); // reset form
            startTransition(() => router.refresh());
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-gradient-to-r from-payboys to-blue-600 rounded-xl p-8 shadow-sm">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Plantillas de Mensajes</h2>
                    <p className="text-blue-100">Crea y gestiona respuestas rápidas para usar en WhatsApp y Email con tus leads.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="bg-white text-payboys px-5 py-2.5 rounded-lg font-bold shadow-sm hover:bg-gray-50 transition"
                >
                    + Nueva Plantilla
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8 animate-in slide-in-from-top-4">
                    <h3 className="font-bold text-lg mb-4">Añadir nueva plantilla</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre (Uso interno)</label>
                                <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full border-gray-200 rounded-lg text-sm" placeholder="Ej: Primer contacto frío" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Canal</label>
                                <select value={channel} onChange={e => setChannel(e.target.value as any)} className="w-full border-gray-200 rounded-lg text-sm bg-white cursor-pointer">
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="email">Email</option>
                                </select>
                            </div>
                        </div>

                        {channel === "email" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Asunto del Email</label>
                                <input required value={subject} onChange={e => setSubject(e.target.value)} type="text" className="w-full border-gray-200 rounded-lg text-sm" placeholder="Ej: Propuesta de servicios Payboys" />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cuerpo del mensaje</label>
                            <p className="text-xs text-gray-400 mb-2">Puedes usar variables como <code className="bg-gray-100 px-1 rounded text-payboys">{'{{name}}'}</code>, <code className="bg-gray-100 px-1 rounded text-payboys">{'{{email}}'}</code> que se auto-rellenarán.</p>
                            <textarea required value={body} onChange={e => setBody(e.target.value)} rows={5} className="w-full border-gray-200 rounded-lg text-sm resize-none"></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">Cancelar</button>
                            <button type="submit" disabled={isPending} className="px-4 py-2 text-sm bg-payboys text-white rounded-lg font-bold shadow-sm hover:bg-blue-600 transition disabled:opacity-50">Guardar plantilla</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div className="h-48 bg-gray-100 animate-pulse rounded-xl"></div></div>
            ) : templates.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-100 border-dashed">
                    <p className="text-gray-500 font-medium">No hay plantillas creadas todavía.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(t => (
                        <div key={t.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition">
                            <div className={`px-5 py-3 border-b flex items-center justify-between ${t.channel === 'whatsapp' ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'}`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{t.channel === 'whatsapp' ? '💬' : '✉️'}</span>
                                    <h3 className="font-bold text-gray-900 truncate" title={t.name}>{t.name}</h3>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                {t.channel === 'email' && t.subject && (
                                    <div className="mb-3 text-sm">
                                        <p className="font-semibold text-gray-700">Asunto:</p>
                                        <p className="text-gray-600 truncate">{t.subject}</p>
                                    </div>
                                )}
                                <div className="text-sm bg-gray-50 rounded-lg p-3 text-gray-600 whitespace-pre-wrap flex-1 border border-gray-100/50">
                                    {t.body}
                                </div>
                            </div>

                            <div className="px-5 py-3 border-t bg-gray-50/50 flex justify-end">
                                <button
                                    onClick={() => copyToClipboard(t.body, t.id)}
                                    className={`text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5
                                        ${copiedId === t.id ? 'bg-emerald-100 text-emerald-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                                >
                                    {copiedId === t.id ? '✅ Copiado' : '📄 Copiar'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
