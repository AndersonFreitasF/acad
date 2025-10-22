import { Controller, Post, UseGuards } from "@nestjs/common";
import { PostCustomerAsaasService } from "../services/postCustomerAsaas.service";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";
import { User } from "src/common/decorators/user.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enum/role.enum";

@Controller("pagamento")
@UseGuards(JwtAuthGuard)
export class PagamentoController {
  constructor(
    private readonly postCustomerAsaasService: PostCustomerAsaasService
  ) {}

  @Post("cliente")
  @Roles(Role.ADM)
  async postCliente(@User() user: TokenPayload) {
    return await this.postCustomerAsaasService.execute(user.id_usuario);
  }
}
