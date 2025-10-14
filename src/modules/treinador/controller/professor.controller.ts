import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Injectable,
  Query,
} from "@nestjs/common";
import { Roles } from "src/common/decorators/role.decorator";
import { User } from "src/common/decorators/user.decorator";
import { Role } from "src/common/enum/role.enum";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";
import { GetProfessorDataDTO } from "../dtos/getProfessorData.dto";
import { GetProfessorService } from "../services/getProfessor.service";
import { PostProfessorService } from "../services/postProfessor.service";
import { PostProfessorDataDTO } from "../dtos/postProfessorData.dto";

@Controller("professor")
@UseGuards(JwtAuthGuard)
export class ProfessorController {
  constructor(
    private readonly getProfessorService: GetProfessorService,
    private readonly postProfessorService: PostProfessorService
  ) {}

  @Get("")
  @Roles(Role.ADM)
  async getProfessor(@Query() data: GetProfessorDataDTO) {
    return await this.getProfessorService.execute(data);
  }

  @Post("/")
  @Roles(Role.ADM)
  async postUsuario(
    @Body() data: PostProfessorDataDTO,
    @User() user: TokenPayload
  ) {
    return await this.postProfessorService.execute(data, user.id_usuario);
  }
}
