import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 5000,
});

export const fetchTransactions = async () => {
    const response = await api.get('/transactions');
    return response.data;
};

export const createTransaction = async (data: any) => {
    const response = await api.post('/transactions', data);
    return response.data;
};
