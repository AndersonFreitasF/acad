import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginationDTO {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  size: number = 10;
}
