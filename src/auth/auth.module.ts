import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AtStrategy, RfStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, JwtModule.register({})], //since we have two tokes signing secrete will happen in the services
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RfStrategy],
})
export class AuthModule {}
