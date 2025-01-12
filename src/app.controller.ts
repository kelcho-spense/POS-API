import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Public } from './auth/common/decorators';
import { AppService } from './app.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Public()
@Controller('health')
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  async healthTest(): Promise<string> {
    // return 'API Server is running🤖';
    return this.appService.getHello();
  }
}
