import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { PostUsuarioService } from "../services/postUsuario.service";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enum/role.enum";
import { PostUsuarioDataDTO } from "../dtos/postUsuarioData.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";
import { User } from "src/common/decorators/user.decorator";
import { GetUsuarioInputDto } from "../dtos/getUsuarioInput.dto";
import { GetUsuarioService } from "../services/getUsuario.service";
import { PutUsuarioDataDTO } from "../dtos/putUsuarioData.dto";
import { putUsuarioService } from "../services/putUsuario.service";

@Controller("usuario")
@UseGuards(JwtAuthGuard)
export class UsuarioController {
  constructor(
    private readonly postUsuarioService: PostUsuarioService,
    private readonly getUsuarioService: GetUsuarioService,
    private readonly putUsuarioServie: putUsuarioService
  ) {}

  @Post("/")
  @Roles(Role.ADM)
  async postUsuario(
    @Body() data: PostUsuarioDataDTO,
    @User() user: TokenPayload
  ) {
    return await this.postUsuarioService.execute(data, user.id_usuario);
  }

  @Get("/")
  @Roles(Role.ADM)
  async getUsuario(@Query() data: GetUsuarioInputDto) {
    return await this.getUsuarioService.execute(data);
  }

  @Put("/update/:id")
  @Roles(Role.ALUNO)
  async putUsuario(
    @Param("id") id_usuario: number,
    @Body() data: PutUsuarioDataDTO,
    @User() user: TokenPayload
  ) {
    return await this.putUsuarioServie.execute(
      data,
      user.id_usuario,
      id_usuario
    );
  }
}
