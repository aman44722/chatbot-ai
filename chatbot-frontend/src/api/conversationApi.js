import axios from "axios";

const API = (process.env.REACT_APP_AUTH_API || "http://localhost:5000/api/auth").replace("/api/auth", "/api/conversation");

// Read fresh token on every call
const getToken = () => JSON.parse(localStorage.getItem("user"))?.token;

const authHeader = () => ({
    headers: { Authorization: `Bearer ${getToken()}` },
});

export const fetchConversations = async () => {
    const res = await axios.get(`${API}/list`, authHeader());
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
