import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './utils/winston';
import * as fs from 'fs';

async function bootstrap() {
  const isDev = process.env.NODE_ENV !== 'production';
  console.log('isDev', isDev);
  
  let app;
  if (isDev) {
    // 개발 환경: HTTP 사용
    app = await NestFactory.create(AppModule, {
      logger: winstonLogger,
    });
  } else {
    // 프로덕션 환경: HTTPS 사용
    const httpsOptions = {
      key: fs.readFileSync('/etc/letsencrypt/live/sontrackandpushbe.shop/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/sontrackandpushbe.shop/fullchain.pem'),
    };

    app = await NestFactory.create(AppModule, {
      logger: winstonLogger,
      httpsOptions,
    });
  }

  app.enableCors();

  try {
    await app.listen(process.env.PORT ?? 4001);
    winstonLogger.log(`Application is running on: ${isDev ? 'http' : 'https'}://localhost:${process.env.PORT ?? 4001}`);
  } catch (e) {
    winstonLogger.error('CRASH!!!', e);
  }
}

bootstrap();
