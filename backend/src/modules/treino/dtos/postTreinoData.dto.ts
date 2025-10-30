import { IsNotEmpty, IsString, IsOptional, IsArray, ValidateNested, MinLength,IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { ExercicioTreinoDTO } from "./exercicioTreinoData.dto";



export class PostTreinoDataDTO {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsNotEmpty()
  id_professor: number;

  @IsNumber()
  @IsNotEmpty()
  preco: number;

  @IsNotEmpty()
  @IsArray()
  @MinLength(3, { message: "Um treino deve ter pelo menos 3 exercícios" })
  @ValidateNested({ each: true })
  @Type(() => ExercicioTreinoDTO)
  exercicios: ExercicioTreinoDTO[];
}
