import { BadRequestException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PostProfessorDataDTO } from "../dtos/postProfessorData.dto";
import {
  ProfessorRepositoryPort,
  ProfessorRepositoryPortToken,
} from "../application/ports/professor-repository.port";
import { PasswordHasherPort, PasswordHasherPortToken } from "../../auth/application/ports/password-hasher.port";

@Injectable()
export class PostProfessorService {
  constructor(
    @Inject(ProfessorRepositoryPortToken)
    private readonly repo: ProfessorRepositoryPort,
    @Inject(PasswordHasherPortToken)
    private readonly passwordHasher: PasswordHasherPort
  ) {}

  async execute(data: PostProfessorDataDTO, created_by: number) {
    const cpfValido = await this.checkCpf(data.cpf);
    if (!cpfValido) {
      throw new BadRequestException("CPF invalido");
    }

    try {
      await this.repo.postUsuario(
        { ...data, senha: await this.passwordHasher.hash(data.senha) },
        created_by
      );
    } catch (error) {
      throw new InternalServerErrorException(
        "Não foi possível criar o professor"
      );
    }
  }

  async checkCpf(cpf: string): Promise<boolean> {
    if (!cpf || cpf.length !== 11) return false;
    
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
