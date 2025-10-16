import { Controller, UseGuards, Post, Body } from "@nestjs/common";
import { Roles } from "src/common/decorators/role.decorator";
import { User } from "src/common/decorators/user.decorator";
import { Role } from "src/common/enum/role.enum";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface.";
import { PostExercicioDataDTO } from "../dtos/postExercicioData.dto";
import { PostExercicioService } from "../services/postExercicio.service";

@Controller("exercicio")
@UseGuards(JwtAuthGuard)
export class ProfessorController {
  constructor(
    //private readonly getProfessorService: GetProfessorService,
    private readonly postExercicioService: PostExercicioService
    //private readonly putProfessorService: PutProfessorService,
    //private readonly deleteProfessorService: DeleteProfessorService
  ) {}

  @Post("/")
  @Roles(Role.ADM)
  async postExercicio(
    @Body() data: PostExercicioDataDTO,
    @User() user: TokenPayload
  ) {
    return await this.postExercicioService.execute(data, user.id_usuario);
  }
}
