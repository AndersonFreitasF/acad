import { IsNotEmpty, IsString } from "class-validator";

export class PostExercicioDataDTO {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;
}
