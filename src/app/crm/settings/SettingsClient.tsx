"use client";

import { useState } from "react";
import { Globe, Palette, Shield, Save, Key, User, CheckCircle2, AlertCircle } from "lucide-react";
import { saveSettingsAction, changePasswordAction } from "./actions";

interface SettingsClientProps {
    settings: any;
    userEmail: string;
}

export default function SettingsClient({ settings, userEmail }: SettingsClientProps) {
    const [activeTab, setActiveTab] = useState("general");
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{type: 'success' | 'error', msg: string} | null>(null);

    const showNotification = (type: 'success' | 'error', msg: string) => {
        setNotification({ type, msg });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleGeneralSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const res = await saveSettingsAction(formData);
        setLoading(false);
        if (res.success) {
            showNotification('success', "Configuración guardada correctamente");
        } else {
            showNotification('error', res.error || "Error al guardar");
        }
    };

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const res = await changePasswordAction(formData);
        setLoading(false);
        if (res.success) {
            showNotification('success', "Contraseña actualizada correctamente");
            (e.target as HTMLFormElement).reset();
        } else {
            showNotification('error', res.error || "Error al actualizar contraseña");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar Tabs */}
            <div className="space-y-2">
                <button 
                    onClick={() => setActiveTab("general")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activeTab === "general" 
                        ? "bg-digitaliate/10 text-digitaliate border border-digitaliate/20" 
                        : "text-gray-500 hover:bg-gray-50 border border-transparent"
                    }`}
                >
                    <Globe className={`mr-3 h-5 w-5 ${activeTab === "general" ? "text-digitaliate" : "text-gray-400"}`} />
                    General
                </button>
                <button 
                    onClick={() => setActiveTab("branding")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activeTab === "branding" 
                        ? "bg-digitaliate/10 text-digitaliate border border-digitaliate/20" 
                        : "text-gray-500 hover:bg-gray-50 border border-transparent"
                    }`}
                >
                    <Palette className={`mr-3 h-5 w-5 ${activeTab === "branding" ? "text-digitaliate" : "text-gray-400"}`} />
                    Branding
                </button>
                <button 
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                        activeTab === "security" 
                        ? "bg-digitaliate/10 text-digitaliate border border-digitaliate/20" 
                        : "text-gray-500 hover:bg-gray-50 border border-transparent"
                    }`}
                >
                    <Shield className={`mr-3 h-5 w-5 ${activeTab === "security" ? "text-digitaliate" : "text-gray-400"}`} />
                    Seguridad
                </button>
            </div>

            {/* Content Area */}
            <div className="md:col-span-2">
                {notification && (
                    <div className={`mb-6 p-4 rounded-2xl flex items-center animate-in fade-in slide-in-from-top-4 ${
                        notification.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                        {notification.type === 'success' ? <CheckCircle2 className="mr-3 h-5 w-5" /> : <AlertCircle className="mr-3 h-5 w-5" />}
                        <span className="font-bold text-sm tracking-tight">{notification.msg}</span>
                    </div>
                )}

                {activeTab === "general" && (
                    <form onSubmit={handleGeneralSave} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                                <Globe className="mr-3 h-6 w-6 text-digitaliate" />
                                Configuración General
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la Agencia</label>
                                    <input 
                                        name="agencyName"
                                        type="text" 
                                        defaultValue={settings.agency_name}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-digitaliate focus:border-transparent outline-none transition-all font-medium"
                                        placeholder="Ej: Digitaliate CRM"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">n8n Webhook URL (Leads)</label>
                                    <div className="relative">
                                        <input 
                                            name="webhookUrl"
                                            type="url" 
                                            defaultValue={settings.n8n_webhook_url}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-digitaliate focus:border-transparent outline-none transition-all pl-11 font-medium"
                                            placeholder="https://n8n.tudominio.com/webhook/..."
                                        />
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400 italic">URL utilizada para notificar eventos externos.</p>
                                </div>
                                <hr className="border-gray-50 my-6" />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        Integración de Calendly
                                    </h3>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Enlace de Calendly</label>
                                    <div className="relative">
                                        <input 
                                            name="calendlyUrl"
                                            type="url" 
                                            defaultValue={settings.calendly_url}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-digitaliate focus:border-transparent outline-none transition-all pl-11 font-medium"
                                            placeholder="https://calendly.com/su-usuario"
                                        />
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400 italic">Este enlace se usará para agendar reuniones desde las fichas de los leads.</p>
                                </div>
                                <input type="hidden" name="primaryColor" defaultValue={settings.primary_color} />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="flex items-center px-8 py-3 bg-digitaliate text-white font-bold rounded-2xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-digitaliate/20 disabled:opacity-50"
                            >
                                <Save className="mr-2 h-5 w-5" />
                                {loading ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === "branding" && (
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                                <Palette className="mr-3 h-6 w-6 text-digitaliate" />
                                Branding y Colores
                            </h2>
                            <div className="p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                                <Palette className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                <p className="text-gray-500 font-bold">Personalización visual avanzada próximamente.</p>
                                <p className="text-sm text-gray-400 mt-1">Podrás subir tu logo y cambiar los colores de la interfaz.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "security" && (
                    <form onSubmit={handlePasswordChange} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                        <div>
                            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                                <Shield className="mr-3 h-6 w-6 text-digitaliate" />
                                Seguridad de la Cuenta
                            </h2>
                            <div className="space-y-6">
                                <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                                    <div className="p-3 bg-white rounded-xl shadow-sm mr-4">
                                        <User className="h-6 w-6 text-digitaliate" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cuenta Activa</p>
                                        <p className="text-gray-900 font-black">{userEmail}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña Actual</label>
                                        <input 
                                            name="currentPassword"
                                            type="password" 
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-digitaliate focus:border-transparent outline-none transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nueva Contraseña</label>
                                        <input 
                                            name="newPassword"
                                            type="password" 
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-digitaliate focus:border-transparent outline-none transition-all font-medium"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
                                        <input 
                                            name="confirmPassword"
                                            type="password" 
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-digitaliate focus:border-transparent outline-none transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="flex items-center px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black hover:-translate-y-0.5 transition-all shadow-lg disabled:opacity-50"
                            >
                                <Key className="mr-2 h-5 w-5" />
                                {loading ? "Actualizando..." : "Actualizar Contraseña"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
