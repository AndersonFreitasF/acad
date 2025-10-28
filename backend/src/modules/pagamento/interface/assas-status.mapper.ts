import { InternalPaymentStatus } from "./asaas.interface";

export function mapAsaasStatus(status: string): InternalPaymentStatus {
  switch (status) {
    case "RECEIVED":
    case "CONFIRMED":
    case "RECEIVED_IN_CASH":
      return InternalPaymentStatus.PAID;

    case "CANCELLED":
    case "REFUNDED":
      return InternalPaymentStatus.CANCELED;

    case "OVERDUE":
    case "NOT_AUTHORIZED":
    case "DENIED":
    case "FAILED":
    case "AWAITING_RISK_ANALYSIS":
      return InternalPaymentStatus.FAILED;

    case "PENDING":
    default:
      return InternalPaymentStatus.PENDING;
  }
}
