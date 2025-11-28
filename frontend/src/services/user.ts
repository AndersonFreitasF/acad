import { api } from "../lib/api";

export interface RegisterData {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
}

export interface User {
  id_usuario: number;
  nome: string;
  email: string;
  tipo: string;
  cpf: string;
}

export const userService = {
  register: async (data: RegisterData) => {
    const response = await api.post("/usuario/register", data);
    return response.data;
  },

  getProfile: async () => {
    const { data } = await api.get<User>("/usuario/me");
    return data;
  },

  updateProfile: async (id: number, data: Partial<RegisterData>) => {
    const response = await api.put(`/usuario/update/${id}`, data);
    return response.data;
  },
};
