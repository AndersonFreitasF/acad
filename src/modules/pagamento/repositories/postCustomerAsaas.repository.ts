import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { AsaasCustomerData } from "../interface/asaas.interface";

@Injectable()
export class PostCustomerAsaasRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async getDadosUsuario(
    id_usuario: number
  ): Promise<AsaasCustomerData | null> {
    const sql = `SELECT nome AS name,
        email,
        cpf AS cpfCnpj
        FROM usuario WHERE id_usuario = $1`;
    const binds = [id_usuario];

    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows[0] ?? null;
  }
}

