import { describe, it, expect, beforeEach, vi } from "vitest";
import { PostUsuarioService } from "../services/postUsuario.service";
import { PostUsuarioRepository } from "../repositories/postUsuario.repository";
import { InternalServerErrorException } from "@nestjs/common";
import * as argon2 from "argon2";

describe("PostUsuarioService", () => {
  let service: PostUsuarioService;
  let repository: PostUsuarioRepository;

  const mockRepository = {
    postUsuario: vi.fn(),
  };

  const mockData = {
    nome: "Anderson",
    email: "anderson@example.com",
    senha: "123456",
    tipo: "ALUNO",
  };

  const createdBy = 1;

  beforeEach(() => {
    repository = mockRepository as unknown as PostUsuarioRepository;
    service = new PostUsuarioService(repository);
    vi.clearAllMocks();
  });

  it("deve criar um usuário com sucesso", async () => {
    const hashedSenha = "hashed_password";
    vi.spyOn(service, "hash").mockResolvedValue(hashedSenha);

    await service.execute(mockData, createdBy);

    expect(service.hash).toHaveBeenCalledWith(mockData.senha);
    expect(mockRepository.postUsuario).toHaveBeenCalledWith(
      { ...mockData, senha: hashedSenha },
      createdBy
    );
  });

  it("deve lançar InternalServerErrorException se ocorrer um erro", async () => {
    const hashedSenha = "hashed_password";
    vi.spyOn(service, "hash").mockResolvedValue(hashedSenha);

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
