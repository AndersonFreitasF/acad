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
import { GetProfessorDataDTO } from "../dtos/getProfessorData.dto";
import { GetProfessorService } from "../services/getProfessor.service";
import { PostProfessorService } from "../services/postProfessor.service";
import { PostProfessorDataDTO } from "../dtos/postProfessorData.dto";
import { PutProfessorDataDTO } from "../dtos/putProfessorData.dto";
import { PutProfessorService } from "../services/putProfessor.service";
import { DeleteProfessorService } from "../services/deleteProfessor.service";

@Controller("professor")
@UseGuards(JwtAuthGuard)
export class ProfessorController {
  constructor(
    private readonly getProfessorService: GetProfessorService,
    private readonly postProfessorService: PostProfessorService,
    private readonly putProfessorService: PutProfessorService,
    private readonly deleteProfessorService: DeleteProfessorService
  ) {}

  @Get("")
  @Roles(Role.ADM)
  async getProfessor(@Query() data: GetProfessorDataDTO) {
    return await this.getProfessorService.execute(data);
  }

  @Post("/")
  @Roles(Role.ADM)
  async postProfessor(
    @Body() data: PostProfessorDataDTO,
    @User() user: TokenPayload
  ) {
    return await this.postProfessorService.execute(data, user.id_usuario);
  }

  @Put("/update/:id")
  @Roles(Role.ADM, Role.PROFESSOR)
  async putProfessor(
    @Body() data: PutProfessorDataDTO,
    @User() user: TokenPayload,
    @Param("id") id_usuario: number
  ) {
    return await this.putProfessorService.execute(data, user, id_usuario);
  }

  @Delete("/delete/:id")
  @Roles(Role.ADM)
  async deleteProfessor(
    @Param("id") id_usuario: number,
    @User() user: TokenPayload
  ) {
    return await this.deleteProfessorService.execute(user, id_usuario);
  }
}
