"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var TaskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cron_1 = require("cron");
const crawl_1 = require("../utils/crawl");
const winston_1 = require("../utils/winston");
const global_1 = __importDefault(require("../global/global"));
let TaskService = TaskService_1 = class TaskService {
    constructor(schedulerRegistry) {
        this.schedulerRegistry = schedulerRegistry;
        this.logger = new common_1.Logger(TaskService_1.name);
        this.setupCrawlSchedules();
    }
    async handleDailyCron() {
        winston_1.winstonLogger.log('begin daily crawl task');
        await (0, crawl_1.crawlMatch)();
        winston_1.winstonLogger.log('end daily crawl task');
        await this.setupCrawlSchedules();
    }
    async setupCrawlSchedules() {
        try {
            const jobs = this.schedulerRegistry.getCronJobs();
            jobs.forEach((_, name) => {
                if (name.startsWith('match_')) {
                    this.schedulerRegistry.deleteCronJob(name);
                }
            });
            const matches = await global_1.default.getData();
            matches.forEach((match, index) => {
                const week = match.kickoff?.week;
                const time = match.kickoff?.date?.trim();
                if (!week || !time)
                    return;
                const [month, day] = week.split('.').map(Number);
                const [hour, minute] = time.split(':').map(Number);
                if (!month || !day || isNaN(hour) || isNaN(minute))
                    return;
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
                winston_1.winstonLogger.log(`cronExpression : ${cronExpression}`);
                const job = new cron_1.CronJob(cronExpression, async () => {
                    winston_1.winstonLogger.log(`Executing crawl for match scheduled at ${week} ${time} (2 hours after match start)`);
                    await (0, crawl_1.crawlMatch)();
                    winston_1.winstonLogger.log(`Completed crawl for match scheduled at ${week} ${time} (2 hours after match start)`);
                });
                this.schedulerRegistry.addCronJob(`match_${index}`, job);
                job.start();
                winston_1.winstonLogger.log(`Scheduled crawl for match at ${week} ${time} (2 hours after match start)`);
            });
        }
        catch (error) {
            winston_1.winstonLogger.error('Error setting up crawl schedules:', error);
        }
    }
};
exports.TaskService = TaskService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_1AM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TaskService.prototype, "handleDailyCron", null);
exports.TaskService = TaskService = TaskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [schedule_1.SchedulerRegistry])
], TaskService);
//# sourceMappingURL=task.service.js.map