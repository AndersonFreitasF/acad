import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { DeleteTreinoService } from "../services/deleteTreino.service";
import {
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { TreinoRepositoryPort } from "../application/ports/treino-repository.port";
import { TokenPayload } from "../../auth/interfaces/auth.interface";

describe("DeleteTreinoService", () => {
  let service: DeleteTreinoService;
  let mockRepository: Record<keyof TreinoRepositoryPort, Mock>;

  const mockUser: TokenPayload = {
    id_usuario: 1,
    tipo: "PROFESSOR",
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

    service = new DeleteTreinoService(mockRepository as TreinoRepositoryPort);
    vi.clearAllMocks();
  });

  it("should delete treino successfully", async () => {
    mockRepository.findTreino.mockResolvedValue(true);
    mockRepository.deleteExerciciosTreino.mockResolvedValue(undefined);
    mockRepository.deleteTreino.mockResolvedValue(undefined);

    await service.execute(mockUser, 1);

    expect(mockRepository.findTreino).toHaveBeenCalledWith(1);
    expect(mockRepository.deleteExerciciosTreino).toHaveBeenCalledWith(1);
    expect(mockRepository.deleteTreino).toHaveBeenCalledWith(
      mockUser.id_usuario,
      1
    );
  });

  it("should delete exercicios before deleting treino", async () => {
    mockRepository.findTreino.mockResolvedValue(true);
    mockRepository.deleteExerciciosTreino.mockResolvedValue(undefined);
    mockRepository.deleteTreino.mockResolvedValue(undefined);

    await service.execute(mockUser, 1);

    expect(mockRepository.deleteExerciciosTreino).toHaveBeenCalledWith(1);
    expect(mockRepository.deleteTreino).toHaveBeenCalledWith(
      mockUser.id_usuario,
      1
    );
  });

  it("should throw NotFoundException when treino not found", async () => {
    mockRepository.findTreino.mockResolvedValue(false);

    await expect(service.execute(mockUser, 999)).rejects.toThrow(
      NotFoundException
    );

    expect(mockRepository.findTreino).toHaveBeenCalledWith(999);
    expect(mockRepository.deleteExerciciosTreino).not.toHaveBeenCalled();
    expect(mockRepository.deleteTreino).not.toHaveBeenCalled();
  });

  it("should throw InternalServerErrorException on repository error", async () => {
    mockRepository.findTreino.mockRejectedValue(new Error("Database error"));

    await expect(service.execute(mockUser, 1)).rejects.toThrow(
      InternalServerErrorException
    );
  });

  it("should throw specific exceptions when they occur", async () => {
    mockRepository.findTreino.mockResolvedValue(false);

    await expect(service.execute(mockUser, 999)).rejects.toThrow(
      NotFoundException
    );
    expect(mockRepository.deleteExerciciosTreino).not.toHaveBeenCalled();
    expect(mockRepository.deleteTreino).not.toHaveBeenCalled();
  });
});
