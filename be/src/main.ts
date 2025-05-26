import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './utils/winston';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/sontrackandpushbe.shop/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/sontrackandpushbe.shop/fullchain.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
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
