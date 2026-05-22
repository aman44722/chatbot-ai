import { io } from "socket.io-client";

const SOCKET_URL = (process.env.REACT_APP_AUTH_API || "http://localhost:5000/api/auth").replace("/api/auth", "");

let socket = null;

export function connectSocket() {
    if (socket?.connected) return socket;
    socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    return socket;
}

export function getSocket() {
    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

export function joinConversation(chatbotId, sessionId) {
    if (socket?.connected) {
        socket.emit("join-conversation", { chatbotId, sessionId });
    }
}

export function leaveConversation(chatbotId, sessionId) {
    if (socket?.connected) {
        socket.emit("leave-conversation", { chatbotId, sessionId });
    }
}