import { IsString, IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  variantId: string;

  @IsInt() @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  addressId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
