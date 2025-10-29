import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

export class PostPagamentoAsaasDataDTO {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsString()
  billingType: "BOLETO" | "PIX" | "CREDIT_CARD";
  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  id_usuario: number;
}
