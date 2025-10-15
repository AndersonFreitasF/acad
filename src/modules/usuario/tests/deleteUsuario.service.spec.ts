import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { DeleteUsuarioService } from "../services/deleteUsuario.service";
import {
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from "@nestjs/common";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";
import { UsuarioRepositoryPort } from "../application/ports/usuario-repository.port";

describe("DeleteUsuarioService", () => {
  let service: DeleteUsuarioService;
  let mockRepository: Record<keyof UsuarioRepositoryPort, Mock>;

  const mockAdminUser: TokenPayload = { id_usuario: 1, tipo: "ADM" };
  const mockRegularUser: TokenPayload = { id_usuario: 2, tipo: "ALUNO" };
  const targetUserId = 2;

  beforeEach(() => {
    mockRepository = {
      countUsuarios: vi.fn(),
      getUsuarios: vi.fn(),
      postUsuario: vi.fn(),
      findUsuario: vi.fn(),
      putUsuario: vi.fn(),
      deleteUsuario: vi.fn(),
    };

    service = new DeleteUsuarioService(mockRepository as UsuarioRepositoryPort);
    vi.clearAllMocks();
  });

  it("deve deletar o usuário quando ele existe e o usuário é admin", async () => {
    mockRepository.findUsuario.mockResolvedValue(true);
    mockRepository.deleteUsuario.mockResolvedValue(true);

    await service.execute(mockAdminUser, targetUserId);

    expect(mockRepository.findUsuario).toHaveBeenCalledWith(targetUserId);
    expect(mockRepository.deleteUsuario).toHaveBeenCalledWith(
      mockAdminUser.id_usuario,
      targetUserId
    );
  });

  it("deve permitir que um usuário delete sua própria conta", async () => {
    mockRepository.findUsuario.mockResolvedValue(true);
    mockRepository.deleteUsuario.mockResolvedValue(true);

    await service.execute(mockRegularUser, mockRegularUser.id_usuario);

    expect(mockRepository.findUsuario).toHaveBeenCalledWith(mockRegularUser.id_usuario);
    expect(mockRepository.deleteUsuario).toHaveBeenCalledWith(
      mockRegularUser.id_usuario,
      mockRegularUser.id_usuario
    );
  });

  it("deve lançar ForbiddenException quando usuário tenta deletar conta de outro", async () => {
    const differentUserId = 3;

    await expect(service.execute(mockRegularUser, differentUserId)).rejects.toThrow(
      ForbiddenException
    );

    expect(mockRepository.findUsuario).not.toHaveBeenCalled();
    expect(mockRepository.deleteUsuario).not.toHaveBeenCalled();
  });

  it("deve lançar NotFoundException se o usuário não existir", async () => {
    mockRepository.findUsuario.mockResolvedValue(false);

    await expect(service.execute(mockAdminUser, targetUserId)).rejects.toThrow(
      NotFoundException
    );

    expect(mockRepository.findUsuario).toHaveBeenCalledWith(targetUserId);
    expect(mockRepository.deleteUsuario).not.toHaveBeenCalled();
  });

  it("deve lançar InternalServerErrorException se ocorrer um erro", async () => {
    mockRepository.findUsuario.mockRejectedValue(new Error("DB error"));

    await expect(service.execute(mockAdminUser, targetUserId)).rejects.toThrow(
      InternalServerErrorException
    );

    expect(mockRepository.deleteUsuario).not.toHaveBeenCalled();
  });
});
