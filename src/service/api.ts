import axios from "axios";

export const api = axios.create({
    baseURL: "https://espetomadeira-api.onrender.com",
})