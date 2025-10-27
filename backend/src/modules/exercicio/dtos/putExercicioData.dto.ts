import { IsOptional, IsString } from "class-validator";

export class PutExercicioDataDTO {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  descricao?: string;
}
