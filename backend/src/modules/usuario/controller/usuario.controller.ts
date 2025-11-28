import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";
import { User } from "src/common/decorators/user.decorator";
import { GetUsuarioDataDTO } from "../dtos/getUsuarioData.dto";
import { GetUsuarioService } from "../services/getUsuario.service";
import { PutUsuarioDataDTO } from "../dtos/putUsuarioData.dto";
import { PutUsuarioService } from "../services/putUsuario.service";
import { DeleteUsuarioService } from "../services/deleteUsuario.service";
import { PostCustomerAsaasService } from "../services/postCustomerAsaas.service";
import { Public } from "src/common/decorators/public.decorator";

@Controller("usuario")
@UseGuards(JwtAuthGuard)
export class UsuarioController {
  constructor(
    private readonly postUsuarioService: PostUsuarioService,
    private readonly getUsuarioService: GetUsuarioService,
    private readonly putUsuarioService: PutUsuarioService,
    private readonly deleteUsuarioService: DeleteUsuarioService,
    private readonly postCustomerAsaasService: PostCustomerAsaasService
  ) {}

  @Post("/register")
  @Public()
  async register(@Body() data: PostUsuarioDataDTO) {
    return await this.postUsuarioService.execute(data, null);
  }

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
  async getUsuario(@Query() data: GetUsuarioDataDTO) {
    return await this.getUsuarioService.execute(data);
  }

  @Put("/update/:id")
  @Roles(Role.ALUNO, Role.ADM)
  async putUsuario(
    @Param("id") id_usuario: number,
    @Body() data: PutUsuarioDataDTO,
    @User() user: TokenPayload
  ) {
    return await this.putUsuarioService.execute(data, user, id_usuario);
  }

  @Delete("/delete/:id")
  @Roles(Role.ADM, Role.ALUNO)
  async deleteUsuario(
    @Param("id") id_usuario: number,
    @User() user: TokenPayload
  ) {
    return await this.deleteUsuarioService.execute(user, id_usuario);
  }

  @Post("/:id/customer-asaas")
  @Roles(Role.ALUNO, Role.PROFESSOR, Role.ADM)
  async createCustomerAsaas(
    @Param("id") id_usuario: number,
    @User() user: TokenPayload
  ) {
    const idParam = Number(id_usuario);
    const idUser = Number(user.id_usuario);

    if (idUser !== idParam) {
      throw new ForbiddenException("Você só pode criar customer para si mesmo");
    }
    return await this.postCustomerAsaasService.execute(idParam);
  }
}
