import { Injectable } from "@nestjs/common";
import { IsOptional, IsString } from "class-validator";
import { PaginationDTO } from "src/common/pagination/pagination.dto";
@Injectable()
export class GetTreinadorDataDTO extends PaginationDTO {
  @IsString()
  @IsOptional()
  nome?: string;
}
