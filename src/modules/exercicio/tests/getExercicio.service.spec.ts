import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { GetExercicioService } from "../services/getExercicio.service";
import { InternalServerErrorException } from "@nestjs/common";
import { ExercicioRepositoryPort } from "../application/ports/exercicio-repository.port";

describe("GetExercicioService", () => {
  let service: GetExercicioService;
  let mockRepository: Record<keyof ExercicioRepositoryPort, Mock>;

  const mockInput = {
    page: 1,
    size: 10,
  };

  beforeEach(() => {
    mockRepository = {
      countExercicios: vi.fn(),
      getExercicios: vi.fn(),
      postExercicio: vi.fn(),
      findExercicio: vi.fn(),
      putExercicio: vi.fn(),
      deleteExercicio: vi.fn(),
    };

    service = new GetExercicioService(mockRepository as ExercicioRepositoryPort);
    vi.clearAllMocks();
  });

  it("should return exercicios data successfully", async () => {
    const mockCount = 2;
    const mockExercicios = [
      {
        id_exercicio: 1,
        nome: "PUSH UP",
        descricao: "EXERCÍCIO DE FORÇA",
        created_by: 1,
        created_at: new Date(),
      },
      {
        id_exercicio: 2,
        nome: "SQUAT",
        descricao: "EXERCÍCIO DE PERNA",
        created_by: 1,
        created_at: new Date(),
      },
    ];

    mockRepository.countExercicios.mockResolvedValue(mockCount);
    mockRepository.getExercicios.mockResolvedValue(mockExercicios);

    const result = await service.execute(mockInput);

    expect(result).toEqual({
      Exercicios: mockExercicios,
      Total: mockCount,
      Pagina: mockInput.page,
      Tamanho_Pagina: mockInput.size,
    });

    expect(mockRepository.countExercicios).toHaveBeenCalledWith(mockInput);
    expect(mockRepository.getExercicios).toHaveBeenCalledWith(mockInput);
  });

  it("should handle empty results", async () => {
    mockRepository.countExercicios.mockResolvedValue(0);
    mockRepository.getExercicios.mockResolvedValue([]);

    const result = await service.execute(mockInput);

    expect(result).toEqual({
      Exercicios: [],
      Total: 0,
      Pagina: mockInput.page,
      Tamanho_Pagina: mockInput.size,
    });
  });

  it("should throw InternalServerErrorException on repository error", async () => {
    mockRepository.countExercicios.mockRejectedValue(new Error("Database error"));

    await expect(service.execute(mockInput)).rejects.toThrow(
      InternalServerErrorException
    );
  });
});
