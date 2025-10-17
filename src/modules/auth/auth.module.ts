import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./services/auth.service";
import { AuthRepository } from "./repository/auth.repository";
import { DatabaseModule } from "../database/database.module";
import { AuthController } from "./controller/auth.controller";
import { AuthRepositoryAdapter } from "./adapters/repositories/auth.repository.adapter";
import { Argon2PasswordHasherAdapter } from "./adapters/security/argon2-password-hasher.adapter";
import { AuthRepositoryPortToken } from "./application/ports/auth-repository.port";
import { PasswordHasherPortToken } from "./application/ports/password-hasher.port";

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "chave-super-secreta",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    AuthRepositoryAdapter,
    Argon2PasswordHasherAdapter,
    {
      provide: AuthRepositoryPortToken,
      useClass: AuthRepositoryAdapter,
    },
    {
      provide: PasswordHasherPortToken,
      useClass: Argon2PasswordHasherAdapter,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
