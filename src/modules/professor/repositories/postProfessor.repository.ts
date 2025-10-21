import { Injectable } from "@nestjs/common";

import { DatabaseService } from "src/modules/database/services/database.service";
import { PostProfessorDataDTO } from "../dtos/postProfessorData.dto";

@Injectable()
export class PostProfessorRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async postProfessor(data: PostProfessorDataDTO, created_by: number) {
    const sql = `INSERT INTO usuario(
      nome,
      email, 
      senha,
      tipo,
      cpf,
      created_by,
      created_at
      ) 
      VALUES($1, $2, $3, 'PROFESSOR' ,$4 , $5, NOW())
      `;

    const binds = [
      data.nome.toUpperCase(),
      data.email.toUpperCase(),
      data.senha,
      data.cpf,
      created_by,
    ];
    await this.dataBaseService.query(sql, binds);
  }
}
