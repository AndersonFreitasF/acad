import { Module } from "@nestjs/common";
import { UsuarioController } from "./controllers/usuario.controller";
import { PostUsuarioRepository } from "./repository/postUsuario.repository";
import { PostUsuarioService } from "./services/postUsuario.service";
import { DatabaseModule } from "../database/database.module";


@Module({
  imports: [DatabaseModule],
  controllers: [UsuarioController],
  providers: [PostUsuarioRepository, PostUsuarioService],
})
export class UsuarioModule {}
