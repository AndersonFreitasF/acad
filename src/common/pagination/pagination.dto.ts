import { Type } from "class-transformer";
import { IsNumber, IsNotEmpty } from "class-validator";

export class PaginationDTO {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  page: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  size: number;
}
