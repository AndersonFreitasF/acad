import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { DeleteExercicioService } from "../services/deleteExercicio.service";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ExercicioRepositoryPort } from "../application/ports/exercicio-repository.port";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";

describe("DeleteExercicioService", () => {
  let service: DeleteExercicioService;
  let mockRepository: Record<keyof ExercicioRepositoryPort, Mock>;

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

    service = new DeleteExercicioService(mockRepository as ExercicioRepositoryPort);
    vi.clearAllMocks();
  });

  it("should delete exercicio successfully", async () => {
    mockRepository.findExercicio.mockResolvedValue(true);
    mockRepository.deleteExercicio.mockResolvedValue(undefined);

    await service.execute(mockUser, 1);

    expect(mockRepository.findExercicio).toHaveBeenCalledWith(1);
    expect(mockRepository.deleteExercicio).toHaveBeenCalledWith(
      mockUser.id_usuario,
      1
    );
  });

  it("should throw NotFoundException when exercicio not found", async () => {
    mockRepository.findExercicio.mockResolvedValue(false);

    await expect(service.execute(mockUser, 999)).rejects.toThrow(
      NotFoundException
    );

    expect(mockRepository.findExercicio).toHaveBeenCalledWith(999);
    expect(mockRepository.deleteExercicio).not.toHaveBeenCalled();
  });

  it("should throw InternalServerErrorException on repository error", async () => {
    mockRepository.findExercicio.mockRejectedValue(new Error("Database error"));

    await expect(service.execute(mockUser, 1)).rejects.toThrow(
      InternalServerErrorException
    );
  });
});
