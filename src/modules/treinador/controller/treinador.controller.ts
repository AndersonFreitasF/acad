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
import { GetTreinadorDataDTO } from "../dtos/getTreinadorData.dto";
import { GetTreinadorService } from "../services/getTreinador.service";
import { NEVER } from "rxjs";

@Controller("treinador")
@UseGuards(JwtAuthGuard)
export class TreinadorController {
  constructor(private readonly getTreinadorService: GetTreinadorService) {}

  @Get("")
  @Roles(Role.ADM)
  async getTreinador(@Query() data: GetTreinadorDataDTO) {
    return await this.getTreinadorService.execute(data);
  }
}
