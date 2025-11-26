import { api } from "../lib/api";

export interface Training {
  id: number;
  titulo: string;
  descricao: string | null;
  preco: number;
  id_professor: number;
  created_at: string;
}

export const trainingService = {
  getCatalog: async () => {
    const { data } = await api.get<Training[]>("/treino/catalogo");
    return data;
  },
  getMyTrainings: async () => {
    const { data } = await api.get<Training[]>("/treino");
    return data;
  },
};
