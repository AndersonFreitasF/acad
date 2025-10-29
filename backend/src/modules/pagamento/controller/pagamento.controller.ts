import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";
import { User } from "src/common/decorators/user.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enum/role.enum";

import { PostPagamentoAsaasService } from "../services/postPagamentoAsaas.service";

import { PostPagamentoAsaasDataDTO } from "../dtos/postPagamentoAsaasData.dto";

import { PostPagamentoWebhookService } from "../services/postPagamentoWebhook.service";
import { AsaasWebhookDTO } from "../dtos/asaasWebhook.dto";
import { CheckPagamentoService } from "../services/getPagamentoStatus.service";

@Controller("pagamento")
@UseGuards(JwtAuthGuard)
export class PagamentoController {
  constructor(
    private readonly postPagamentoAsaasService: PostPagamentoAsaasService,
    private readonly postPagamentoWebhookService: PostPagamentoWebhookService,
    private readonly checkPagamentoService: CheckPagamentoService
  ) {}

  @Post("gerar-pagamento")
  @Roles(Role.ALUNO, Role.PROFESSOR, Role.ADM)
  async gerarPagamentoCredito(
    @User() user: TokenPayload,
    @Body() data: PostPagamentoAsaasDataDTO
  ) {
    return this.postPagamentoAsaasService.execute(user.id_usuario, data);
  }

  @Post("webhook")
  async webhook(@Body() data: AsaasWebhookDTO) {
    return this.postPagamentoWebhookService.execute(data);
  }

  @Get(":id/status")
  async checkStatus(@Param("id") id: number) {
    return this.checkPagamentoService.execute(id);
  }
}
