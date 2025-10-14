import { IsOptional, IsString } from "class-validator";

export class PutProfessorDataDTO {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  senha?: string;
}
