import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./modules/database/database.module";
import { UsuarioModule } from "./modules/usuario/usuario.module";
import { AuthModule } from "./modules/auth/auth.module";
import { TreinadorModule } from "./modules/treinador/treinador.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: "env/.env",
      isGlobal: true,
    }),
    DatabaseModule,
    UsuarioModule,
    AuthModule,
    TreinadorModule,
  ],
})
export class AppModule {}
