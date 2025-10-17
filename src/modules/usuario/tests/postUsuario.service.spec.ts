import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { PostUsuarioService } from "../services/postUsuario.service";
import { InternalServerErrorException } from "@nestjs/common";
import { UsuarioRepositoryPort } from "../application/ports/usuario-repository.port";
import { PasswordHasherPort } from "../../auth/application/ports/password-hasher.port";

describe("PostUsuarioService", () => {
  let service: PostUsuarioService;
  let mockRepository: Record<keyof UsuarioRepositoryPort, Mock>;
  let mockPasswordHasher: Record<keyof PasswordHasherPort, Mock>;

  const mockData = {
    nome: "Anderson",
    email: "anderson@example.com",
    senha: "123456",
  };

  const createdBy = 1;

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

    service = new PostUsuarioService(
      mockRepository as UsuarioRepositoryPort,
      mockPasswordHasher as PasswordHasherPort
    );
    vi.clearAllMocks();
  });

  it("deve criar um usuário com sucesso", async () => {
    const hashedSenha = "hashed_password";
    mockPasswordHasher.hash.mockResolvedValue(hashedSenha);

    await service.execute(mockData, createdBy);

    expect(mockPasswordHasher.hash).toHaveBeenCalledWith(mockData.senha);
    expect(mockRepository.postUsuario).toHaveBeenCalledWith(
      { ...mockData, senha: hashedSenha },
      createdBy
    );
  });

  it("deve lançar InternalServerErrorException se ocorrer um erro", async () => {
    const hashedSenha = "hashed_password";
    mockPasswordHasher.hash.mockResolvedValue(hashedSenha);

    mockRepository.postUsuario.mockRejectedValue(new Error("DB error"));

    await expect(service.execute(mockData, createdBy)).rejects.toThrow(
      InternalServerErrorException
    );

    expect(mockRepository.postUsuario).toHaveBeenCalledWith(
      { ...mockData, senha: hashedSenha },
      createdBy
    );
  });
});
