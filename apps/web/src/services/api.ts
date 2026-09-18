import axios from "axios";
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api" });
api.interceptors.request.use((config) => { const token = localStorage.getItem("accessToken"); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
export async function login(email: string, password: string) { const { data } = await api.post("/auth/login", { email, password }); localStorage.setItem("accessToken", data.data.accessToken); return data.data; }
export async function register(payload: { name: string; email: string; password: string }) { const { data } = await api.post("/auth/register", payload); localStorage.setItem("accessToken", data.data.accessToken); return data.data; }
