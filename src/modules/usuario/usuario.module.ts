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

@Module({
  imports: [DatabaseModule],
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
  ],
})
export class UsuarioModule {}
