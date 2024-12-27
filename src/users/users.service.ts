import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Role, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(role?: Role, limit?: number): Promise<User[]> {
    const where = role ? { role } : {};
    const take = limit ? limit : undefined;

    return this.databaseService.user.findMany({
      where,
      ...(take ? { take } : {}),
    });
  }

  async findOne(id: number): Promise<User> {
    const user = this.databaseService.user.findFirst({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, updateUserData: UpdateUserDto): Promise<User> {
    return this.databaseService.user.update({
      where: { id },
      data: updateUserData,
    });
  }

  async delete(id: number): Promise<User> {
    return this.databaseService.user.delete({
      where: { id },
      include: { lists: true },
    });
  }
}
