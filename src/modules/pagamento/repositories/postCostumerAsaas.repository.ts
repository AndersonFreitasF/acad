import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";

@Injectable()
export class postCostumerAsaasRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async getDadosUsuario(
    id_usuario: number
  ): Promise<{ name: string; CpfCnpj: string; email: string }> {
    const sql = `SELECT NOME as name
        email,
        cpf as CpfCnpj
        FROM usuario where id_usuario = $1`;
    const binds = [id_usuario];

    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows[0] ?? [];
  }
}
