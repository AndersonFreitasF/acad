import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Length,
  Matches,
} from "class-validator";

export class CreditCardDTO {
  @IsNotEmpty()
  @IsString()
  holderName: string;

  @IsNotEmpty()
  @IsString()
  @Length(13, 19)
  number: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])$/)
  expiryMonth: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(20[2-9][0-9])$/)
  expiryYear: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 4)
  ccv: string;
}

export class CreditCardHolderInfoDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  cpfCnpj: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  addressNumber?: string;

  @IsOptional()
  @IsString()
  addressComplement?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  mobilePhone?: string;
}

export class PostPagarDataDTO {
  @IsNotEmpty()
  @IsNumber()
  id_pagamento: number;

  @IsNotEmpty()
  creditCard: CreditCardDTO;

  @IsNotEmpty()
  creditCardHolderInfo: CreditCardHolderInfoDTO;

  @IsOptional()
  @IsString()
  remoteIp?: string;
}

