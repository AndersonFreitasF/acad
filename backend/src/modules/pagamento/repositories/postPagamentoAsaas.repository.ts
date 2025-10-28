import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";
import { InternalPaymentStatus } from "../interface/asaas.interface";

@Injectable()
export class PostPagamentoAsaasRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getCustomerId(id_usuario: number): Promise<string | null> {
    const sql = `SELECT asaas_customer_id FROM usuario WHERE id_usuario = $1`;
    const result = await this.databaseService.query(sql, [id_usuario]);
    return result?.rows[0]?.asaas_customer_id ?? null;
  }

  async savePagamento(
    id_usuario: number,
    id_pagamento: string,
    valor: number,
    tipo: string,
    status: InternalPaymentStatus
  ): Promise<void> {
    const sql = `
      INSERT INTO pagamento (id_usuario, id_pagamento_asaas, valor, tipo, status)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await this.databaseService.query(sql, [
      id_usuario,
      id_pagamento,
      valor,
      tipo,
      status,
    ]);
  }

  async getPagamentoById(id_pagamento: number): Promise<{
    id_pagamento_asaas: string;
    status: InternalPaymentStatus;
  } | null> {
    const sql = `
      SELECT id_pagamento_asaas, status
      FROM pagamento
      WHERE id = $1
    `;
    const result = await this.databaseService.query(sql, [id_pagamento]);
    return result?.rows[0] ?? null;
  }

  async updatePagamentoStatus(
    id_pagamento: number,
    status: InternalPaymentStatus
  ): Promise<void> {
    const sql = `UPDATE pagamento SET status = $1, updated_at = NOW() WHERE id = $2`;
    await this.databaseService.query(sql, [status, id_pagamento]);
  }
}
