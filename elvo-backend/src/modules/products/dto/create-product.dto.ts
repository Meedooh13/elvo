import {
  IsString, IsInt, IsOptional, IsBoolean,
  IsArray, Min, MinLength,
  ValidateNested, IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @IsString()
  sku: string;

  @IsOptional() @IsString()
  size?: string;

  @IsOptional() @IsString()
  color?: string;

  @IsInt() @IsPositive()
  priceInCents: number;

  @IsInt() @Min(0)
  stock: number;
}

export class CreateProductDto {
  @IsString() @MinLength(2)
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsString()
  categoryId: string;

  @IsArray() @IsString({ each: true })
  images: string[];

  @IsOptional() @IsBoolean()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];
}
