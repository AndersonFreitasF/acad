import { api } from "../lib/api";

export interface CreatePaymentData {
  customerId: string;
  value: number;
  billingType: "BOLETO" | "PIX" | "CREDIT_CARD";
  description?: string;
  id_usuario: number;
}

export interface CreditCardDTO {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface CreditCardHolderInfoDTO {
  name: string;
  email: string;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  phone: string;
}

export interface PurchaseTrainingData {
  treinoId: number;
  metodo: "PIX" | "CREDIT_CARD";
  card?: CreditCardDTO;
  holderInfo?: CreditCardHolderInfoDTO;
}

export const paymentService = {
  createPayment: async (paymentData: CreatePaymentData) => {
    const { data } = await api.post("/pagamento/gerar-pagamento", paymentData);
    return data;
  },

  checkStatus: async (id: number) => {
    const { data } = await api.get(`/pagamento/${id}/status`);
    return data;
  },

  purchaseTraining: async (purchaseData: PurchaseTrainingData) => {
    const { data } = await api.post("/pagamento/compra", purchaseData);
    return data;
  },
};
