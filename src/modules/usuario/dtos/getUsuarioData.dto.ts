import { IsOptional, IsString } from "class-validator";
import { PaginationDTO } from "src/common/pagination/pagination.dto";

export class GetUsuarioInputDto extends PaginationDTO {
  @IsString()
  @IsOptional()
  nome?: string;
}
