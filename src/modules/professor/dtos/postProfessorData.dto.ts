import { IsNotEmpty, IsString } from "class-validator";

export class PostProfessorDataDTO {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  senha: string;
}
