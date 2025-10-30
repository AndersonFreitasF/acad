import { IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationDTO } from "src/common/pagination/pagination.dto";

export class GetTreinoDataDTO extends PaginationDTO {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsNumber()
  @IsOptional()
  id_professor?: number;
}

