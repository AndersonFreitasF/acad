import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { PostUsuarioService } from "../services/postUsuario.service";
import { Roles } from "src/common/decorators/role.decorator";
import { RoleEnum } from "src/common/enum/role.enum";
import { PostUsuarioDataDTO } from "../dtos/postUsuarioData.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";
import { User } from "src/common/decorators/user.decorator";

@Controller("usuario")
@Roles(RoleEnum.ADM)
@UseGuards(JwtAuthGuard)
export class UsuarioController {
  constructor(private readonly postUsuarioService: PostUsuarioService) {}

  @Post('/')
  async postUsuario(
    @Body() data: PostUsuarioDataDTO,
    @User() user: TokenPayload
  ) {
    console.log("LOG DO CONTROLLER:",user)
    return await this.postUsuarioService.execute(data, user.id_usuario);
  }
}
