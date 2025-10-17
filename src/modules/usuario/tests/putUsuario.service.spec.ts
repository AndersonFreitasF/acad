import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { PutUsuarioService } from "../services/putUsuario.service";
import {
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";
import { TokenPayload } from "../../auth/interfaces/auth.interface";
import { UsuarioRepositoryPort } from "../application/ports/usuario-repository.port";
import { PasswordHasherPort } from "../../auth/application/ports/password-hasher.port";

describe("PutUsuarioService", () => {
  let service: PutUsuarioService;
  let mockRepository: Record<keyof UsuarioRepositoryPort, Mock>;
  let mockPasswordHasher: Record<keyof PasswordHasherPort, Mock>;

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
    mockRepository = {
      countUsuarios: vi.fn(),
      getUsuarios: vi.fn(),
      postUsuario: vi.fn(),
      findUsuario: vi.fn(),
      putUsuario: vi.fn(),
      deleteUsuario: vi.fn(),
    };

    mockPasswordHasher = {
      hash: vi.fn(),
      verify: vi.fn(),
    };
    
    service = new PutUsuarioService(
      mockRepository as UsuarioRepositoryPort,
      mockPasswordHasher as PasswordHasherPort
    );
    vi.clearAllMocks();
  });

  it("deve atualizar o usuário quando ADM", async () => {
    mockPasswordHasher.hash.mockResolvedValue("hashed_password");
    mockRepository.findUsuario.mockResolvedValue(true);

    await service.execute(mockData, adminUser, targetUserId);

    expect(mockPasswordHasher.hash).toHaveBeenCalledWith(mockData.senha);
    expect(mockRepository.putUsuario).toHaveBeenCalledWith(
      { ...mockData, senha: "hashed_password" },
      adminUser.id_usuario,
      targetUserId
    );
  });

  it("deve atualizar o próprio usuário se não for ADM", async () => {
    mockPasswordHasher.hash.mockResolvedValue("hashed_password");
    mockRepository.findUsuario.mockResolvedValue(true);

    await service.execute(mockData, regularUser, targetUserId);

    expect(mockPasswordHasher.hash).toHaveBeenCalledWith(mockData.senha);
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
    mockPasswordHasher.hash.mockResolvedValue("hashed_password");
    mockRepository.findUsuario.mockRejectedValue(new Error("DB error"));

    await expect(
      service.execute(mockData, adminUser, targetUserId)
    ).rejects.toThrow(InternalServerErrorException);

    expect(mockRepository.putUsuario).not.toHaveBeenCalled();
  });
});
