import { api } from "../lib/api";

export interface LoginResponse {
  access_token: string;
}

export const authService = {
  login: async (email: string, senha: string) => {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      email,
      senha,
    });
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }
    return data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
  isAuthenticated: () => !!localStorage.getItem("token"),
};
