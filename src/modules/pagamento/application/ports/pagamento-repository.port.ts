import { PostCustomerAsaasDataDTO } from "../../dtos/postCustomerAsaasData.dto";
import { AsaasCustomerResponse, AsaasCustomerData } from "../../interface/asaas.interface";

export const PagamentoRepositoryPortToken = "PagamentoRepositoryPort" as const;

export interface PagamentoRepositoryPort {
  postCustomer(data: PostCustomerAsaasDataDTO): Promise<AsaasCustomerResponse>;
  getDadosUsuario(id_usuario: number): Promise<AsaasCustomerData | null>;
}

