import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatbotWidget from "./ChatbotWidget";

const DashboardLayout = ({ titulo, subtitulo, tabs, tabActiva, onCambiarTab, children, mostrarChatbot = false }) => {
    const [sidebarAbierto, setSidebarAbierto] = useState(false);

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">

            <Sidebar
                tabs={tabs}
                tabActiva={tabActiva}
                onCambiarTab={onCambiarTab}
                abierto={sidebarAbierto}
                onCerrar={() => setSidebarAbierto(false)}
            />

            <div className="flex min-h-screen min-w-0 flex-col lg:ml-72">

                {/* HEADER MÓVIL */}
                <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4 shadow-sm lg:hidden">
                    <button
                        type="button"
                        onClick={() => setSidebarAbierto(true)}
                        className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
                        aria-label="Abrir menú"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    <div className="min-w-0">
                        <h1 className="truncate text-base font-extrabold text-gray-900">
                            {titulo}
                        </h1>

                        {subtitulo && (
                            <p className="truncate text-xs text-gray-500">
                                {subtitulo}
                            </p>
                        )}
                    </div>
                </header>

                {/* HEADER DESKTOP */}
                <header className="hidden shrink-0 border-b border-gray-200 bg-white px-6 py-6 lg:block xl:px-8">
                    <div className="mx-auto w-full max-w-[1800px]">
                        <h1 className="text-2xl font-extrabold text-gray-900">
                            {titulo}
                        </h1>

                        {subtitulo && (
                            <p className="mt-1 text-sm text-gray-500">
                                {subtitulo}
                            </p>
                        )}
                    </div>
                </header>

                {/* CONTENIDO */}
                <main className="min-h-screen min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
                    <div className="mx-auto w-full max-w-[1800px] min-w-0">
                        {children}
                    </div>
                </main>
            </div>

            {mostrarChatbot && <ChatbotWidget />}
        </div>
    );
};

export default DashboardLayout;