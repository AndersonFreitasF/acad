import { describe, it, expect, beforeEach, vi, MockedObject } from "vitest";
import { GetUsuarioService } from "../services/getUsuario.service";
import { GetUsuarioRepository } from "../repositories/getUsuario.repository";
import { InternalServerErrorException } from "@nestjs/common";

describe("GetUsuarioService", () => {
  let service: GetUsuarioService;
  let mockRepository: MockedObject<GetUsuarioRepository>;

  const mockInput = {
    page: 1,
    size: 10,
  };

  beforeEach(() => {
    mockRepository = {
      countUsuarios: vi.fn(),
      getUsuarios: vi.fn(),
    } as MockedObject<GetUsuarioRepository>;

    service = new GetUsuarioService(mockRepository);
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
