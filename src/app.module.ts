import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./modules/database/database.module";
import { UsuarioModule } from "./modules/usuario/usuario.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: "env/.env",
      isGlobal: true,
    }),
    DatabaseModule,
    UsuarioModule,
  ],
})
export class AppModule {}
