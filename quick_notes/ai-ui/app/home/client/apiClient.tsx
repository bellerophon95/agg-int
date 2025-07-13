import axios from "axios";

const API_BASE_URL = 'https://agg-int.onrender.com/';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
