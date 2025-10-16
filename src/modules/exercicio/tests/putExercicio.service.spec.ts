import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { PutExercicioService } from "../services/putExercicio.service";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ExercicioRepositoryPort } from "../application/ports/exercicio-repository.port";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";

describe("PutExercicioService", () => {
  let service: PutExercicioService;
  let mockRepository: Record<keyof ExercicioRepositoryPort, Mock>;

  const mockInput = {
    nome: "PUSH UP UPDATED",
    descricao: "Exercício de força para peito atualizado",
  };

  const mockUser: TokenPayload = {
    id_usuario: 1,
    tipo: "PROFESSOR",
    iat: 1234567890,
    exp: 1234567890,
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

    service = new PutExercicioService(mockRepository as ExercicioRepositoryPort);
    vi.clearAllMocks();
  });

  it("should update exercicio successfully", async () => {
    mockRepository.findExercicio.mockResolvedValue(true);
    mockRepository.putExercicio.mockResolvedValue(undefined);

    await service.execute(mockInput, mockUser, 1);

    expect(mockRepository.findExercicio).toHaveBeenCalledWith(1);
    expect(mockRepository.putExercicio).toHaveBeenCalledWith(
      mockInput,
      mockUser.id_usuario,
      1
    );
  });

  it("should throw NotFoundException when exercicio not found", async () => {
    mockRepository.findExercicio.mockResolvedValue(false);

    await expect(service.execute(mockInput, mockUser, 999)).rejects.toThrow(
      NotFoundException
    );

    expect(mockRepository.findExercicio).toHaveBeenCalledWith(999);
    expect(mockRepository.putExercicio).not.toHaveBeenCalled();
  });

  it("should throw InternalServerErrorException on repository error", async () => {
    mockRepository.findExercicio.mockRejectedValue(new Error("Database error"));

    await expect(service.execute(mockInput, mockUser, 1)).rejects.toThrow(
      InternalServerErrorException
    );
  });
});