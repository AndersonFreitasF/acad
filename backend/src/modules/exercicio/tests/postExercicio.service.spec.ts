import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { PostExercicioService } from "../services/postExercicio.service";
import { InternalServerErrorException } from "@nestjs/common";
import { ExercicioRepositoryPort } from "../application/ports/exercicio-repository.port";

describe("PostExercicioService", () => {
  let service: PostExercicioService;
  let mockRepository: Record<keyof ExercicioRepositoryPort, Mock>;

  const mockInput = {
    nome: "PUSH UP",
    descricao: "Exercício de força para peito",
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

    service = new PostExercicioService(mockRepository as ExercicioRepositoryPort);
    vi.clearAllMocks();
  });

  it("should create exercicio successfully", async () => {
    mockRepository.postExercicio.mockResolvedValue(undefined);

    await service.execute(mockInput, 1);

    expect(mockRepository.postExercicio).toHaveBeenCalledWith(mockInput, 1);
  });

  it("should throw InternalServerErrorException on repository error", async () => {
    mockRepository.postExercicio.mockRejectedValue(new Error("Database error"));

    await expect(service.execute(mockInput, 1)).rejects.toThrow(
      InternalServerErrorException
    );
  });
});
