import React, { useEffect, useRef, useState } from "react";
import { apiFetch } from "../utils/api";

const MENSAJE_BIENVENIDA = { remitente: "bot", contenido: "¡Hola! Soy el asistente virtual de JHM Tech Solutions 🤖. Es un gusto atenderte. ¿En qué puedo ayudarte hoy?" };

const ChatbotWidget = () => {
    const [abierto, setAbierto] = useState(false);
    const [mensajes, setMensajes] = useState([MENSAJE_BIENVENIDA]);
    const [texto, setTexto] = useState("");
    const [enviando, setEnviando] = useState(false);
    const [conversacionId, setConversacionId] = useState(null);
    const finRef = useRef(null);

    useEffect(() => { finRef.current?.scrollIntoView({ behavior: "smooth" }); }, [mensajes, abierto]);

    const enviarMensaje = async (e) => {
        e.preventDefault();
        const contenido = texto.trim();
        if (!contenido || enviando) return;

        const nuevoMensaje = { remitente: "usuario", contenido };
        const historial = [...mensajes, nuevoMensaje];

        setMensajes(historial);
        setTexto("");
        setEnviando(true);

        try {
            const data = await apiFetch("/chatbot/mensaje", {
                method: "POST",
                auth: true,
                body: { mensaje: contenido, conversacion_id: conversacionId, historial },
            });

            setConversacionId(data.conversacion_id);
            setMensajes((prev) => [...prev, { remitente: "bot", contenido: data.respuesta }]);
        } catch (error) {
            setMensajes((prev) => [...prev, { remitente: "bot", contenido: "Lo siento, en este momento no pude procesar tu solicitud. Por favor, inténtalo nuevamente en unos segundos." }]);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <>
            <button type="button" onClick={() => setAbierto((v) => !v)} aria-label={abierto ? "Cerrar asistente virtual" : "Abrir asistente virtual"} className="fixed bottom-24 right-20 z-[9998] flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-xl transition-all duration-300 hover:scale-105 sm:bottom-24 sm:right-20">
                {abierto ? <span className="text-3xl font-light text-gray-700">×</span> : <div className="relative h-full w-full"><img src="chat01.png" alt="Asistente virtual JHM Tech Solutions" className="h-full w-full object-cover" /><span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" /></div>}
            </button>

            {abierto && (
                <div className="fixed left-4 right-4 top-24 z-[9999] flex h-[min(560px,calc(100dvh-140px))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:left-auto sm:right-20 sm:top-24 sm:w-[380px]">
                    <div className="flex shrink-0 items-center gap-3 bg-gradient-to-r from-gray-950 via-gray-900 to-blue-950 px-4 py-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-blue-400 bg-white"><img src="chat01.png" alt="Asistente JHM Tech" className="h-full w-full object-cover" /><span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" /></div>
                        <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-white">Asistente JHM Tech</p><p className="text-xs text-gray-300">En línea · Atención con IA</p></div>
                        <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar chat" className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-gray-300 transition hover:bg-white/10 hover:text-white">×</button>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-3 py-4 sm:px-4">
                        {mensajes.map((m, idx) => (
                            <div key={idx} className={`flex items-end gap-2 ${m.remitente === "usuario" ? "justify-end" : "justify-start"}`}>
                                {m.remitente === "bot" && <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-white"><img src="chat01.png" alt="Bot" className="h-full w-full object-cover" /></div>}
                                <div className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3 py-2.5 text-sm leading-relaxed shadow-sm ${m.remitente === "usuario" ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md border border-gray-200 bg-white text-gray-700"}`}>{m.contenido}</div>
                            </div>
                        ))}

                        {enviando && <div className="flex items-center gap-2"><div className="h-7 w-7 overflow-hidden rounded-full border border-gray-200 bg-white"><img src="chat01.png" alt="Bot" className="h-full w-full object-cover" /></div><div className="rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3 shadow-sm"><div className="flex gap-1"><span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" /><span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" /><span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" /></div></div></div>}
                        <div ref={finRef} />
                    </div>

                    <form onSubmit={enviarMensaje} className="shrink-0 border-t border-gray-200 bg-white p-3">
                        <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 p-1.5 focus-within:border-blue-500 focus-within:bg-white">
                            <input type="text" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe tu mensaje..." maxLength={500} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-gray-700 outline-none placeholder:text-gray-400" />
                            <button type="submit" disabled={enviando || !texto.trim()} aria-label="Enviar mensaje" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M22 2 11 13" /><path strokeLinecap="round" strokeLinejoin="round" d="m22 2-7 20-4-9-9-4Z" /></svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatbotWidget;