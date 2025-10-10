import { PostUsuarioDataDTO } from "../dtos/postUsuarioData.dto";
import { Injectable } from "@nestjs/common";

import { DatabaseService } from "src/modules/database/services/database.service";

@Injectable()
export class PostUsuarioRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async postUsuario(data: PostUsuarioDataDTO, created_by: number) {
    const sql = `INSERT INTO usuario(
      nome,
      email,
      senha,
      tipo,
      created_by,
      created_at,
      ) 
      VALUES($1, $2, $3, $4, $5, NOW())
      `;

    const binds = [
      data.nome.toUpperCase(),
      data.email,
      data.senha,
      data.tipo,
      created_by,
    ];
    await this.dataBaseService.query(sql, binds);
  }
}
