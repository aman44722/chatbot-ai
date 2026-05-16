// src/api/authApi.js
import axios from "axios";

const API_URL = process.env.REACT_APP_AUTH_API || "http://localhost:5000/api/auth";

// Read fresh values from localStorage on every call (not at module load time)
const getToken = () => JSON.parse(localStorage.getItem("user"))?.token;
const getUserID = () => localStorage.getItem("userId");

// ----------------- AUTH -----------------

export const registerUser = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/register`, payload);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Registration failed";
    }
};

export const loginUser = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/login`, payload);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Login failed";
    }
};

export const fetchUserById = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error fetching user data";
    }
};

export const EditChatBotSettings = async (payload) => {
    const token = getToken();
    const userID = getUserID();
    try {
        if (!userID || !token) {
            throw new Error("Missing userId or token in localStorage");
        }
        const response = await axios.put(
            `${API_URL}/user/${userID}/layout-settings`,
            { botSettings: payload },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to update bot settings";
    }
};

export const updateUserDetails = async (userID, token, userPayload) => {
    try {
        const response = await axios.put(
            `${API_URL}/user/${userID}/layout-settings`,
            userPayload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user details:", error);
        throw new Error("Error updating user details");
    }
};

export const changePassword = async (oldPassword, newPassword) => {
    try {
        const response = await axios.put(
            `${API_URL}/change-password`,
            { oldPassword, newPassword },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error changing password";
    }
};

// ----------------- Whitelist / Install -----------------

export const saveWhitelistingUrls = async (domains) => {
    try {
        const response = await axios.post(
            `${API_URL}/settings/whitelist`,
            { domains },
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to save whitelisting URLs";
    }
};

export const getInstallMeta = async () => {
    try {
        const response = await axios.get(`${API_URL}/install/meta`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch install meta";
    }
};

export const getInstallSnippet = async () => {
    try {
        const response = await axios.get(`${API_URL}/install/snippet`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return response.data;
    } catch (error) {
        if (error?.response?.status === 412) {
            return { hasWhitelist: false };
        }
        throw error.response?.data?.message || "Failed to fetch install snippet";
    }
};

export const getWhitelist = async () => {
    try {
        const response = await axios.get(`${API_URL}/settings/whitelist`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch whitelist";
    }
};
