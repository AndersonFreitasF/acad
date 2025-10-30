import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
  Logger,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Pool, PoolClient, QueryResult } from "pg";
import databaseConfig from "../../../config/database.config";
import { IDatabase } from "../interfaces/database.interface";

@Injectable()
export class DatabaseService
  implements IDatabase, OnModuleInit, OnModuleDestroy
{
  private pool: Pool;
  private client: PoolClient | null = null;
  private transactionClient: PoolClient | null = null;
  private isTransaction: boolean = false;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @Inject(databaseConfig.KEY)
    private config: ConfigType<typeof databaseConfig>
  ) {
    this.pool = new Pool({
      host: this.config.host,
      port: this.config.port,
      database: this.config.database,
      user: this.config.username,
      password: this.config.password,
      ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
      max: this.config.max,
      idleTimeoutMillis: this.config.idleTimeoutMillis,
      connectionTimeoutMillis: this.config.connectionTimeoutMillis,
    });

    this.pool.on("error", (err) => {
      console.error("Erro inesperado no cliente ocioso", err);
    });
  }

  async onModuleInit() {
    await this.testConnection();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async testConnection(): Promise<void> {
    let client: PoolClient | null = null;
    try {
      client = await this.pool.connect();
      const result = await client.query(
        "SELECT NOW() as current_time, current_database() as database_name"
      );
      this.logger.log("Database conectada com sucesso!");
      this.logger.debug(`Database: ${result.rows[0].database_name}`);
      this.logger.debug(`Server time: ${result.rows[0].current_time}`);
    } catch (error) {
      this.logger.error("Falha ao conectar na database:", error as any);
      throw error;
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async connect(): Promise<PoolClient> {
    if (this.client) {
      return this.client;
    }

    this.client = await this.pool.connect();
    return this.client;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      this.client.release();
      this.client = null;
    }

    if (this.pool) {
      await this.pool.end();
      console.log("Database pool fechada");
    }
  }

  async query(sql: string, params: any[] = []): Promise<QueryResult> {
    let client: PoolClient | undefined;

    try {
      if (this.isTransaction && this.transactionClient) {
        client = this.transactionClient;
      } else {
        client = await this.connect();
      }

      if (process.env.NODE_ENV !== "production") {
        this.logger.debug(`Executando query: ${sql}`);
        this.logger.debug(`Parametros: ${JSON.stringify(params)}`);
      }

      const result = await client.query(sql, params);
      return result;
    } catch (error) {
      this.logger.error("Erro na query:", error as any);
      if (!this.isTransaction && client && client !== this.transactionClient) {
        try {
          client.release();
        } catch (releaseError) {
          this.logger.warn("Erro ao liberar conexão:", releaseError);
        }
        this.client = null;
      }
      throw error;
    } finally {
      if (!this.isTransaction && client && client !== this.transactionClient && this.client) {
        try {
          client.release();
        } catch (releaseError) {
          this.logger.warn("Erro ao liberar conexão no finally:", releaseError);
        }
        this.client = null;
      }
    }
  }

  async transaction<T>(callback: (db: IDatabase) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");
      this.isTransaction = true;
      this.transactionClient = client;

      this.logger.debug("Transacao iniciada");

      const result = await callback(this);

      await client.query("COMMIT");
      this.logger.debug("Transacao commitada");

      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      this.logger.error("Transacao deu rollback:", error as any);
      throw error;
    } finally {
      this.isTransaction = false;
      this.transactionClient = null;
      client.release();
    }
  }

  async beginTransaction(): Promise<void> {
    if (this.isTransaction) {
      throw new Error("Transacao ja em andamento");
    }

    this.transactionClient = await this.pool.connect();
    await this.transactionClient.query("BEGIN");
    this.isTransaction = true;
    this.logger.debug("Transacao iniciada manualmente");
  }

  async commit(): Promise<void> {
    if (!this.isTransaction || !this.transactionClient) {
      throw new Error("Nenhuma transacao em andamento");
    }

    await this.transactionClient.query("COMMIT");
    this.transactionClient.release();
    this.transactionClient = null;
    this.isTransaction = false;
    this.logger.debug("Transacao commitada manualmente");
  }

  async rollback(): Promise<void> {
    if (!this.isTransaction || !this.transactionClient) {
      throw new Error("Nenhuma transacao em andamento");
    }

    await this.transactionClient.query("ROLLBACK");
    this.transactionClient.release();
    this.transactionClient = null;
    this.isTransaction = false;
    this.logger.debug("Transacao feita rollback manualmente");
  }

  async findOne(
    table: string,
    where: Record<string, any> = {}
  ): Promise<any | null> {
    const whereKeys = Object.keys(where);

    if (whereKeys.length === 0) {
      throw new Error("Clausula WHERE e necessaria para findOne");
    }

    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const key of whereKeys) {
      const value = where[key];
      if (value === null) {
        conditions.push(`${key} IS NULL`);
      } else {
        conditions.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    const sql = `SELECT * FROM ${this.escapeIdentifier(table)} WHERE ${conditions.join(" AND ")} LIMIT 1`;
    const result = await this.query(sql, values);

    return result.rows[0] || null;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query("SELECT 1 as health_check");
      return result.rows[0].health_check === 1;
    } catch (error) {
      console.error("Health check falhou:", error);
      return false;
    }
  }

  private escapeIdentifier(identifier: string): string {
    return `"${identifier}"`;
  }
}
