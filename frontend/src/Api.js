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

export const Submissions = {
    submit: async (submission) => {
        try {
            //this endpoint does not need to use jwt
            const response = await axios.post(`${API_URL}/submissions/submit`, submission);
            return response.data;
        } catch (error) {
            console.error('Error submitting:', error);
            throw error;
        }
    },
    getAllSubmissions: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/submissions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error getting submissions:', error);
            throw error;
        }
    }   
}