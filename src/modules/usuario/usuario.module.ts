import { Module } from "@nestjs/common";
import { UsuarioController } from "./controller/usuario.controller";
import { PostUsuarioRepository } from "./repositories/postUsuario.repository";
import { PostUsuarioService } from "./services/postUsuario.service";
import { DatabaseModule } from "../database/database.module";
import { GetUsuarioService } from "./services/getUsuario.service";
import { GetUsuarioRepository } from "./repositories/getUsuario.repository";
import { PutUsuarioService } from "./services/putUsuario.service";
import { PutUsuarioRepository } from "./repositories/putUsuario.repository";
import { DeleteUsuarioService } from "./services/deleteUsuario.service";
import { DeleteUsuarioRepository } from "./repositories/deleteUsuario.repository";
import { AuthModule } from "../auth/auth.module";

import { UsuarioRepositoryPortToken } from "./application/ports/usuario-repository.port";
import { UsuarioRepositoryAdapter } from "./adapters/repositories/usuario.repository.adapter";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UsuarioController],
  providers: [
    PostUsuarioRepository,
    PostUsuarioService,
    GetUsuarioRepository,
    GetUsuarioService,
    PutUsuarioRepository,
    PutUsuarioService,
    DeleteUsuarioRepository,
    DeleteUsuarioService,
    {
      provide: UsuarioRepositoryPortToken,
      useClass: UsuarioRepositoryAdapter,
    },
  ],
})
export class UsuarioModule {}
