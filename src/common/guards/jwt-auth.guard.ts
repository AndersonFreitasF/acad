import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";

import "reflect-metadata";
import { checkRoles } from "./role.guard";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Token não fornecido");
    }

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      request["user"] = payload;

      const handler = context.getHandler();
      const hasAccess = checkRoles({ user: payload }, handler);

      if (!hasAccess) {
        throw new ForbiddenException("Acesso negado: permissão insuficiente");
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      console.error("Erro na verificação do token:", error);
      throw new UnauthorizedException("Token inválido");
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
