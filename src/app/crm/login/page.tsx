export default function Login() {
    return (
        <div className="min-h-screen flex bg-black text-white font-sans selection:bg-payboys selection:text-black">
            {/* Left Side: Graphic / Branding */}
            <div className="hidden lg:flex w-1/2 relative bg-neutral-900 border-r border-neutral-800 flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-40">
                    <img src="/images/PAYBOYS_hero_main.webp" alt="Background" className="w-full h-full object-cover filter mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-neutral-900/80 to-transparent" />
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <img src="/images/PAYBOYS_logo.webp" alt="PAYBOYS Logo" className="w-12 h-12 object-contain" />
                    <span className="text-2xl font-bold tracking-tight text-white">PAYBOYS</span>
                </div>

                <div className="relative z-10 mb-20 space-y-6">
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Eleva tus ventas <br /> <span className="text-payboys">al siguiente nivel.</span>
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-md leading-relaxed">
                        Gestiona tus leads, optimiza tus seguimientos y cierra más tratos con nuestra plataforma de CRM exclusiva.
                    </p>
                </div>

                <div className="relative z-10 text-neutral-500 text-sm font-medium">
                    © {new Date().getFullYear()} PAYBOYS. Todos los derechos reservados.
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0a0a0a]">
                <div className="max-w-md w-full space-y-8 relative">
                    {/* Background glow effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-payboys/20 blur-[100px] rounded-full pointer-events-none" />

                    <div className="text-center lg:text-left relative z-10">
                        <img src="/images/PAYBOYS_logo.webp" alt="PAYBOYS CRM" className="w-16 h-16 object-contain mx-auto lg:mx-0 mb-6 lg:hidden" />
                        <h2 className="text-3xl font-bold text-white tracking-tight">Iniciar Sesión</h2>
                        <p className="text-neutral-400 mt-2 text-sm">Ingresa tus credenciales para acceder al panel.</p>
                    </div>

                    <form className="mt-8 space-y-6 relative z-10" action="/crm/leads">
                        <input type="hidden" name="remember" defaultValue="true" />

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email-address" className="block text-sm font-medium text-neutral-300 mb-1.5">Correo Electrónico</label>
                                <input id="email-address" name="email" type="email" required className="appearance-none block w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl placeholder-neutral-500 text-white focus:outline-none focus:ring-2 focus:ring-payboys focus:border-transparent transition-all duration-200 sm:text-sm" placeholder="tu@email.com" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1.5">Contraseña</label>
                                <input id="password" name="password" type="password" required className="appearance-none block w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl placeholder-neutral-500 text-white focus:outline-none focus:ring-2 focus:ring-payboys focus:border-transparent transition-all duration-200 sm:text-sm" placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-payboys focus:ring-payboys border-neutral-700 rounded bg-neutral-900 accent-payboys" />
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
        </div>
    );
}
