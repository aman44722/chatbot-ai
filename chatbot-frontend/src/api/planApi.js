import axios from 'axios';

const API = process.env.REACT_APP_AUTH_API || 'http://localhost:5000/api/auth';
const BASE = API.replace('/api/auth', '/api/plans');

const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.token || '';
};

export const getPlans = async () => {
    const res = await axios.get(BASE, { headers: { Authorization: `Bearer ${getToken()}` } });
    return res.data;
};
