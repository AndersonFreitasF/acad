import { Body, Controller, Post } from "@nestjs/common";
import { PostPagamentoService } from "../services/postPagamento.service";
import { CreateCostumerAsaasDTO } from "../dtos/CreateCostumerAsaasData.dto";

@Controller("pagamento")
export class PagamentoController {
  constructor(private readonly postPagamentoService: PostPagamentoService) {}
  @Post("cliente")
  async postCliente(@Body() data: CreateCostumerAsaasDTO) {
    return await this.postPagamentoService.postCostumer(data);
  }
}
