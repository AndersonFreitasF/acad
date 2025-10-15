import { describe, it, expect, beforeEach, vi, MockedObject } from "vitest";
import { PostProfessorService } from "../services/postProfessor.service";
import { PostProfessorRepository } from "../repositories/postProfessor.repository";
import { InternalServerErrorException } from "@nestjs/common";

describe("PostProfessorService", () => {
  let service: PostProfessorService;
  let mockRepository: MockedObject<PostProfessorRepository>;

  const mockData = {
    nome: "Professor Silva",
    email: "professor@example.com",
    senha: "123456",
  };

  const createdBy = 1;

  beforeEach(() => {
    mockRepository = {
      postUsuario: vi.fn(),
    } as MockedObject<PostProfessorRepository>;

    service = new PostProfessorService(mockRepository);
    vi.clearAllMocks();
  });

  it("deve criar um professor com sucesso", async () => {
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
