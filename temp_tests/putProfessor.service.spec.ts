import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { PutProfessorService } from "../services/putProfessor.service";
import {
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";
import { ProfessorRepositoryPort } from "../application/ports/professor-repository.port";

describe("PutProfessorService", () => {
  let service: PutProfessorService;
  let mockRepository: Record<keyof ProfessorRepositoryPort, Mock>;

  const mockData = {
    nome: "Professor Silva",
    email: "professor@example.com",
    senha: "123456",
  };

  const targetUserId = 2;

  const adminUser: TokenPayload = { id_usuario: 1, tipo: "ADM" };
  const regularUser: TokenPayload = { id_usuario: 2, tipo: "PROFESSOR" };
  const otherUser: TokenPayload = { id_usuario: 3, tipo: "PROFESSOR" };

  beforeEach(() => {
    mockRepository = {
      countProfessores: vi.fn(),
      getProfessores: vi.fn(),
      postUsuario: vi.fn(),
      findUsuario: vi.fn(),
      putProfessor: vi.fn(),
      deleteProfessor: vi.fn(),
    };

    service = new PutProfessorService(mockRepository as ProfessorRepositoryPort);
    vi.clearAllMocks();
  });

  it("deve atualizar o professor quando ADM", async () => {
    vi.spyOn(service, "hash").mockResolvedValue("hashed_password");
    mockRepository.findUsuario.mockResolvedValue(true);

    await service.execute(mockData, adminUser, targetUserId);

    expect(service.hash).toHaveBeenCalledWith(mockData.senha);
    expect(mockRepository.putProfessor).toHaveBeenCalledWith(
      { ...mockData, senha: "hashed_password" },
      adminUser.id_usuario,
      targetUserId
    );
  });

  it("deve atualizar o próprio professor se não for ADM", async () => {
    vi.spyOn(service, "hash").mockResolvedValue("hashed_password");
    mockRepository.findUsuario.mockResolvedValue(true);

    await service.execute(mockData, regularUser, targetUserId);

    expect(service.hash).toHaveBeenCalledWith(mockData.senha);
    expect(mockRepository.putProfessor).toHaveBeenCalledWith(
      { ...mockData, senha: "hashed_password" },
      regularUser.id_usuario,
      targetUserId
    );
  });

  it("deve lançar NotFoundException se o professor não existir", async () => {
    mockRepository.findUsuario.mockResolvedValue(false);

    await expect(
      service.execute(mockData, adminUser, targetUserId)
    ).rejects.toThrow(NotFoundException);

    expect(mockRepository.putProfessor).not.toHaveBeenCalled();
  });

  it("deve lançar ForbiddenException se professor tentar editar outro e não for ADM", async () => {
    await expect(
      service.execute(mockData, otherUser, targetUserId)
    ).rejects.toThrow(ForbiddenException);

    expect(mockRepository.findUsuario).not.toHaveBeenCalled();
    expect(mockRepository.putProfessor).not.toHaveBeenCalled();
  });

  it("deve lançar InternalServerErrorException se ocorrer um erro", async () => {
    vi.spyOn(service, "hash").mockResolvedValue("hashed_password");
    mockRepository.findUsuario.mockRejectedValue(new Error("DB error"));

    await expect(
      service.execute(mockData, adminUser, targetUserId)
    ).rejects.toThrow(InternalServerErrorException);

    expect(mockRepository.putProfessor).not.toHaveBeenCalled();
  });
});
