import { api } from "../lib/api";

export interface User {
  id_usuario: number;
  nome: string;
  email: string;
  tipo: string;
  cpf: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
}

export interface CreateUserData extends RegisterData {}

export interface UpdateUserData {
  nome?: string;
  email?: string;
  senha?: string;
}

export interface GetUsersParams {
  page?: number;
  size?: number;
  nome?: string;
}

export interface UserResponse {
  Usuarios: User[];
  Total: number;
  Pagina: number;
  Tamanho_Pagina: number;
}

export const userService = {
  register: async (data: RegisterData) => {
    const response = await api.post("/usuario/register", data);
    return response.data;
  },

  getAll: async (params?: GetUsersParams) => {
    const { data } = await api.get<UserResponse>("/usuario", { 
      params: { page: 1, size: 100, ...params } 
    });
    return data;
  },

  create: async (data: CreateUserData) => {
    const response = await api.post("/usuario", data);
    return response.data;
  },

  update: async (id: number, data: UpdateUserData) => {
    const response = await api.put(`/usuario/update/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/usuario/delete/${id}`);
    return response.data;
  },

  createCustomerAsaas: async (id: number) => {
    const response = await api.post(`/usuario/${id}/customer-asaas`);
    return response.data;
  },
};
