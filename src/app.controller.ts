import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/common/decorators';

@Public()
@Controller('health')
export class AppController {
  @Get()
  healthTest(): string {
    return 'API Server is running🤖';
  }
}
