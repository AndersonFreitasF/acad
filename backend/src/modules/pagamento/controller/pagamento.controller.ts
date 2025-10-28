import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { TokenPayload } from "src/modules/auth/interfaces/auth.interface";
import { User } from "src/common/decorators/user.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/role.decorator";
import { Role } from "src/common/enum/role.enum";

import { PostCustomerAsaasService } from "../services/postCustomerAsaas.service";
import { PostPagamentoAsaasService } from "../services/postPagamentoAsaas.service";
import { PostPagarCreditCardService } from "../services/postPagarCreditCard.service";
import { PostPagarPixService } from "../services/postPagarPix.service";

import { PostPagamentoAsaasDataDTO } from "../dtos/postPagamentoAsaasData.dto";
import { PostPagarDataDTO } from "../dtos/postPagarData.dto";
import { PostPagarPixDataDTO } from "../dtos/postPagarPixData.dto";
import { PostPagamentoWebhookService } from "../services/postPagamentoWebhook.service";
import { AsaasWebhookDTO } from "../dtos/asaasWebhook.dto";

@Controller("pagamento")
@UseGuards(JwtAuthGuard)
export class PagamentoController {
  constructor(
    private readonly postCustomerAsaasService: PostCustomerAsaasService,
    private readonly postPagamentoAsaasService: PostPagamentoAsaasService,
    private readonly postPagarCreditCardService: PostPagarCreditCardService,
    private readonly postPagarPixService: PostPagarPixService,
    private readonly postPagamentoWebhookService: PostPagamentoWebhookService
  ) {}

  @Post("cliente")
  @Roles(Role.ALUNO, Role.PROFESSOR, Role.ADM)
  async postCliente(@User() user: TokenPayload) {
    return this.postCustomerAsaasService.execute(user.id_usuario);
  }

  @Post("gerar-credito")
  @Roles(Role.ALUNO, Role.PROFESSOR, Role.ADM)
  async gerarPagamentoCredito(
    @User() user: TokenPayload,
    @Body() data: PostPagamentoAsaasDataDTO
  ) {
    return this.postPagamentoAsaasService.execute(user.id_usuario, data);
  }

  @Post("pagar-credito")
  @Roles(Role.ALUNO, Role.PROFESSOR, Role.ADM)
  async pagarPagamentoCredito(@Body() data: PostPagarDataDTO) {
    return this.postPagarCreditCardService.execute(data);
  }

  @Post("pagar-pix")
  @Roles(Role.ALUNO, Role.PROFESSOR, Role.ADM)
  async pagarPagamentoPix(@Body() data: PostPagarPixDataDTO) {
    return this.postPagarPixService.execute(data);
  }

  @Post("webhook")
  async webhook(@Body() data: AsaasWebhookDTO) {
    return this.postPagamentoWebhookService.execute(data);
  }
}
