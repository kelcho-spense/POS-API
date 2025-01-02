import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from 'src/users/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import { loginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private jwtService: JwtService,
  ) {}
  //helper methods
  private async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(data, salt);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: 60 * 15, //15 minutes
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: 60 * 60 * 24 * 7, // 7 days
        },
      ),
    ]);
    return { access_token: at, refresh_token: rt };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.databaseService.user.update({
      where: { userId },
      data: {
        refresh_token_hash: hashedRefreshToken,
      },
    });
  }

  async decodeToken(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  // main methods
  async signupLocal(createUserData: CreateUserDto): Promise<Tokens> {
    try {
      // Check if user already exists
      const existingUser = await this.databaseService.user.findUnique({
        where: { email: createUserData.email },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password and create user
      const hashedPassword = await this.hashData(createUserData.password);
      // create a new user without a refresh token
      const newUser = await this.databaseService.user.create({
        data: {
          fullName: createUserData.fullName,
          username: createUserData.username,
          email: createUserData.email,
          passwordHash: hashedPassword,
          role: createUserData.role,
        },
      });

      // Generate tokens
      const tokens = await this.getTokens(newUser.userId, newUser.email);

      // save hashed refresh token
      await this.updateRefreshToken(newUser.userId, tokens.refresh_token);

      return tokens;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async signinLocal(AuthData: loginDto): Promise<Tokens> {
    //find the user via unique email
    const user = await this.databaseService.user.findUnique({
      where: { email: AuthData.email },
    });

    if (!user) throw new ForbiddenException('Invalid credentials');
    //compare passwords
    const passMatch = await bcrypt.compare(
      AuthData.password,
      user.passwordHash,
    );

    if (!passMatch) throw new UnauthorizedException('Invalid credentials');

    // Generate tokens
    const tokens = await this.getTokens(user.userId, user.email);

    // save hashed refresh token
    await this.updateRefreshToken(user.userId, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: number) {
    // get user via id & if hashedRT is not null then set it to null
    await this.databaseService.user.updateMany({
      where: {
        userId,
        refresh_token_hash: {
          not: null,
        },
      },
      data: {
        refresh_token_hash: null,
      },
    });
  }

  async refresh(userId: number, refreshToken: string) {
    //find the user via unique id
    const user = await this.databaseService.user.findUnique({
      where: { userId },
    });

    if (!user) throw new ForbiddenException('Access denied');

    //compare refresh token
    const refreshTokenMatch = await bcrypt.compare(
      refreshToken,
      user.refresh_token_hash,
    );

    if (!refreshTokenMatch)
      throw new UnauthorizedException('Invalid refresh token');

    // Generate tokens
    const tokens = await this.getTokens(user.userId, user.email);

    // save hashed refresh token
    await this.updateRefreshToken(user.userId, tokens.refresh_token);

    return tokens;
  }
}
