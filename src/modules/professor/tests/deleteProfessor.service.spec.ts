import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { DeleteProfessorService } from "../services/deleteProfessor.service";
import {
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from "@nestjs/common";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";
import { ProfessorRepositoryPort } from "../application/ports/professor-repository.port";

describe("DeleteProfessorService", () => {
  let service: DeleteProfessorService;
  let mockRepository: Record<keyof ProfessorRepositoryPort, Mock>;

  const mockAdminUser: TokenPayload = { id_usuario: 1, tipo: "ADM" };
  const mockRegularUser: TokenPayload = { id_usuario: 2, tipo: "PROFESSOR" };
  const targetUserId = 2;

  beforeEach(() => {
    mockRepository = {
      countProfessores: vi.fn(),
      getProfessores: vi.fn(),
      postUsuario: vi.fn(),
      findUsuario: vi.fn(),
      putProfessor: vi.fn(),
      deleteProfessor: vi.fn(),
    };

    service = new DeleteProfessorService(mockRepository as ProfessorRepositoryPort);
    vi.clearAllMocks();
  });

  it("deve deletar o professor quando ele existe e o usuário é admin", async () => {
    mockRepository.findUsuario.mockResolvedValue(true);
    mockRepository.deleteProfessor.mockResolvedValue(true);

    await service.execute(mockAdminUser, targetUserId);

    expect(mockRepository.findUsuario).toHaveBeenCalledWith(targetUserId);
    expect(mockRepository.deleteProfessor).toHaveBeenCalledWith(
      mockAdminUser.id_usuario,
      targetUserId
    );
  });

  it("deve lançar ForbiddenException quando usuário não é admin", async () => {
    await expect(service.execute(mockRegularUser, targetUserId)).rejects.toThrow(
      ForbiddenException
    );

    expect(mockRepository.findUsuario).not.toHaveBeenCalled();
    expect(mockRepository.deleteProfessor).not.toHaveBeenCalled();
  });

  it("deve lançar NotFoundException se o professor não existir", async () => {
    mockRepository.findUsuario.mockResolvedValue(false);

    await expect(service.execute(mockAdminUser, targetUserId)).rejects.toThrow(
      NotFoundException
    );

    expect(mockRepository.findUsuario).toHaveBeenCalledWith(targetUserId);
    expect(mockRepository.deleteProfessor).not.toHaveBeenCalled();
  });

  it("deve lançar InternalServerErrorException se ocorrer um erro", async () => {
    mockRepository.findUsuario.mockRejectedValue(new Error("DB error"));

    await expect(service.execute(mockAdminUser, targetUserId)).rejects.toThrow(
      InternalServerErrorException
    );

    expect(mockRepository.deleteProfessor).not.toHaveBeenCalled();
  });
});
