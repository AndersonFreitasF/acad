import { describe, it, expect, beforeEach, vi } from "vitest";
import { PutUsuarioService } from "../services/putUsuario.service";
import { PutUsuarioRepository } from "../repositories/putUsuario.repository";
import {
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";

describe("PutUsuarioService", () => {
  let service: PutUsuarioService;
  let repository: PutUsuarioRepository;

  const mockRepository = {
    findUsuario: vi.fn(),
    putUsuario: vi.fn(),
  };

  const mockData = {
    nome: "Anderson",
    email: "anderson@example.com",
    senha: "123456",
  };

  const targetUserId = 2;

  const adminUser: TokenPayload = { id_usuario: 1, tipo: "ADM" };
  const regularUser: TokenPayload = { id_usuario: 2, tipo: "ALUNO" };
  const otherUser: TokenPayload = { id_usuario: 3, tipo: "ALUNO" };

  beforeEach(() => {
    repository = mockRepository as unknown as PutUsuarioRepository;
    service = new PutUsuarioService(repository);
    vi.clearAllMocks();
  });

  it("deve atualizar o usuário quando ADM", async () => {
    vi.spyOn(service, "hash").mockResolvedValue("hashed_password");
    mockRepository.findUsuario.mockResolvedValue(true);

    await service.execute(mockData, adminUser, targetUserId);

    expect(service.hash).toHaveBeenCalledWith(mockData.senha);
    expect(mockRepository.putUsuario).toHaveBeenCalledWith(
      { ...mockData, senha: "hashed_password" },
      adminUser.id_usuario,
      targetUserId
    );
  });

  it("deve atualizar o próprio usuário se não for ADM", async () => {
    vi.spyOn(service, "hash").mockResolvedValue("hashed_password");
    mockRepository.findUsuario.mockResolvedValue(true);

    await service.execute(mockData, regularUser, targetUserId);

    expect(service.hash).toHaveBeenCalledWith(mockData.senha);
    expect(mockRepository.putUsuario).toHaveBeenCalledWith(
      { ...mockData, senha: "hashed_password" },
      regularUser.id_usuario,
      targetUserId
    );
  });

  it("deve lançar NotFoundException se o usuário não existir", async () => {
    mockRepository.findUsuario.mockResolvedValue(false);

    await expect(
      service.execute(mockData, adminUser, targetUserId)
    ).rejects.toThrow(NotFoundException);

    expect(mockRepository.putUsuario).not.toHaveBeenCalled();
  });

  it("deve lançar ForbiddenException se usuário tentar editar outro e não for ADM", async () => {
    await expect(
      service.execute(mockData, otherUser, targetUserId)
    ).rejects.toThrow(ForbiddenException);

    expect(mockRepository.findUsuario).not.toHaveBeenCalled();
    expect(mockRepository.putUsuario).not.toHaveBeenCalled();
  });

  it("deve lançar InternalServerErrorException se ocorrer um erro", async () => {
    vi.spyOn(service, "hash").mockResolvedValue("hashed_password");
    mockRepository.findUsuario.mockRejectedValue(new Error("DB error"));

    await expect(
      service.execute(mockData, adminUser, targetUserId)
    ).rejects.toThrow(InternalServerErrorException);

    expect(mockRepository.putUsuario).not.toHaveBeenCalled();
  });
});
