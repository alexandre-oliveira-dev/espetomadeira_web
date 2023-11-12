import axios from 'axios';

export const api = axios.create({
  // baseURL: 'http://localhost:4000',

  baseURL: 'https://espetomadeira-api.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});
