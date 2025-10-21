import { Body, Controller, Post } from "@nestjs/common";
import { PostCostumerAsaasService } from "../services/postCostumerAsaas.service";

import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";
import { User } from "src/common/decorators/user.decorator";

@Controller("pagamento")
export class PagamentoController {
  constructor(
    private readonly postCostumerAsaasService: PostCostumerAsaasService
  ) {}
  @Post("cliente")
  async postCliente(@User() user: TokenPayload) {
    return await this.postCostumerAsaasService.postCostumer(user.id_usuario);
  }
}
