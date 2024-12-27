import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  ParseIntPipe,
  ValidationPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { Role, User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // GET /users or GET /users?limit=10&role=admin
  findAll(
    @Query('role', new ParseEnumPipe(Role, { optional: true })) role?: Role,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<User[]> {
    return this.usersService.findAll(role, limit);
  }

  @Get(':id') // GET /users/:id
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> | string {
    return this.usersService.findOne(id);
  }

  @Patch(':id') // PATCH /users/:id
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id') // DELETE /users/:id
  remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.delete(id);
  }
}
