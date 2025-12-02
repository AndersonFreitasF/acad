import { PostUsuarioDataDTO } from "../dtos/postUsuarioData.dto";
import { Injectable } from "@nestjs/common";

import { DatabaseService } from "src/modules/database/services/database.service";

@Injectable()
export class PostUsuarioRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async postUsuario(data: PostUsuarioDataDTO, created_by: number): Promise<number> {
    const sql = `INSERT INTO usuario(
      nome,
      email,
      senha,
      tipo,
      cpf,
      created_by,
      created_at
      ) 
      VALUES($1, $2, $3, 'ALUNO', $4, $5, NOW())
      RETURNING id_usuario
      `;

    const binds = [
      data.nome.toUpperCase(),
      data.email.toUpperCase(),
      data.senha,
      data.cpf,
      created_by === 0 ? null : created_by,
    ];
    const result = await this.dataBaseService.query(sql, binds);
    return result.rows[0].id_usuario;
  }
}
