export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white font-sans selection:bg-payboys selection:text-black relative overflow-hidden">

            {/* Big background logo */}
            <img
                src="/images/logo_payboys.png"
                alt=""
                className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none select-none"
                aria-hidden="true"
            />

            {/* Ambient gold glow behind form */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-payboys/10 blur-[140px] rounded-full pointer-events-none" />

            {/* Login Form */}
            <div className="max-w-md w-full space-y-8 relative z-10 bg-neutral-900/70 backdrop-blur-xl p-10 rounded-2xl border border-neutral-800 shadow-2xl mx-4">

                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Iniciar Sesión</h2>
                    <p className="text-neutral-400 mt-2 text-sm">Ingresa tus credenciales para acceder al CRM.</p>
                </div>

                <form className="mt-8 space-y-6" action="/crm/leads">
                    <input type="hidden" name="remember" defaultValue="true" />

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-neutral-300 mb-1.5">Correo Electrónico</label>
                            <input id="email-address" name="email" type="email" required className="appearance-none block w-full px-4 py-3 bg-black/50 border border-neutral-800 rounded-xl placeholder-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-payboys focus:border-transparent transition-all duration-200 sm:text-sm" placeholder="tu@email.com" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1.5">Contraseña</label>
                            <input id="password" name="password" type="password" required className="appearance-none block w-full px-4 py-3 bg-black/50 border border-neutral-800 rounded-xl placeholder-neutral-600 text-white focus:outline-none focus:ring-2 focus:ring-payboys focus:border-transparent transition-all duration-200 sm:text-sm" placeholder="••••••••" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-payboys focus:ring-payboys border-neutral-700 rounded bg-black/50 accent-payboys" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-400">
                                Recordarme
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-payboys hover:text-payboys-light transition-colors">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-payboys hover:bg-[#e6ad06] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-payboys focus:ring-offset-[#0a0a0a] transition-all duration-200 shadow-[0_0_20px_rgba(255,193,7,0.3)] hover:shadow-[0_0_25px_rgba(255,193,7,0.4)]">
                            Entrar al CRM
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}
