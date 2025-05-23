import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

import { crawlMatch } from '../utils/crawl';
import { winstonLogger } from '../utils/winston';
import Global from '../global/global';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {
    this.setupCrawlSchedules();
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleDailyCron() {
    winstonLogger.log('begin daily crawl task');
    await crawlMatch();
    winstonLogger.log('end daily crawl task');
    await this.setupCrawlSchedules();
  }

  private async setupCrawlSchedules() {
    try {
      const jobs = this.schedulerRegistry.getCronJobs();
      jobs.forEach((_, name) => {
        if (name.startsWith('match_')) {
          this.schedulerRegistry.deleteCronJob(name);
        }
      });

      const matches = await Global.getData();
      matches.forEach((match, index) => {
        const week = match.kickoff?.week;
        const time = match.kickoff?.date?.trim();
        if (!week || !time) return;

        const [month, day] = week.split('.').map(Number);
        const [hour, minute] = time.split(':').map(Number);

        if (!month || !day || isNaN(hour) || isNaN(minute)) return;

        let crawlHour = hour + 2;
        let crawlDay = day;
        let crawlMonth = month;

        if (crawlHour >= 24) {
          crawlHour -= 24;
          crawlDay += 1;
          
          const lastDayOfMonth = new Date(new Date().getFullYear(), month, 0).getDate();
          if (crawlDay > lastDayOfMonth) {
            crawlDay = 1;
            crawlMonth += 1;
            if (crawlMonth > 12) {
              crawlMonth = 1;
            }
          }
        }

        const cronExpression = `${minute} ${crawlHour} ${crawlDay} ${crawlMonth} *`;
        winstonLogger.log(`cronExpression : ${cronExpression}`);
        const job = new CronJob(cronExpression, async () => {
          winstonLogger.log(
            `Executing crawl for match scheduled at ${week} ${time} (2 hours after match start)`,
          );
          await crawlMatch();
          winstonLogger.log(
            `Completed crawl for match scheduled at ${week} ${time} (2 hours after match start)`,
          );
        });

        this.schedulerRegistry.addCronJob(`match_${index}`, job);
        job.start();
        winstonLogger.log(`Scheduled crawl for match at ${week} ${time} (2 hours after match start)`);
      });
    } catch (error) {
      winstonLogger.error('Error setting up crawl schedules:', error);
    }
  }
}
