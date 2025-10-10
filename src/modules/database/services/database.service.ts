import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Inject,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { Pool, PoolClient, QueryResult } from "pg";
import databaseConfig from "../../../config/database.config";
import { IDatabase, QueryOptions } from "../interfaces/database.interface";

@Injectable()
export class DatabaseService
  implements IDatabase, OnModuleInit, OnModuleDestroy
{
  private pool: Pool;
  private client: PoolClient | null = null;
  private transactionClient: PoolClient | null = null;
  private isTransaction: boolean = false;

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
      console.error("Unexpected error on idle client", err);
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
      console.log("✅ Database connected successfully");
      console.log("📊 Database:", result.rows[0].database_name);
      console.log("⏰ Server time:", result.rows[0].current_time);
    } catch (error) {
      console.error("❌ Database connection test failed:", error);
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
      console.log("✅ Database pool closed");
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

      console.log("📝 Executing query:", sql);
      console.log("🔧 Parameters:", params);

      const result = await client.query(sql, params);
      return result;
    } catch (error) {
      console.error("❌ Query error:", error);
      throw error;
    } finally {
      if (!this.isTransaction && client && client !== this.transactionClient) {
        client.release();
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

      console.log("🔄 Transaction started");

      const result = await callback(this);

      await client.query("COMMIT");
      console.log("✅ Transaction committed");

      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("❌ Transaction rolled back:", error);
      throw error;
    } finally {
      this.isTransaction = false;
      this.transactionClient = null;
      client.release();
    }
  }

  async beginTransaction(): Promise<void> {
    if (this.isTransaction) {
      throw new Error("Transaction already in progress");
    }

    this.transactionClient = await this.pool.connect();
    await this.transactionClient.query("BEGIN");
    this.isTransaction = true;
    console.log("🔄 Transaction started manually");
  }

  async commit(): Promise<void> {
    if (!this.isTransaction || !this.transactionClient) {
      throw new Error("No transaction in progress");
    }

    await this.transactionClient.query("COMMIT");
    this.transactionClient.release();
    this.transactionClient = null;
    this.isTransaction = false;
    console.log("✅ Transaction committed manually");
  }

  async rollback(): Promise<void> {
    if (!this.isTransaction || !this.transactionClient) {
      throw new Error("No transaction in progress");
    }

    await this.transactionClient.query("ROLLBACK");
    this.transactionClient.release();
    this.transactionClient = null;
    this.isTransaction = false;
    console.log("🔄 Transaction rolled back manually");
  }

  async findOne(
    table: string,
    where: Record<string, any> = {}
  ): Promise<any | null> {
    const whereKeys = Object.keys(where);

    if (whereKeys.length === 0) {
      throw new Error("WHERE clause is required for findOne");
    }

    const whereClause = whereKeys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(" AND ");
    const values = Object.values(where);

    const sql = `SELECT * FROM ${this.escapeIdentifier(table)} WHERE ${whereClause} LIMIT 1`;
    const result = await this.query(sql, values);

    return result.rows[0] || null;
  }

  async findMany(
    table: string,
    where: Record<string, any> = {},
    options: QueryOptions = {}
  ): Promise<any[]> {
    const { limit, offset, orderBy } = options;
    let whereClause = "";
    let values: any[] = [];

    if (Object.keys(where).length > 0) {
      whereClause =
        "WHERE " +
        Object.keys(where)
          .map((key, index) => `${key} = $${index + 1}`)
          .join(" AND ");
      values = Object.values(where);
    }

    let sql = `SELECT * FROM ${this.escapeIdentifier(table)} ${whereClause}`;

    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }

    if (limit) {
      sql += ` LIMIT $${values.length + 1}`;
      values.push(limit);
    }

    if (offset) {
      sql += ` OFFSET $${values.length + 1}`;
      values.push(offset);
    }

    const result = await this.query(sql, values);
    return result.rows;
  }

  async insert(table: string, data: Record<string, any>): Promise<any> {
    const columns = Object.keys(data).join(", ");
    const placeholders = Object.keys(data)
      .map((_, index) => `$${index + 1}`)
      .join(", ");
    const values = Object.values(data);

    const sql = `INSERT INTO ${this.escapeIdentifier(table)} (${columns}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.query(sql, values);

    return result.rows[0];
  }

  async update(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>
  ): Promise<any[]> {
    if (Object.keys(where).length === 0) {
      throw new Error("WHERE clause is required for update");
    }

    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const whereKeys = Object.keys(where);
    const whereClause = whereKeys
      .map((key, index) => `${key} = $${index + Object.keys(data).length + 1}`)
      .join(" AND ");
    const values = [...Object.values(data), ...Object.values(where)];

    const sql = `UPDATE ${this.escapeIdentifier(table)} SET ${setClause} WHERE ${whereClause} RETURNING *`;
    const result = await this.query(sql, values);

    return result.rows;
  }

  async delete(table: string, where: Record<string, any>): Promise<any[]> {
    if (Object.keys(where).length === 0) {
      throw new Error("WHERE clause is required for delete");
    }

    const whereKeys = Object.keys(where);
    const whereClause = whereKeys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(" AND ");
    const values = Object.values(where);

    const sql = `DELETE FROM ${this.escapeIdentifier(table)} WHERE ${whereClause} RETURNING *`;
    const result = await this.query(sql, values);

    return result.rows;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query("SELECT 1 as health_check");
      return result.rows[0].health_check === 1;
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }

  private escapeIdentifier(identifier: string): string {
    return `"${identifier}"`;
  }

  // Método utilitário para criar tabelas (útil para desenvolvimento)
  async createTableIfNotExists(
    tableName: string,
    schema: string
  ): Promise<void> {
    const checkTableSql = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );
    `;

    const result = await this.query(checkTableSql, [tableName]);

    if (!result.rows[0].exists) {
      await this.query(schema);
      console.log(`✅ Table ${tableName} created`);
    }
  }
}
