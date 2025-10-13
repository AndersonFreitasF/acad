import { Test, TestingModule } from "@nestjs/testing";
import { GetUsuarioService } from "./getUsuario.service";
import { GetUsuarioRepository } from "../repositories/getUsuario.repository";
import { InternalServerErrorException } from "@nestjs/common";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("GetUsuarioService", () => {
  let service: GetUsuarioService;
  let repository: GetUsuarioRepository;

  const mockRepository = {
    countUsuarios: vi.fn(),
    getUsuarios: vi.fn(),
  };

  const mockInput = {
    page: 1,
    size: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsuarioService,
        {
          provide: GetUsuarioRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GetUsuarioService>(GetUsuarioService);
    repository = module.get<GetUsuarioRepository>(GetUsuarioRepository);

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

    expect(repository.countUsuarios).toHaveBeenCalledWith(mockInput);
    expect(repository.getUsuarios).toHaveBeenCalledWith(mockInput);
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
