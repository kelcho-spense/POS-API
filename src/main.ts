import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AllExceptionsFilter } from './http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
  app.enableCors();
  //add CSRF

  //add swagger
  const config = new DocumentBuilder()
    .setTitle('Point of Sale API')
    .setDescription(
      'asdasdasdThe Point of Sale API The POS system is structured to manage various aspects of a retail operation, including:Company Management,User Management,Product ,Inventory Management,Order Management,Customer Management, Sales and Payments,Reporting and Analytics',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
