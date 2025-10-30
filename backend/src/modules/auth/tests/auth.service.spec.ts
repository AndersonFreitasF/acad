import { describe, it, expect, beforeEach, vi } from "vitest";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../services/auth.service";
import { AuthRepositoryPort, AuthUser } from "../application/ports/auth-repository.port";
import { PasswordHasherPort } from "../application/ports/password-hasher.port";

describe("AuthService", () => {
  let authService: AuthService;
  let mockAuthRepo: AuthRepositoryPort;
  let mockPasswordHasher: PasswordHasherPort;
  let mockJwtService: JwtService;

  beforeEach(() => {
    mockAuthRepo = {
      findByEmail: vi.fn(),
    };

    mockPasswordHasher = {
      hash: vi.fn(),
      verify: vi.fn(),
    };

    mockJwtService = {
      sign: vi.fn(),
    } as any;

    authService = new AuthService(
      mockAuthRepo,
      mockPasswordHasher,
      mockJwtService
    );
  });

  describe("validateUser", () => {
    it("should validate user successfully with correct credentials", async () => {
      const mockUser: AuthUser = {
        id_usuario: 1,
        nome: "Test User",
        email: "TEST@EXAMPLE.COM",
        senha: "hashedPassword",
        tipo: "ALUNO",
      };

      vi.spyOn(mockAuthRepo, "findByEmail").mockResolvedValue(mockUser);
      vi.spyOn(mockPasswordHasher, "verify").mockResolvedValue(true);

      const result = await authService.validateUser("test@example.com", "password123");

      expect(mockAuthRepo.findByEmail).toHaveBeenCalledWith("TEST@EXAMPLE.COM");
      expect(mockPasswordHasher.verify).toHaveBeenCalledWith(
        "hashedPassword",
        "password123"
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw UnauthorizedException when user not found", async () => {
      vi.spyOn(mockAuthRepo, "findByEmail").mockResolvedValue(null);

      await expect(
        authService.validateUser("test@example.com", "password123")
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        authService.validateUser("test@example.com", "password123")
      ).rejects.toThrow("Usuário não encontrado");
    });

    it("should throw UnauthorizedException when password is incorrect", async () => {
      const mockUser: AuthUser = {
        id_usuario: 1,
        nome: "Test User",
        email: "TEST@EXAMPLE.COM",
        senha: "hashedPassword",
        tipo: "ALUNO",
      };

      vi.spyOn(mockAuthRepo, "findByEmail").mockResolvedValue(mockUser);
      vi.spyOn(mockPasswordHasher, "verify").mockResolvedValue(false);

      await expect(
        authService.validateUser("test@example.com", "wrongpassword")
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        authService.validateUser("test@example.com", "wrongpassword")
      ).rejects.toThrow("Senha incorreta");
    });
  });

  describe("login", () => {
    it("should return access token and user data on successful login", async () => {
      const mockUser: AuthUser = {
        id_usuario: 1,
        nome: "Test User",
        email: "TEST@EXAMPLE.COM",
        senha: "hashedPassword",
        tipo: "ALUNO",
      };

      const mockToken = "jwt.token.here";

      vi.spyOn(mockAuthRepo, "findByEmail").mockResolvedValue(mockUser);
      vi.spyOn(mockPasswordHasher, "verify").mockResolvedValue(true);
      vi.spyOn(mockJwtService, "sign").mockReturnValue(mockToken);

      const result = await authService.login("test@example.com", "password123");

      expect(result).toEqual({
        accessToken: mockToken,
        expiresIn: 14400,
        user: {
          id_usuario: 1,
          nome: "Test User",
          email: "TEST@EXAMPLE.COM",
          tipo: "ALUNO",
        },
      });

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        id_usuario: 1,
        tipo: "ALUNO",
      });
    });

    it("should throw UnauthorizedException on invalid credentials", async () => {
      vi.spyOn(mockAuthRepo, "findByEmail").mockResolvedValue(null);

      await expect(
        authService.login("test@example.com", "password123")
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

