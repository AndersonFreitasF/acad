import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const jwt = new JwtService({});
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await jwt.verifyAsync<TokenPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      request["user"] = payload;

      const userId = payload.id;
      const userType = payload.tipo;

      console.log(`Usuário ID: ${userId}, Tipo: ${userType}`);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
