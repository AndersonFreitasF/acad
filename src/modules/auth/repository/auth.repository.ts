import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../../database/services/database.service";

@Injectable()
export class AuthRepository {
  private readonly tableName = "usuarios";

  constructor(private readonly db: DatabaseService) {}

  async findByEmail(email: string) {
    return this.db.findOne(this.tableName, { email });
  }
}
