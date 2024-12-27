import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AllExceptionsFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  // Register the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // versioning
  app.setGlobalPrefix('api/v1');
  // setting HTTP headers appropriately
  app.use(helmet());
  //cors
  //add CSRF
  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
