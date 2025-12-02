import { api } from "../lib/api";

export interface Exercise {
  id_exercicio: number;
  nome: string;
  descricao: string;
  created_at?: string;
}

export interface GetExercisesParams {
  page?: number;
  size?: number;
  nome?: string;
}

export interface CreateExerciseData {
  nome: string;
  descricao: string;
}

export interface UpdateExerciseData {
  nome?: string;
  descricao?: string;
}

export interface ExerciseResponse {
  Exercicios: Exercise[];
  Total: number;
  Pagina: number;
  Tamanho_Pagina: number;
}

export const exerciseService = {
  getAll: async (params?: GetExercisesParams) => {
    const { data } = await api.get<ExerciseResponse>("/exercicio", { params });
    return data;
  },

  create: async (exerciseData: CreateExerciseData) => {
    const { data } = await api.post("/exercicio", exerciseData);
    return data;
  },

  update: async (id: number, exerciseData: UpdateExerciseData) => {
    const { data } = await api.put(`/exercicio/update/${id}`, exerciseData);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/exercicio/delete/${id}`);
    return data;
  },
};
