import { api } from "../lib/api";

export interface ProfessorTreino {
  id: number;
  titulo: string;
  preco: number;
}

export interface Professor {
  id_usuario: number;
  nome: string;
  email: string;
  cpf: string;
  tipo: string;
  treinos: ProfessorTreino[];
}

export interface GetProfessorParams {
  page?: number;
  size?: number;
  nome?: string;
}

export interface CreateProfessorData {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
}

export interface UpdateProfessorData {
  nome?: string;
  email?: string;
  senha?: string;
}

export interface ProfessorResponse {
  Professores: Professor[];
  Total: number;
  Pagina: number;
  Tamanho_Pagina: number;
}

export const professorService = {
  getAll: async (params?: GetProfessorParams) => {
    const { data } = await api.get<ProfessorResponse>("/professor", { 
      params: { page: 1, size: 100, ...params } 
    });
    return data;
  },

  create: async (professorData: CreateProfessorData) => {
    const { data } = await api.post("/professor", professorData);
    return data;
  },

  update: async (id: number, professorData: UpdateProfessorData) => {
    const { data } = await api.put(`/professor/update/${id}`, professorData);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/professor/delete/${id}`);
    return data;
  },
};
