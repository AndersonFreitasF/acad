import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from "class-validator";

export class PostCustomerAsaasDataDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(11, 14)
  cpfCnpj: string;
}

