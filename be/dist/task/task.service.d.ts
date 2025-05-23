import { SchedulerRegistry } from '@nestjs/schedule';
export declare class TaskService {
    private schedulerRegistry;
    private readonly logger;
    constructor(schedulerRegistry: SchedulerRegistry);
    handleDailyCron(): Promise<void>;
    private setupCrawlSchedules;
}
