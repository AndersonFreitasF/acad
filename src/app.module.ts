import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./modules/database/database.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: "env/.env",
      isGlobal: true,
    }),
    DatabaseModule,
  ],
})
export class AppModule {}
