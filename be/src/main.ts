import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './utils/winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  app.enableCors();

  try {
    await app.listen(process.env.PORT ?? 4001);
  } catch (e) {
    winstonLogger.log('CRASH!!!', e);
  }
}

bootstrap();
