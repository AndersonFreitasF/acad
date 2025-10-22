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

