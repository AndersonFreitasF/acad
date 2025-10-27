import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  PagamentoRepositoryPort,
  PagamentoRepositoryPortToken,
} from "../application/ports/pagamento-repository.port";
import { PostPagarDataDTO } from "../dtos/postPagarData.dto";

@Injectable()
export class PostPagarCreditCardService {
  constructor(
    @Inject(PagamentoRepositoryPortToken)
    private readonly pagamentoRepository: PagamentoRepositoryPort
  ) {}

  async execute(data: PostPagarDataDTO) {
    try {
      const paymentResult = await this.pagamentoRepository.payPayment(data);

      return {
        success: true,
        message: "Pagamento processado com sucesso",
        payment: paymentResult,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException("Pagamento não encontrado");
      }
      throw error;
    }
  }
}
