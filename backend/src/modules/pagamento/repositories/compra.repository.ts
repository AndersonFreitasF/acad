import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/modules/database/services/database.service";

@Injectable()
export class CompraRepository {
  constructor(private readonly dataBaseService: DatabaseService) {}

  async getAsaasCustomerId(id_usuario: number): Promise<string | null> {
    const sql = `SELECT asaas_customer_id FROM usuario WHERE id_usuario = $1`;
    const binds = [id_usuario];
    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows?.[0]?.asaas_customer_id ?? null;
  }

  async getTreinoById(treinoId: number): Promise<{ id: number; preco: number } | null> {
    const sql = `
    SELECT id, preco
    FROM treino
    WHERE id = $1
      AND deleted_at IS NULL`;
    const binds = [treinoId];
    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows?.[0] ?? null;
  }

  async usuarioJaPossuiTreino(id_usuario: number, id_treino: number): Promise<boolean> {
    const sql = `
    SELECT 1
    FROM usuario_treino
    WHERE id_usuario = $1 AND id_treino = $2
    LIMIT 1`;
    const binds = [id_usuario, id_treino];
    const result = await this.dataBaseService.query(sql, binds);
    return !!result?.rows?.[0];
  }

  async salvarPagamento(
    id_usuario: number,
    id_pagamento_asaas: string,
    valor: number,
    tipo: string,
    status: string
  ): Promise<number> {
    const insertSql = `
    INSERT INTO pagamento (id_usuario, id_pagamento_asaas, valor, tipo, status)
    VALUES ($1, $2, $3, $4, $5)`;
    const insertBinds = [id_usuario, id_pagamento_asaas, valor, tipo, status];
    await this.dataBaseService.query(insertSql, insertBinds);

    const selectSql = `
    SELECT id
    FROM pagamento
    WHERE id_pagamento_asaas = $1
    ORDER BY id DESC
    LIMIT 1`;
    const selectBinds = [id_pagamento_asaas];
    const result = await this.dataBaseService.query(selectSql, selectBinds);
    return result.rows[0]?.id;
  }

  async vincularTreinoPagamento(id_treino: number, id_pagamento: number): Promise<void> {
    const sql = `
    INSERT INTO treino_pagamento (id_treino, id_pagamento)
    VALUES ($1, $2)
    ON CONFLICT (id_treino, id_pagamento) DO NOTHING`;
    const binds = [id_treino, id_pagamento];
    await this.dataBaseService.query(sql, binds);
  }

  async concederAcessoUsuarioTreino(id_usuario: number, id_treino: number): Promise<void> {
    const sql = `
    INSERT INTO usuario_treino (id_usuario, id_treino)
    VALUES ($1, $2)
    ON CONFLICT (id_usuario, id_treino) DO NOTHING`;
    const binds = [id_usuario, id_treino];
    await this.dataBaseService.query(sql, binds);
  }

  async getPagamentoByAsaasId(id_pagamento_asaas: string): Promise<{ id: number; id_usuario: number } | null> {
    const sql = `SELECT id, id_usuario FROM pagamento WHERE id_pagamento_asaas = $1`;
    const binds = [id_pagamento_asaas];
    const result = await this.dataBaseService.query(sql, binds);
    return result?.rows?.[0] ?? null;
  }

  async getTreinosPorPagamento(id_pagamento: number): Promise<number[]> {
    const sql = `SELECT id_treino FROM treino_pagamento WHERE id_pagamento = $1`;
    const binds = [id_pagamento];
    const result = await this.dataBaseService.query(sql, binds);
    return (result?.rows ?? []).map((r: any) => r.id_treino as number);
  }
}


