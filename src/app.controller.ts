import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/common/decorators';
import { AppService } from './app.service';

@Public()
@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  async healthTest(): Promise<string> {
    // return 'API Server is running🤖';
    return this.appService.getHello();
  }
}
