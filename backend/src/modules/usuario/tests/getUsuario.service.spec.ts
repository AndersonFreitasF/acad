import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { GetUsuarioService } from "../services/getUsuario.service";
import { InternalServerErrorException } from "@nestjs/common";
import { UsuarioRepositoryPort } from "../application/ports/usuario-repository.port";

describe("GetUsuarioService", () => {
  let service: GetUsuarioService;
  let mockRepository: Record<keyof UsuarioRepositoryPort, Mock>;

  const mockInput = {
    page: 1,
    size: 10,
  };

  beforeEach(() => {
    mockRepository = {
      countUsuarios: vi.fn(),
      getUsuarios: vi.fn(),
      postUsuario: vi.fn(),
      findUsuario: vi.fn(),
      putUsuario: vi.fn(),
      deleteUsuario: vi.fn(),
    };

    service = new GetUsuarioService(mockRepository as UsuarioRepositoryPort);
    vi.clearAllMocks();
  });

  it("deve retornar lista de usuários e total corretamente", async () => {
    const usuarios = [
      { id_usuario: 1, nome: "Anderson" },
      { id_usuario: 2, nome: "Maria" },
    ];

    mockRepository.countUsuarios.mockResolvedValue(2);
    mockRepository.getUsuarios.mockResolvedValue(usuarios);

    const result = await service.execute(mockInput);

    expect(result).toEqual({
      Usuarios: usuarios,
      Total: 2,
      Pagina: 1,
      Tamanho_Pagina: 10,
    });

    expect(mockRepository.countUsuarios).toHaveBeenCalledWith(mockInput);
    expect(mockRepository.getUsuarios).toHaveBeenCalledWith(mockInput);
  });

  it("deve retornar array vazio e total 0 se repositório retornar undefined", async () => {
    mockRepository.countUsuarios.mockResolvedValue(undefined);
    mockRepository.getUsuarios.mockResolvedValue(undefined);

    const result = await service.execute(mockInput);

    expect(result).toEqual({
      Usuarios: [],
      Total: 0,
      Pagina: 1,
      Tamanho_Pagina: 10,
    });
  });

  it("deve lançar InternalServerErrorException em caso de erro", async () => {
    mockRepository.countUsuarios.mockRejectedValue(new Error("DB error"));

    await expect(service.execute(mockInput)).rejects.toThrow(
      InternalServerErrorException
    );
  });
});
