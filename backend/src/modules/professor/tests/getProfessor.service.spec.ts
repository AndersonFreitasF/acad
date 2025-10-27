import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { GetProfessorService } from "../services/getProfessor.service";
import { InternalServerErrorException } from "@nestjs/common";
import { ProfessorRepositoryPort } from "../application/ports/professor-repository.port";

describe("GetProfessorService", () => {
  let service: GetProfessorService;
  let mockRepository: Record<keyof ProfessorRepositoryPort, Mock>;

  const mockInput = {
    page: 1,
    size: 10,
  };

  beforeEach(() => {
    mockRepository = {
      countProfessores: vi.fn(),
      getProfessores: vi.fn(),
      postUsuario: vi.fn(),
      findUsuario: vi.fn(),
      putProfessor: vi.fn(),
      deleteProfessor: vi.fn(),
    };

    service = new GetProfessorService(mockRepository as ProfessorRepositoryPort);
    vi.clearAllMocks();
  });

  it("deve retornar lista de professores e total corretamente", async () => {
    const professores = [
      { id_usuario: 1, nome: "Professor Silva" },
      { id_usuario: 2, nome: "Professor Santos" },
    ];

    mockRepository.countProfessores.mockResolvedValue(2);
    mockRepository.getProfessores.mockResolvedValue(professores);

    const result = await service.execute(mockInput);

    expect(result).toEqual({
      Usuarios: professores,
      Total: 2,
      Pagina: 1,
      Tamanho_Pagina: 10,
    });

    expect(mockRepository.countProfessores).toHaveBeenCalledWith(mockInput);
    expect(mockRepository.getProfessores).toHaveBeenCalledWith(mockInput);
  });

  it("deve retornar array vazio e total 0 se repositório retornar undefined", async () => {
    mockRepository.countProfessores.mockResolvedValue(undefined);
    mockRepository.getProfessores.mockResolvedValue(undefined);

    const result = await service.execute(mockInput);

    expect(result).toEqual({
      Usuarios: [],
      Total: 0,
      Pagina: 1,
      Tamanho_Pagina: 10,
    });
  });

  it("deve lançar InternalServerErrorException em caso de erro", async () => {
    mockRepository.countProfessores.mockRejectedValue(new Error("DB error"));

    await expect(service.execute(mockInput)).rejects.toThrow(
      InternalServerErrorException
    );
  });
});
