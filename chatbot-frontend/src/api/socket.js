// WebSocket disabled on Vercel (no WebSocket support).
// Falls back to polling.
let socket = null;

const SOCKET_URL = (process.env.REACT_APP_AUTH_API || "http://localhost:5000/api/auth")
    .replace("/api/auth", "");

const IS_VERCEL = SOCKET_URL.includes("vercel.app");

export function connectSocket() {
    if (IS_VERCEL) return null;
    if (socket?.connected) return socket;

    try {
        const { io } = require("socket.io-client");
        socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 2,
            reconnectionDelay: 3000,
            timeout: 5000,
        });
        socket.on("connect_error", () => { socket = null; });
    } catch {
        socket = null;
    }
    return socket;
}

export function getSocket() {
    return socket;
}

export function disconnectSocket() {
    if (socket) { socket.disconnect(); socket = null; }
}

export function joinConversation(chatbotId, sessionId) {
    if (socket?.connected) socket.emit("join-conversation", { chatbotId, sessionId });
}

export function leaveConversation(chatbotId, sessionId) {
    if (socket?.connected) socket.emit("leave-conversation", { chatbotId, sessionId });
}