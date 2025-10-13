import { IsOptional, IsString } from "class-validator";

export class PutUsuarioDataDTO {
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
