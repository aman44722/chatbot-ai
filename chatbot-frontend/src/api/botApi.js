import axios from "axios";

const API_URL = process.env.REACT_APP_AUTH_API
  ? process.env.REACT_APP_AUTH_API.replace("/auth", "/bots")
  : "http://localhost:5000/api/bots";

const getToken = () => JSON.parse(localStorage.getItem("user"))?.token;

export const createBot = async (name) => {
  try {
    const response = await axios.post(
      API_URL,
      { name },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create bot";
  }
};

export const getBots = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch bots";
  }
};

export const getBotById = async (botId) => {
  try {
    const response = await axios.get(`${API_URL}/${botId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch bot";
  }
};

export const updateBot = async (botId, payload) => {
  try {
    const response = await axios.put(`${API_URL}/${botId}`, payload, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update bot";
  }
};

export const deleteBot = async (botId) => {
  try {
    const response = await axios.delete(`${API_URL}/${botId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete bot";
  }
};
