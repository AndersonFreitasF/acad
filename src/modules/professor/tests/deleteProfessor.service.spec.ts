import { describe, it, expect, beforeEach, vi, MockedObject } from "vitest";
import { DeleteProfessorService } from "../services/deleteProfessor.service";
import { DeleteProfessorRepository } from "../repositories/deleteProfessor.repository";
import {
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from "@nestjs/common";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";

describe("DeleteProfessorService", () => {
  let service: DeleteProfessorService;
  let mockRepository: MockedObject<DeleteProfessorRepository>;

  const mockAdminUser: TokenPayload = { id_usuario: 1, tipo: "ADM" };
  const mockRegularUser: TokenPayload = { id_usuario: 2, tipo: "PROFESSOR" };
  const targetUserId = 2;

  beforeEach(() => {
    mockRepository = {
      findUsuario: vi.fn(),
      deleteProfessor: vi.fn(),
    } as MockedObject<DeleteProfessorRepository>;

    service = new DeleteProfessorService(mockRepository);
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
