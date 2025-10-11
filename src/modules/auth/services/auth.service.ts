import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "../repository/auth.repository";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { TokenPayload } from "../interfaces/auth.interface.";

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, senha: string) {
    const user = await this.authRepository.findByEmail(email);

    
    if (!user) throw new UnauthorizedException("Usuário não encontrado");


    const senhaCorreta = await argon2.verify(user.senha, senha);
    if (!senhaCorreta) throw new UnauthorizedException("Senha incorreta");

    return user;
  }


async login(email: string, senha: string) {
  const user = await this.validateUser(email, senha);
  
  const payload: TokenPayload = {
    id_usuario: user.id_usuario,       
    tipo: user.tipo,  
  };

  const accessToken = this.jwtService.sign(payload);

  return {
    accessToken,
    expiresIn: 3600 * 60, 
    user: {
      id_usuario: user.id_usuario,
      email: user.email,
      tipo: user.tipo,
    }
  };
}
}
