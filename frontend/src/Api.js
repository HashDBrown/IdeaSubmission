import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
//use .env file to store the API URL

const API_URL = process.env.API_URL;

export const Users = {
    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/users/login`, credentials);
            const { token } = response.data;
            localStorage.setItem('token', token);
            return jwtDecode(token);
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    },
};
