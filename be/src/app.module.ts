import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MatchService } from './match/match.service';
import { MatchController } from './match/match.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController, TaskController, MatchController],
  providers: [AppService, TaskService, MatchService],
})
export class AppModule {}
