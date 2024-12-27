import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

describe('UsersService Integration Tests', () => {
  let prisma: DatabaseService;
  let usersService: UsersService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(DatabaseService);
    usersService = moduleRef.get(UsersService);

    authService = moduleRef.get(AuthService);
  });

  beforeEach(async () => {
    await prisma.cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const user = await authService.signupLocal({
        email: 'test@example.com',
        username: 'John',
        password: 'securePass123',
        role: 'INTERN',
      });

      expect(user).toBeDefined();
      expect(user.access_token).toBeDefined();
      expect(user.refresh_token).toBeDefined();
    });

    // it('should throw ConflictException for duplicate email', async () => {
    //   await authService.signupLocal({
    //     email: 'test@example.com',
    //     username: 'John',
    //     password: 'securePass123',
    //     role: 'INTERN',
    //   });

    //   await expect(
    //     authService.signupLocal({
    //       email: 'test@example.com',
    //       username: 'John',
    //       password: 'securePass123',
    //       role: 'INTERN',
    //     }),
    //   ).rejects.toThrow(ConflictException);
    // });
  });

  // describe('findUser', () => {
  //   it('should find user by id', async () => {
  //     const created = await authService.signupLocal({
  //       email: 'test@example.com',
  //       username: 'John',
  //       password: 'securePass123',
  //       role: 'INTERN',
  //     });

  //     const payload = authService.decodeToken(created.access_token);
  //     const found = await usersService.findOne(payload.sub);
  //     expect(found.email).toBe(created.email);
  //   });
  // });

  // it('should throw NotFoundException for non-existent user', async () => {
  //   await expect(
  //     usersService.findOne('non-existent-id')
  //   ).rejects.toThrow(NotFoundException);
  // });
  // });

  // describe('updateUser', () => {
  //   it('should update user details', async () => {
  //     const user = await usersService.createUser({
  //       email: 'test@example.com',
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       password: 'securePass123'
  //     });

  //     const updated = await usersService.updateUser(user.id, {
  //       firstName: 'Jane',
  //       lastName: 'Smith'
  //     });

  //     expect(updated.firstName).toBe('Jane');
  //     expect(updated.lastName).toBe('Smith');
  //     expect(updated.email).toBe(user.email);
  //   });
  // });

  // describe('deleteUser', () => {
  //   it('should delete user successfully', async () => {
  //     const user = await usersService.createUser({
  //       email: 'test@example.com',
  //       firstName: 'John',
  //       lastName: 'Doe',
  //       password: 'securePass123'
  //     });

  //     await usersService.deleteUser(user.id);

  //     await expect(
  //       usersService.findUserById(user.id)
  //     ).rejects.toThrow(NotFoundException);
  //   });
  // });
});
