import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { PostTreinoService } from "../services/postTreino.service";
import { InternalServerErrorException } from "@nestjs/common";
import { TreinoRepositoryPort } from "../application/ports/treino-repository.port";

describe("PostTreinoService", () => {
  let service: PostTreinoService;
  let mockRepository: Record<keyof TreinoRepositoryPort, Mock>;

  const mockInput = {
    titulo: "TREINO FULL BODY",
    descricao: "Treino completo para corpo todo",
    id_professor: 1,
   preco: 100,
    exercicios: [
      {
        id_exercicio: 1,
        series_repeticoes: "3x12",
        carga: "20kg",
        observacoes: "Descanso 60s",
      },
      {
        id_exercicio: 2,
        series_repeticoes: "4x10",
        carga: "40kg",
        observacoes: "Descanso 90s",
      },
      {
        id_exercicio: 3,
        series_repeticoes: "3x15",
        carga: "15kg",
        observacoes: "Descanso 60s",
      },
    ],
  };

  const mockTreino = {
    id: 1,
    titulo: "TREINO FULL BODY",
    descricao: "TREINO COMPLETO PARA CORPO TODO",
    id_professor: 1,
    preco: 100,
    created_at: new Date(),
  };

  beforeEach(() => {
    mockRepository = {
      countTreinos: vi.fn(),
      getTreinos: vi.fn(),
      postTreino: vi.fn(),
      treinoExists: vi.fn(),
      findTreino: vi.fn(),
      putTreino: vi.fn(),
      removeExercicios: vi.fn(),
      addExercicio: vi.fn(),
      deleteExerciciosTreino: vi.fn(),
      deleteTreino: vi.fn(),
    };

    service = new PostTreinoService(mockRepository as TreinoRepositoryPort);
    vi.clearAllMocks();
  });

  it("should create treino with exercicios successfully", async () => {
    mockRepository.postTreino.mockResolvedValue(mockTreino);
    mockRepository.treinoExists.mockResolvedValue(true);
    mockRepository.addExercicio.mockResolvedValue(undefined);

    const result = await service.execute(mockInput, 1);

    expect(mockRepository.postTreino).toHaveBeenCalledWith(mockInput, 1);
    expect(mockRepository.treinoExists).toHaveBeenCalledWith(1);
    expect(mockRepository.addExercicio).toHaveBeenCalledTimes(3);
    expect(mockRepository.addExercicio).toHaveBeenNthCalledWith(
      1,
      mockInput.exercicios[0],
      1,
      1
    );
    expect(mockRepository.addExercicio).toHaveBeenNthCalledWith(
      2,
      mockInput.exercicios[1],
      1,
      2
    );
    expect(mockRepository.addExercicio).toHaveBeenNthCalledWith(
      3,
      mockInput.exercicios[2],
      1,
      3
    );
    expect(result).toEqual(mockTreino);
  });

  it("should throw error when treino creation fails", async () => {
    mockRepository.postTreino.mockResolvedValue(null);

    await expect(service.execute(mockInput, 1)).rejects.toThrow(
      "Falha ao criar o treino"
    );
  });

  it("should throw error when treino has no id", async () => {
    mockRepository.postTreino.mockResolvedValue({ ...mockTreino, id: null });

    await expect(service.execute(mockInput, 1)).rejects.toThrow(
      "Falha ao criar o treino"
    );
  });

  it("should throw error when treino does not exist after creation", async () => {
    mockRepository.postTreino.mockResolvedValue(mockTreino);
    mockRepository.treinoExists.mockResolvedValue(false);

    await expect(service.execute(mockInput, 1)).rejects.toThrow(
      "Treino não foi criado corretamente"
    );
  });

  it("should throw InternalServerErrorException on repository error", async () => {
    mockRepository.postTreino.mockRejectedValue(new Error("Database error"));

    await expect(service.execute(mockInput, 1)).rejects.toThrow(
      InternalServerErrorException
    );
  });
});
