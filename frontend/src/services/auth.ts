// frontend/src/services/auth.ts
import { api } from "../lib/api";

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: {
    id_usuario: number;
    email: string;
    tipo: string;
  };
}

export const authService = {
  login: async (email: string, senha: string) => {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      email,
      senha,
    });
    if (data.accessToken) {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  isAuthenticated: () => !!localStorage.getItem("token"),
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
