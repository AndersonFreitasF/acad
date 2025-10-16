import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenPayload } from "../interfaces/auth.interface.";
import { AuthRepositoryPort, AuthRepositoryPortToken } from "../application/ports/auth-repository.port";
import { PasswordHasherPort, PasswordHasherPortToken } from "../application/ports/password-hasher.port";

@Injectable()
export class AuthService {
  constructor(
    @Inject(AuthRepositoryPortToken)
    private readonly authRepo: AuthRepositoryPort,
    @Inject(PasswordHasherPortToken)
    private readonly passwordHasher: PasswordHasherPort,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, senha: string) {
    const user = await this.authRepo.findByEmail(email.toUpperCase());

    if (!user) throw new UnauthorizedException("Usuário não encontrado");

    const senhaCorreta = await this.passwordHasher.verify(user.senha, senha);
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
      expiresIn: 60 * 60 * 4,
      user: {
        id_usuario: user.id_usuario,
        email: user.email,
        tipo: user.tipo,
      },
    };
  }
}
