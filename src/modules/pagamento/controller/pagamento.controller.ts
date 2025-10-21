import { Body, Controller, Post } from "@nestjs/common";
import { PostCostumerAsaasService } from "../services/postCostumerAsaas.service";
import { CreateCostumerAsaasDTO } from "../dtos/CreateCostumerAsaasData.dto";

@Controller("pagamento")
export class PagamentoController {
  constructor(
    private readonly postCostumerAsaasService: PostCostumerAsaasService
  ) {}
  @Post("cliente")
  async postCliente(@Body() data: CreateCostumerAsaasDTO) {
    return await this.postCostumerAsaasService.postCostumer(data);
  }
}
