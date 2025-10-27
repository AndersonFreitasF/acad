import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { PostUsuarioDataDTO } from "../dtos/postUsuarioData.dto";
import {
  UsuarioRepositoryPort,
  UsuarioRepositoryPortToken,
} from "../application/ports/usuario-repository.port";
import {
  PasswordHasherPort,
  PasswordHasherPortToken,
} from "../../auth/application/ports/password-hasher.port";
@Injectable()
export class PostUsuarioService {
  constructor(
    @Inject(UsuarioRepositoryPortToken)
    private readonly repo: UsuarioRepositoryPort,
    @Inject(PasswordHasherPortToken)
    private readonly passwordHasher: PasswordHasherPort
  ) {}

  async execute(data: PostUsuarioDataDTO, created_by: number) {
    try {
      const cpfValido = await this.checkCpf(data.cpf);
      if (cpfValido == true) {
        await this.repo.postUsuario(
          { ...data, senha: await this.passwordHasher.hash(data.senha) },
          created_by
        );
      } else {
        throw new BadRequestException("CPF invalido");
      }
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possível criar o usuário"
      );
    }
  }

  async checkCpf(cpf: string): Promise<boolean> {
    const arrayCpf = cpf.split("").map((n) => parseInt(n, 10));

    let soma1 = 0;
    for (let i = 0; i < 9; i++) {
      soma1 += arrayCpf[i] * (10 - i);
    }
    let resto1 = (soma1 * 10) % 11;
    if (resto1 === 10 || resto1 === 11) resto1 = 0;
    if (resto1 !== arrayCpf[9]) return false;

    let soma2 = 0;
    for (let i = 0; i < 10; i++) {
      soma2 += arrayCpf[i] * (11 - i);
    }
    let resto2 = (soma2 * 10) % 11;
    if (resto2 === 10 || resto2 === 11) resto2 = 0;

    return resto2 === arrayCpf[10];
  }
}
