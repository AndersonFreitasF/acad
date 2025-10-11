import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Token não fornecido");
    }

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      request["user"] = payload;


      const userId = payload.id_usuario;
      const userTipo = payload.tipo;
      


      return true;
    } catch (error) {
      console.error("Erro na verificação do token:", error);
      throw new UnauthorizedException("Token inválido");
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}