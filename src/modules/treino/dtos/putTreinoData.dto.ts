import { IsOptional, IsString, IsBoolean, IsArray, ValidateNested, MinLength } from "class-validator";
import { Type } from "class-transformer";
import { ExercicioTreinoDTO } from "./postTreinoData.dto";

export class PutTreinoDataDTO {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsOptional()
  @IsBoolean()
  publico?: boolean;

  @IsOptional()
  @IsArray()
  @MinLength(3, { message: "Um treino deve ter pelo menos 3 exercícios" })
  @ValidateNested({ each: true })
  @Type(() => ExercicioTreinoDTO)
  exercicios?: ExercicioTreinoDTO[];
}

