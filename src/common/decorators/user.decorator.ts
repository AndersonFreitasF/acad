import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";

export const User = createParamDecorator(
  (data: keyof TokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as TokenPayload;

    if (!user) {
      throw new UnauthorizedException("Usuário não autenticado");
    }

    return data ? user[data] : user;
  }
);
