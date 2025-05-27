"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const task_controller_1 = require("./task/task.controller");
const task_service_1 = require("./task/task.service");
const schedule_1 = require("@nestjs/schedule");
const match_service_1 = require("./match/match.service");
const match_controller_1 = require("./match/match.controller");
const throttler_1 = require("@nestjs/throttler");
const notification_module_1 = require("./notification/notification.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 60,
                },
            ]),
            notification_module_1.NotificationModule,
        ],
        controllers: [app_controller_1.AppController, task_controller_1.TaskController, match_controller_1.MatchController],
        providers: [app_service_1.AppService, task_service_1.TaskService, match_service_1.MatchService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map