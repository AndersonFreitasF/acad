import { PostCustomerAsaasDataDTO } from "../../dtos/postCustomerAsaasData.dto";
import { PostPagamentoAsaasDataDTO } from "../../dtos/postPagamentoAsaasData.dto";
import { PostPagarDataDTO } from "../../dtos/postPagarData.dto";
import {
  AsaasCustomerResponse,
  AsaasCustomerData,
  AsaasPaymentResponse,
  AsaasPixQrCodeResponse,
  InternalPaymentStatus,
} from "../../interface/asaas.interface";

export const PagamentoRepositoryPortToken = "PagamentoRepositoryPort" as const;

export interface PagamentoRepositoryPort {
  postCustomer(data: PostCustomerAsaasDataDTO): Promise<AsaasCustomerResponse>;
  getDadosUsuario(id_usuario: number): Promise<AsaasCustomerData | null>;
  vincularCustomerId(id_usuario: number, customerId: string): Promise<void>;
  postPagamento(data: PostPagamentoAsaasDataDTO): Promise<AsaasPaymentResponse>;
  savePagamento(
    id_usuario: number,
    id_pagamento: string,
    valor: number,
    tipo: string,
    status: InternalPaymentStatus
  ): Promise<void>;
  payPayment(data: PostPagarDataDTO): Promise<AsaasPaymentResponse>;
  getPagamentoById(id_pagamento: number): Promise<{
    id_pagamento_asaas: string;
    status: InternalPaymentStatus;
  } | null>;
  updatePagamentoStatus(
    id_pagamento: number,
    status: InternalPaymentStatus
  ): Promise<void>;
  getPixQrCode(id_pagamento_asaas: string): Promise<AsaasPixQrCodeResponse>;
}
