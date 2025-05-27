import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MatchService } from './match/match.service';
import { MatchController } from './match/match.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    NotificationModule,
  ],
  controllers: [AppController, TaskController, MatchController],
  providers: [AppService, TaskService, MatchService],
})
export class AppModule {}
