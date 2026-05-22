import axios from "axios";

const API = (process.env.REACT_APP_AUTH_API || "http://localhost:5000/api/auth").replace("/api/auth", "/api/conversation");

// Read fresh token on every call
const getToken = () => JSON.parse(localStorage.getItem("user"))?.token;

const authHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const fetchConversations = async (page = 1, limit = 50, botId = '') => {
    let url = `${API}/list?page=${page}&limit=${limit}`;
    if (botId) url += `&botId=${botId}`;
    const res = await axios.get(url, authHeader());
    return res.data.conversations;
};

export const fetchConversationById = async (id) => {
    const res = await axios.get(`${API}/${id}`, authHeader());
    return res.data.conversation;
};

export const updateConversationStatus = async (id, status) => {
    const res = await axios.patch(`${API}/${id}/status`, { status }, authHeader());
    return res.data;
};

export const requestLiveAgent = async (chatbotId, sessionId) => {
    const res = await axios.post(`${API}/request-live`, { chatbotId, sessionId });
    return res.data;
};

export const sendAdminMessage = async (chatbotId, sessionId, text) => {
    const res = await axios.post(`${API}/message`, { chatbotId, sessionId, sender: "admin", text }, authHeader());
    return res.data;
};

export const fetchMessagesBySession = async (chatbotId, sessionId) => {
    const res = await axios.get(`${API}/session/${chatbotId}/${sessionId}`);
    return res.data;
};
