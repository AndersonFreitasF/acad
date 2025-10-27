import { QueryResult } from "pg";

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
}

export interface IDatabase {
  connect(): Promise<any>;
  disconnect(): Promise<void>;
  query(sql: string, params?: any[]): Promise<QueryResult>;
  transaction<T>(callback: (db: IDatabase) => Promise<T>): Promise<T>;
  beginTransaction(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  findOne(table: string, where?: Record<string, any>): Promise<any | null>;
  healthCheck(): Promise<boolean>;
}
