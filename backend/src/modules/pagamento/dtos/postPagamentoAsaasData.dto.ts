import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

export class PostPagamentoAsaasDataDTO {
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsString()
  billingType: "BOLETO" | "PIX" | "CREDIT_CARD";
  @IsOptional()
  @IsString()
  description?: string;
}
