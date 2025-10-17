import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Injectable,
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
import { GetExercicioDataDTO } from "../dtos/getExercicioData.dto";
import { GetExercicioService } from "../services/getExercicio.service";
import { PostExercicioService } from "../services/postExercicio.service";
import { PostExercicioDataDTO } from "../dtos/postExercicioData.dto";
import { PutExercicioDataDTO } from "../dtos/putExercicioData.dto";
import { PutExercicioService } from "../services/putExercicio.service";
import { DeleteExercicioService } from "../services/deleteExercicio.service";

@Controller("exercicio")
@UseGuards(JwtAuthGuard)
export class ExercicioController {
  constructor(
    private readonly getExercicioService: GetExercicioService,
    private readonly postExercicioService: PostExercicioService,
    private readonly putExercicioService: PutExercicioService,
    private readonly deleteExercicioService: DeleteExercicioService
  ) {}

  @Get("")
  @Roles(Role.PROFESSOR)
  async getExercicio(@Query() data: GetExercicioDataDTO) {
    return await this.getExercicioService.execute(data);
  }

  @Post("/")
  @Roles(Role.PROFESSOR)
  async postExercicio(
    @Body() data: PostExercicioDataDTO,
    @User() user: TokenPayload
  ) {
    return await this.postExercicioService.execute(data, user.id_usuario);
  }

  @Put("/update/:id")
  @Roles(Role.PROFESSOR)
  async putExercicio(
    @Body() data: PutExercicioDataDTO,
    @User() user: TokenPayload,
    @Param("id") id_exercicio: number
  ) {
    return await this.putExercicioService.execute(data, user, id_exercicio);
  }

  @Delete("/delete/:id")
  @Roles(Role.PROFESSOR)
  async deleteExercicio(
    @Param("id") id_exercicio: number,
    @User() user: TokenPayload
  ) {
    return await this.deleteExercicioService.execute(user, id_exercicio);
  }
}
