import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";

@Injectable()
export class PostPagamentoAsaasRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getCustomerId(id_usuario: number): Promise<string | null> {
    const sql = `SELECT asaas_customer_id FROM usuario WHERE id_usuario = $1`;
    const binds = [id_usuario];

    const result = await this.databaseService.query(sql, binds);
    return result?.rows[0]?.asaas_customer_id ?? null;
  }

  async savePagamento(
    id_usuario: number,
    id_pagamento: string,
    valor: number,
    tipo: string,
    status: string
  ): Promise<void> {
    const sql = `
      INSERT INTO pagamento (id_usuario, id_pagamento_asaas, valor, tipo, status)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const binds = [id_usuario, id_pagamento, valor, tipo, status];
    await this.databaseService.query(sql, binds);
  }
}
