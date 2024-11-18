import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Global } from '../global/global';
import { crawlMatch } from '../utils/crawl';
import { winstonLogger } from '../utils/winston';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  // @Cron(CronExpression.EVERY_30_SECONDS)
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCron() {
    winstonLogger.log('begin crawl task', Global.matchData);
    await crawlMatch();
    winstonLogger.log('end crawl task', Global.matchData);
  }
}
