import { PostCustomerAsaasDataDTO } from "../../dtos/postCustomerAsaasData.dto";
import { PostPagamentoAsaasDataDTO } from "../../dtos/postPagamentoAsaasData.dto";
import {
  AsaasCustomerResponse,
  AsaasCustomerData,
  AsaasPaymentResponse,
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
    status: string
  ): Promise<void>;
}
