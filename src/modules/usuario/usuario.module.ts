import { Module } from "@nestjs/common";
import { UsuarioController } from "./controllers/usuario.controller";
import { PostUsuarioRepository } from "./repository/postUsuario.repository";
import { PostUsuarioService } from "./services/postUsuario.service";
import { DatabaseModule } from "../database/database.module";
import { GetUsuarioService } from "./services/getUsuario.service";
import { GetUsuarioRepository } from "./repository/getUsuario.repository";
import { putUsuarioService } from "./services/putUsuario.service";
import { PutUsuarioRepository } from "./repository/putUsuario.repository";

@Module({
  imports: [DatabaseModule],
  controllers: [UsuarioController],
  providers: [
    PostUsuarioRepository,
    PostUsuarioService,
    GetUsuarioService,
    GetUsuarioRepository,
    putUsuarioService,
    PutUsuarioRepository,
  ],
})
export class UsuarioModule {}
