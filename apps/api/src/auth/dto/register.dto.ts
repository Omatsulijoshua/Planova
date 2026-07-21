import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRoleType } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  persona?: string;

  @IsEnum(UserRoleType, { message: 'Invalid user role' })
  @IsOptional()
  role?: UserRoleType;
}
