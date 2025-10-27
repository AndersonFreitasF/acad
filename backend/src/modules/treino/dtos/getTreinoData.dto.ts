import { IsOptional, IsString } from "class-validator";
import { PaginationDTO } from "src/common/pagination/pagination.dto";

export class GetTreinoDataDTO extends PaginationDTO {
  @IsString()
  @IsOptional()
  titulo?: string;
}

