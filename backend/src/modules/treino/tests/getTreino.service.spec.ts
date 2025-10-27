import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { GetTreinoService } from "../services/getTreino.service";
import { InternalServerErrorException } from "@nestjs/common";
import { TreinoRepositoryPort } from "../application/ports/treino-repository.port";

describe("GetTreinoService", () => {
  let service: GetTreinoService;
  let mockRepository: Record<keyof TreinoRepositoryPort, Mock>;

  const mockInput = {
    page: 1,
    size: 10,
    titulo: "FULL BODY",
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

    service = new GetTreinoService(mockRepository as TreinoRepositoryPort);
    vi.clearAllMocks();
  });

  it("should return treinos data successfully", async () => {
    const mockCount = 2;
    const mockTreinos = [
      {
        id: 1,
        titulo: "TREINO FULL BODY",
        descricao: "TREINO COMPLETO PARA CORPO TODO",
        id_professor: 1,
        publico: true,
        created_at: new Date(),
      },
      {
        id: 2,
        titulo: "TREINO CARDIO",
        descricao: "TREINO CARDIOVASCULAR",
        id_professor: 1,
        publico: false,
        created_at: new Date(),
      },
    ];

    mockRepository.countTreinos.mockResolvedValue(mockCount);
    mockRepository.getTreinos.mockResolvedValue(mockTreinos);

    const result = await service.execute(mockInput);

    expect(result).toEqual({
      Treinos: mockTreinos,
      Total: mockCount,
      Pagina: mockInput.page,
      Tamanho_Pagina: mockInput.size,
    });

    expect(mockRepository.countTreinos).toHaveBeenCalledWith(mockInput);
    expect(mockRepository.getTreinos).toHaveBeenCalledWith(mockInput);
  });

  it("should handle empty results", async () => {
    mockRepository.countTreinos.mockResolvedValue(0);
    mockRepository.getTreinos.mockResolvedValue([]);

    const result = await service.execute(mockInput);

    expect(result).toEqual({
      Treinos: [],
      Total: 0,
      Pagina: mockInput.page,
      Tamanho_Pagina: mockInput.size,
    });
  });

  it("should handle null results from repository", async () => {
    mockRepository.countTreinos.mockResolvedValue(null);
    mockRepository.getTreinos.mockResolvedValue(null);

    const result = await service.execute(mockInput);

    expect(result).toEqual({
      Treinos: [],
      Total: 0,
      Pagina: mockInput.page,
      Tamanho_Pagina: mockInput.size,
    });
  });

  it("should throw InternalServerErrorException on repository error", async () => {
    mockRepository.countTreinos.mockRejectedValue(new Error("Database error"));

    await expect(service.execute(mockInput)).rejects.toThrow(
      InternalServerErrorException
    );
  });
});
