import { IsNotEmpty, IsNumber } from "class-validator";

export class PostPagarPixDataDTO {
  @IsNotEmpty()
  @IsNumber()
  id_pagamento: number;
}

