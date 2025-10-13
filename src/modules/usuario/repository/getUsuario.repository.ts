import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { GetUsuarioInputDto } from "../dtos/getUsuarioInput.dto";

@Injectable()
export class GetUsuarioRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}
  async getUsuarios(dto: GetUsuarioInputDto) {
    const sql = `SELECT u.nome, u.email, t.id_treino 
    FROM usuario u
    LEFT JOIN usuario_treino ut ON ut.id_usuario = u.id_usuario
    LEFT JOIN treino t ON t.id_treino = ut.id_treino
        WHERE u.tipo = 'ALUNO'
    ORDER BY u.id_usuario
        LIMIT $1 OFFSET $2`;

    const binds = [dto.size, (dto.page - 1) * dto.size];

    const result = await this.dataBaseService.query(sql, binds);

    return result?.rows ?? [];
  }
}
