import { describe, it, expect, beforeEach, vi } from "vitest";
import { NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { PostCustomerAsaasService } from "../services/postCustomerAsaas.service";
import { PagamentoRepositoryPort } from "../application/ports/pagamento-repository.port";

describe("PostCustomerAsaasService", () => {
  let service: PostCustomerAsaasService;
  let mockRepo: PagamentoRepositoryPort;

  beforeEach(() => {
    mockRepo = {
      getDadosUsuario: vi.fn(),
      postCustomer: vi.fn(),
    };

    service = new PostCustomerAsaasService(mockRepo);
  });

  describe("execute", () => {
    it("should create customer successfully when user exists", async () => {
      const mockUsuarioData = {
        name: "João Silva",
        email: "joao@example.com",
        cpfCnpj: "12345678901",
      };

      const mockAsaasResponse = {
        id: "cus_123456",
        name: "João Silva",
        email: "joao@example.com",
        cpfCnpj: "12345678901",
        dateCreated: "2024-01-15",
      };

      vi.spyOn(mockRepo, "getDadosUsuario").mockResolvedValue(mockUsuarioData);
      vi.spyOn(mockRepo, "postCustomer").mockResolvedValue(mockAsaasResponse);

      const result = await service.execute(1);

      expect(mockRepo.getDadosUsuario).toHaveBeenCalledWith(1);
      expect(mockRepo.postCustomer).toHaveBeenCalledWith({
        email: "joao@example.com",
        cpfCnpj: "12345678901",
        name: "João Silva",
      });
      expect(result).toEqual(mockAsaasResponse);
    });

    it("should throw NotFoundException when user does not exist", async () => {
      vi.spyOn(mockRepo, "getDadosUsuario").mockResolvedValue(null);

      await expect(service.execute(999)).rejects.toThrow(NotFoundException);
      await expect(service.execute(999)).rejects.toThrow("Usuário não encontrado");

      expect(mockRepo.getDadosUsuario).toHaveBeenCalledWith(999);
      expect(mockRepo.postCustomer).not.toHaveBeenCalled();
    });

    it("should throw InternalServerErrorException when postCustomer fails", async () => {
      const mockUsuarioData = {
        name: "João Silva",
        email: "joao@example.com",
        cpfCnpj: "12345678901",
      };

      vi.spyOn(mockRepo, "getDadosUsuario").mockResolvedValue(mockUsuarioData);
      vi.spyOn(mockRepo, "postCustomer").mockRejectedValue(
        new Error("API error")
      );

      await expect(service.execute(1)).rejects.toThrow(
        InternalServerErrorException
      );
      await expect(service.execute(1)).rejects.toThrow(
        "Erro ao criar cliente no Asaas"
      );
    });

    it("should throw InternalServerErrorException when getDadosUsuario fails", async () => {
      vi.spyOn(mockRepo, "getDadosUsuario").mockRejectedValue(
        new Error("Database error")
      );

      await expect(service.execute(1)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});

