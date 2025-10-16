import { InternalServerErrorException } from "@nestjs/common";
import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { ExercicioRepositoryPort } from "../application/ports/exercicio-repository.port";
import { PostExercicioService } from "../services/postExercicio.service";

describe("PostUsuarioService", () => {
  let service: PostExercicioService;
  let mockRepository: Record<keyof ExercicioRepositoryPort, Mock>;

  const mockData = {
    nome: "Supino",
    descricao: "teste",
  };

  const createdBy = 1;

  beforeEach(() => {
    mockRepository = {
      postExercicio: vi.fn(),
    };

    service = new PostExercicioService(
      mockRepository as ExercicioRepositoryPort
    );
    vi.clearAllMocks();
  });

  it("deve criar um exercicio com sucesso", async () => {
    await service.execute(mockData, createdBy);

    expect(mockRepository.postExercicio).toHaveBeenCalledWith(
      { mockData },
      createdBy
    );
  });

  it("deve lançar InternalServerErrorException se ocorrer um erro", async () => {
    mockRepository.postExercicio.mockRejectedValue(new Error("DB error"));

    await expect(service.execute(mockData, createdBy)).rejects.toThrow(
      InternalServerErrorException
    );

    expect(mockRepository.postExercicio).toHaveBeenCalledWith(
      { mockData },
      createdBy
    );
  });
});
