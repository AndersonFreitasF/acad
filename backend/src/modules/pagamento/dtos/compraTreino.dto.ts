import { IsIn, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreditCardDTO, CreditCardHolderInfoDTO } from "./postPagarData.dto";

export class CompraTreinoRequestDto {
  @IsNotEmpty()
  @IsNumber()
  treinoId: number;

  @IsNotEmpty()
  @IsIn(["PIX", "CREDIT_CARD"]) 
  metodo: "PIX" | "CREDIT_CARD";

  @IsOptional()
  @ValidateNested()
  @Type(() => CreditCardDTO)
  card?: CreditCardDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreditCardHolderInfoDTO)
  holderInfo?: CreditCardHolderInfoDTO;
}

export class CompraTreinoPixResponseDto {
  paymentId: string;
  qrCodeImage: string;
  copyPaste: string;
  expirationDate?: string;
}

export class CompraTreinoCardResponseDto {
  paymentId: string;
  status: string;
}


