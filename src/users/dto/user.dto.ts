import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEnum(Role, {
    message: 'Invalid role. Must be one of: INTERN, ENGINEER, ADMIN',
  })
  role: Role;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
