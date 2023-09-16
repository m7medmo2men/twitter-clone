import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // Only allow properties defined in the class schema
  //     // forbidNonWhitelisted: true, // Reject any additional properties
  //   }),
  // );
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(5000);
}
bootstrap();
