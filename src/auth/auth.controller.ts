import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { Tokens } from './types';
import { loginDto } from './dto/auth.dto';
import { AtGuard, RtGuard } from './common/guards';
import { GetCurrentUser, Public } from './common/decorators';
import { GetCurrentUserId } from './common/decorators/get-current-user-id.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<Tokens> {
    return this.authService.signupLocal(createUserDto);
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body(ValidationPipe) LoginData: loginDto): Promise<Tokens> {
    return this.authService.signinLocal(LoginData);
  }

  @UseGuards(AtGuard)
  @Post('local/signout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number): Promise<void> {
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refresh(userId, refreshToken);
  }

  // @UseGuards(RtGuard)
  // @Post('refresh')
  // @HttpCode(HttpStatus.OK)
  // refresh(
  //   @GetCurrentUserId() userId: number,
  //   @GetCurrentUser('refreshToken') refreshToken: string,
  // ): Promise<Tokens> {
  //   return this.authService.refresh(userId, refreshToken);
  // }

  // @UseGuards(AuthGuard('jwt-rt'))
  // @Post('refresh')
  // @HttpCode(HttpStatus.OK)
  // refresh(@Req() req: Request): Promise<Tokens> {
  //   const user = req.user;
  //   return this.authService.refresh(user['sub'], user['email']);
  // }
}
