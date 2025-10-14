import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";

@Injectable()
export class DeleteProfessorRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async findUsuario(id_usuario: number): Promise<boolean> {
    const sql = `SELECT 1 FROM usuario WHERE id_usuario = $1 LIMIT 1`;
    const binds = [id_usuario];

    const result = await this.dataBaseService.query(sql, binds);

    return result.rows.length > 0;
  }

  async deleteProfessor(deleted_by: number, id_usuario: number) {
    const sql = ` UPDATE usuario
  SET
    deleted_by = $1,
    deleted_at = NOW(),
    perfil_ativo = false
  WHERE id_usuario = $2;`;

    const binds = [deleted_by, id_usuario];

    const result = await this.dataBaseService.query(sql, binds);
    return result.rowCount > 0;
  }
}
