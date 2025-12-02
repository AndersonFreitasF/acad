import { api } from "../lib/api";

export interface ExerciseTraining {
  exercicio_id: number;
  series: number;
  repeticoes: number;
  carga: number;
}

export interface Training {
  id: number;
  titulo: string;
  descricao: string | null;
  preco: number;
  id_professor: number;
  created_at: string;
  exercicios?: any[];
}

export interface GetTrainingParams {
  page?: number;
  size?: number;
  titulo?: string;
  id_professor?: number;
}

export interface CreateTrainingData {
  titulo: string;
  descricao: string;
  id_professor: number;
  preco: number;
  exercicios: ExerciseTraining[];
}

export interface UpdateTrainingData {
  titulo?: string;
  descricao?: string;
  publico?: boolean;
  exercicios?: ExerciseTraining[];
}

export interface TrainingResponse {
  Treinos: Training[];
  Total: number;
  Pagina: number;
  Tamanho_Pagina: number;
}

export const trainingService = {
  getCatalog: async (params?: GetTrainingParams) => {
    const { data } = await api.get<TrainingResponse>("/treino/catalogo", {
      params: { page: 1, size: 100, ...params },
    });
    return data.Treinos || [];
  },

  getMyTrainings: async (params?: GetTrainingParams) => {
    const { data } = await api.get<TrainingResponse>("/treino", {
      params: { page: 1, size: 100, ...params },
    });
    return data.Treinos || [];
  },

  create: async (trainingData: CreateTrainingData) => {
    const { data } = await api.post("/treino", trainingData);
    return data;
  },

  update: async (id: number, trainingData: UpdateTrainingData) => {
    const { data } = await api.put(`/treino/update/${id}`, trainingData);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/treino/delete/${id}`);
    return data;
  },
};
