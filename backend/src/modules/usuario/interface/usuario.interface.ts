export interface IUsuario {
  id_usuario: number;

  nome_usuario: string;

  cpf: string;

  email: string;

  senha: string;

  tipo: string;

  perfilAtivo: boolean;
}

export interface AsaasCustomerResponse {
  id: string;
  name: string;
  email: string;
  cpfCnpj: string;
  dateCreated: string;
  personType?: string;
  deleted?: boolean;
  additionalEmails?: string;
  externalReference?: string;
  notificationDisabled?: boolean;
  observations?: string;
}

export interface AsaasCustomerData {
  name: string;
  email: string;
  cpfCnpj: string;
}
