import { Type } from "class-transformer";
export class PaginationDTO {
  @Type(() => Number)
  page: number;

  @Type(() => Number)
  size: number;

  @Type(() => Number)
  total: number;
}
