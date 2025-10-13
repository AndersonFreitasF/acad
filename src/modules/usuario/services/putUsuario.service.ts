import { Injectable } from "@nestjs/common";
import { PutUsuarioRepository } from "../repository/putUsuario.repository";
import { PutUsuarioDataDTO } from "../dtos/putUsuarioInput.dto";
const argon2 = require("argon2");

@Injectable()
export class putUsuarioService {
  constructor(private readonly putUsuarioRepository: PutUsuarioRepository) {}

  async execute(data: PutUsuarioDataDTO, update_by: number, id_usuario) {
    await this.putUsuarioRepository.putUsuario(
      { ...data, senha: await this.hash(data.senha) },
      update_by,
      id_usuario
    );
  }

  async hash(senha: string) {
    return await argon2.hash(senha, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }
}
