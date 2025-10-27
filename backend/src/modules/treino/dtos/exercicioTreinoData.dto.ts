import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ExercicioTreinoDTO {
    @IsNotEmpty()
    id_exercicio: number;
  
    @IsOptional()
    @IsString()
    series_repeticoes?: string;
  
    @IsOptional()
    @IsString()
    carga?: string;
  
    @IsOptional()
    @IsString()
    observacoes?: string;
  }