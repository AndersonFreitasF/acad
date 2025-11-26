// frontend/src/services/training.ts
import { api } from "../lib/api";

export interface Training {
  id: number;
  titulo: string;
  descricao: string | null;
  preco: number;
  id_professor: number;
  created_at: string;
}

interface TrainingResponse {
  Treinos: Training[];
  Total: number;
  Pagina: number;
  Tamanho_Pagina: number;
}

export const trainingService = {
  getCatalog: async () => {
    const { data } = await api.get<TrainingResponse>("/treino/catalogo", {
      params: { page: 1, size: 100 },
    });
    return data.Treinos || [];
  },
  getMyTrainings: async () => {
    const { data } = await api.get<TrainingResponse>("/treino", {
      params: { page: 1, size: 100 },
    });
    return data.Treinos || [];
  },
};
