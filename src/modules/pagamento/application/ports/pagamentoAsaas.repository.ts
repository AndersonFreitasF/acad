import { CreateCostumerAsaasDTO } from "../../dtos/CreateCostumerAsaasData.dto";

export const PagamentoRepositoryPortToken = "PagamentoRepositoryPort" as const;
export interface PagamentoRepositoryPort {
  postCustomer(data: CreateCostumerAsaasDTO): Promise<any>;
  getDadosUsuario(
    id_usuario: number
  ): Promise<{ name: string; CpfCnpj: string; email: string }>;
}
