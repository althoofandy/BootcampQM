// src/services/auth.api.ts
const BASE_URL = import.meta.env.VITE_BASE_URL_API;

const AuthAPI = {
  login: async (data: { username: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json;
  },

  register: async (data: { username: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    return json;
  },
};

export default AuthAPI;
