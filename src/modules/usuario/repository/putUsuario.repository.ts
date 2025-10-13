import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { PutUsuarioDataDTO } from "../dtos/putUsuarioData.dto";

@Injectable()
export class PutUsuarioRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}
  async putUsuario(
    data: PutUsuarioDataDTO,
    update_by: number,
    id_usuario: number
  ) {
    const sql = `UPDATE usuario
    SET  = COALESCE($1, nome)
    SET  =  COALESCE($2, email),
    SET  = COALESCE($3, senha),
    SET updated_by = $4,
    SET updated_at = NOW()
    WHERE id_usuario = :$5;`;

    const binds = [
      data.nome ?? null,
      data.email ?? null,
      data.senha ?? null,
      update_by,
      id_usuario,
    ];
    await this.dataBaseService.query(sql, binds);
  }
}
