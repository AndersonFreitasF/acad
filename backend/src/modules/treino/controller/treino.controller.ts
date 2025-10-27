import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Query,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { Roles } from "src/common/decorators/role.decorator";
import { User } from "src/common/decorators/user.decorator";
import { Role } from "src/common/enum/role.enum";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";
import { GetTreinoDataDTO } from "../dtos/getTreinoData.dto";
import { GetTreinoService } from "../services/getTreino.service";
import { PostTreinoService } from "../services/postTreino.service";
import { PostTreinoDataDTO } from "../dtos/postTreinoData.dto";
import { PutTreinoDataDTO } from "../dtos/putTreinoData.dto";
import { PutTreinoService } from "../services/putTreino.service";
import { DeleteTreinoService } from "../services/deleteTreino.service";

@Controller("treino")
@UseGuards(JwtAuthGuard)
export class TreinoController {
  constructor(
    private readonly getTreinoService: GetTreinoService,
    private readonly postTreinoService: PostTreinoService,
    private readonly putTreinoService: PutTreinoService,
    private readonly deleteTreinoService: DeleteTreinoService
  ) {}

  @Get("")
  @Roles(Role.PROFESSOR)
  async getTreino(@Query() data: GetTreinoDataDTO) {
    return await this.getTreinoService.execute(data);
  }

  @Post("/")
  @Roles(Role.PROFESSOR)
  async postTreino(
    @Body() data: PostTreinoDataDTO,
    @User() user: TokenPayload
  ) {
    return await this.postTreinoService.execute(data, user.id_usuario);
  }

  @Put("/update/:id")
  @Roles(Role.PROFESSOR)
  async putTreino(
    @Body() data: PutTreinoDataDTO,
    @User() user: TokenPayload,
    @Param("id") id_treino: number
  ) {
    return await this.putTreinoService.execute(data, user, id_treino);
  }

  @Delete("/delete/:id")
  @Roles(Role.PROFESSOR)
  async deleteTreino(
    @Param("id") id_treino: number,
    @User() user: TokenPayload
  ) {
    return await this.deleteTreinoService.execute(user, id_treino);
  }
}

