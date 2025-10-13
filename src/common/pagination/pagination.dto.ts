import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class PaginationDTO {
  @Type(() => Number)
  @IsNumber()
  page: number;

  @Type(() => Number)
  @IsNumber()
  size: number;
}
