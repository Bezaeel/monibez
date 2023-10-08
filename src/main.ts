import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, UnprocessableEntityException } from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';
import { json, urlencoded } from 'express';
import { TransformInterceptor } from './helpers/response-Interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // only show swagger on dev
  if (process.env.MODE == 'DEV') {
    const config = new DocumentBuilder()
      .setTitle('monibez')
      .setDescription('monibez Documentation')
      .setVersion('1.0')
      .addTag('monibez')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      validationError: {
        target: false,
      },
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT);
}
bootstrap();
