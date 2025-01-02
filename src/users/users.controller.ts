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
import { UserRole, User } from '@prisma/client';
import { ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // GET /users or GET /users?limit=10&role=admin
  @ApiQuery({ name: 'role', enum: UserRole, required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('role', new ParseEnumPipe(UserRole, { optional: true }))
    role?: UserRole,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<User[]> {
    return this.usersService.findAll(role, limit);
  }

  @Get(':id') // GET /users/:id
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> | string {
    return this.usersService.findOne(id);
  }

  @Patch(':id') // PATCH /users/:id
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id') // DELETE /users/:id
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.delete(id);
  }
}
