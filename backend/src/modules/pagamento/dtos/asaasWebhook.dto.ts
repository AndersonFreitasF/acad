export class AsaasWebhookDTO {
  event: string;
  payment: {
    id: string;
    status: string;
  };
}
