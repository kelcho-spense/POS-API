import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/user.dto';
import { DatabaseService } from 'src/database/database.service';
import { UserRole, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(role?: UserRole, limit?: number): Promise<User[]> {
    const where = role ? { role } : {};
    const take = limit ? limit : undefined;

    return this.databaseService.user.findMany({
      where,
      ...(take ? { take } : {}),
    });
  }

  async findOne(userId: number): Promise<User> {
    const user = this.databaseService.user.findFirst({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(userId: number, updateUserData: UpdateUserDto): Promise<User> {
    return this.databaseService.user.update({
      where: { userId },
      data: updateUserData,
    });
  }

  async delete(userId: number): Promise<User> {
    return this.databaseService.user.delete({
      where: { userId },
    });
  }
}
