import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { PostProfessorService } from "../services/postProfessor.service";
import { InternalServerErrorException } from "@nestjs/common";
import { ProfessorRepositoryPort } from "../application/ports/professor-repository.port";
import { PasswordHasherPort } from "../../auth/application/ports/password-hasher.port";

describe("PostProfessorService", () => {
  let service: PostProfessorService;
  let mockRepository: Record<keyof ProfessorRepositoryPort, Mock>;
  let mockPasswordHasher: Record<keyof PasswordHasherPort, Mock>;

  const mockData = {
    nome: "Professor Silva",
    email: "professor@example.com",
    senha: "123456",
  };

  const createdBy = 1;

  beforeEach(() => {
    mockRepository = {
      countProfessores: vi.fn(),
      getProfessores: vi.fn(),
      postUsuario: vi.fn(),
      findUsuario: vi.fn(),
      putProfessor: vi.fn(),
      deleteProfessor: vi.fn(),
    };

    mockPasswordHasher = {
      hash: vi.fn(),
      verify: vi.fn(),
    };

    service = new PostProfessorService(
      mockRepository as ProfessorRepositoryPort,
      mockPasswordHasher as PasswordHasherPort
    );
    vi.clearAllMocks();
  });

  it("deve criar um professor com sucesso", async () => {
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
