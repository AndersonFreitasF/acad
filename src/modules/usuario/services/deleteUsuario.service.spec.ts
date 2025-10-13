import { describe, it, expect, beforeEach, vi } from "vitest";
import { DeleteUsuarioService } from "../services/deleteUsuario.service";
import { DeleteUsuarioRepository } from "../repositories/deleteUsuario.repository";
import {
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { Role } from "src/common/enum/role.enum";

describe("DeleteUsuarioService", () => {
  let service: DeleteUsuarioService;
  let repository: DeleteUsuarioRepository;

  const mockRepository = {
    findUsuario: vi.fn(),
    deleteUsuario: vi.fn(),
  };

  const mockUser = { id_usuario: 1, tipo: Role.ADM };
  const targetUserId = 2;

  beforeEach(() => {
    repository = mockRepository as unknown as DeleteUsuarioRepository;
    service = new DeleteUsuarioService(repository);
    vi.clearAllMocks();
  });

  it("deve deletar o usuário quando ele existe", async () => {
    mockRepository.findUsuario.mockResolvedValue({ id_usuario: targetUserId });
    mockRepository.deleteUsuario.mockResolvedValue(true);

    await service.execute(mockUser, targetUserId);

    expect(mockRepository.findUsuario).toHaveBeenCalledWith(targetUserId);
    expect(mockRepository.deleteUsuario).toHaveBeenCalledWith(
      mockUser.id_usuario,
      targetUserId
    );
  });

  it("deve lançar NotFoundException se o usuário não existir", async () => {
    mockRepository.findUsuario.mockResolvedValue(null);

    await expect(service.execute(mockUser, targetUserId)).rejects.toThrow(
      NotFoundException
    );

    expect(mockRepository.deleteUsuario).not.toHaveBeenCalled();
  });

  it("deve lançar InternalServerErrorException se ocorrer um erro", async () => {
    mockRepository.findUsuario.mockRejectedValue(new Error("DB error"));

    await expect(service.execute(mockUser, targetUserId)).rejects.toThrow(
      InternalServerErrorException
    );

    expect(mockRepository.deleteUsuario).not.toHaveBeenCalled();
  });
});
