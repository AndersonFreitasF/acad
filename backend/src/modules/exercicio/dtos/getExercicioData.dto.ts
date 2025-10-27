import { IsOptional, IsString } from "class-validator";
import { PaginationDTO } from "src/common/pagination/pagination.dto";

export class GetExercicioDataDTO extends PaginationDTO {
  @IsString()
  @IsOptional()
  nome?: string;
}
