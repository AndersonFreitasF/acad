import { IsOptional, IsString } from "class-validator";
import { PaginationDTO } from "src/common/pagination/pagination.dto";

export class GetUsuarioDataDTO extends PaginationDTO {
  @IsString()
  @IsOptional()
  nome?: string;
}
