import { Body, Controller, Get, Headers, Param, Post, Req, UseGuards } from "@nestjs/common";
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
import { CompraTreinoRequestDto } from "../dtos/compraTreino.dto";
import { CompraTreinoService } from "../services/compraTreino.service";

@Controller("pagamento")
@UseGuards(JwtAuthGuard)
export class PagamentoController {
  constructor(
    private readonly postPagamentoAsaasService: PostPagamentoAsaasService,
    private readonly postPagamentoWebhookService: PostPagamentoWebhookService,
    private readonly checkPagamentoService: CheckPagamentoService,
    private readonly compraTreinoService: CompraTreinoService
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
  async webhook(@Req() req: any, @Body() data: AsaasWebhookDTO, @Headers("x-signature") signature?: string) {
    const rawBody = req.rawBody || JSON.stringify(data);
    return this.postPagamentoWebhookService.execute(data, rawBody, signature);
  }

  @Get(":id/status")
  async checkStatus(@Param("id") id: number) {
    return this.checkPagamentoService.execute(id);
  }

  @Post("compra")
  @Roles(Role.ALUNO, Role.PROFESSOR, Role.ADM)
  async comprarTreino(
    @User() user: TokenPayload,
    @Body() body: CompraTreinoRequestDto
  ) {
    return this.compraTreinoService.comprar(user.id_usuario, body);
  }
}
