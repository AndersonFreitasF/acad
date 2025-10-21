import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateCostumerAsaasDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(11, 14)
  cpfCnpj: string;

  @IsOptional()
  @IsString()
  phone?: string;
}