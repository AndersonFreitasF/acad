import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { PutTreinoService } from "../services/putTreino.service";
import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { TreinoRepositoryPort } from "../application/ports/treino-repository.port";
import { TokenPayload } from "../../auth/interfaces/auth.interface";

describe("PutTreinoService", () => {
  let service: PutTreinoService;
  let mockRepository: Record<keyof TreinoRepositoryPort, Mock>;

  const mockInput = {
    titulo: "TREINO FULL BODY ATUALIZADO",
    descricao: "Treino completo para corpo todo atualizado",
    publico: false,
    exercicios: [
      {
        id_exercicio: 1,
        series_repeticoes: "4x12",
        carga: "25kg",
        observacoes: "Descanso 90s",
      },
      {
        id_exercicio: 2,
        series_repeticoes: "3x15",
        carga: "45kg",
        observacoes: "Descanso 2min",
      },
      {
        id_exercicio: 3,
        series_repeticoes: "4x10",
        carga: "20kg",
        observacoes: "Descanso 90s",
      },
    ],
  };

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

    service = new PutTreinoService(mockRepository as TreinoRepositoryPort);
    vi.clearAllMocks();
  });

  it("should update treino successfully", async () => {
    mockRepository.findTreino.mockResolvedValue(true);
    mockRepository.putTreino.mockResolvedValue(undefined);

    await service.execute(mockInput, mockUser, 1);

    expect(mockRepository.findTreino).toHaveBeenCalledWith(1);
    expect(mockRepository.putTreino).toHaveBeenCalledWith(
      mockInput,
      mockUser.id_usuario,
      1
    );
  });

  it("should update treino with new exercicios", async () => {
    mockRepository.findTreino.mockResolvedValue(true);
    mockRepository.putTreino.mockResolvedValue(undefined);
    mockRepository.removeExercicios.mockResolvedValue(undefined);
    mockRepository.addExercicio.mockResolvedValue(undefined);

    await service.execute(mockInput, mockUser, 1);

    expect(mockRepository.removeExercicios).toHaveBeenCalledWith(1);
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
  });

  it("should throw BadRequestException when no fields provided", async () => {
    const emptyInput = {};

    await expect(service.execute(emptyInput, mockUser, 1)).rejects.toThrow(
      BadRequestException
    );
  });

  it("should throw NotFoundException when treino not found", async () => {
    mockRepository.findTreino.mockResolvedValue(false);

    await expect(service.execute(mockInput, mockUser, 999)).rejects.toThrow(
      NotFoundException
    );

    expect(mockRepository.findTreino).toHaveBeenCalledWith(999);
    expect(mockRepository.putTreino).not.toHaveBeenCalled();
  });

  it("should not update exercicios when less than 3 provided", async () => {
    const inputWithFewExercicios = {
      ...mockInput,
      exercicios: [
        {
          id_exercicio: 1,
          series_repeticoes: "3x12",
          carga: "20kg",
          observacoes: "Descanso 60s",
        },
      ],
    };

    mockRepository.findTreino.mockResolvedValue(true);
    mockRepository.putTreino.mockResolvedValue(undefined);

    await service.execute(inputWithFewExercicios, mockUser, 1);

    expect(mockRepository.removeExercicios).not.toHaveBeenCalled();
    expect(mockRepository.addExercicio).not.toHaveBeenCalled();
  });

  it("should throw InternalServerErrorException on repository error", async () => {
    mockRepository.findTreino.mockRejectedValue(new Error("Database error"));

    await expect(service.execute(mockInput, mockUser, 1)).rejects.toThrow(
      InternalServerErrorException
    );
  });

  it("should throw specific exceptions when they occur", async () => {
    mockRepository.findTreino.mockResolvedValue(false);

    await expect(service.execute(mockInput, mockUser, 999)).rejects.toThrow(
      NotFoundException
    );
    expect(mockRepository.putTreino).not.toHaveBeenCalled();
  });
});
