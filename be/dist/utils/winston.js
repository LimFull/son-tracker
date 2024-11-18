"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonLogger = void 0;
const nest_winston_1 = require("nest-winston");
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const dailyOption = (level) => {
    return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: `./logs/${level}`,
        filename: `%DATE%.${level}.log`,
        maxFiles: 30,
        zippedArchive: true,
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), nest_winston_1.utilities.format.nestLike(process.env.NODE_ENV, {
            colors: false,
            prettyPrint: true,
        })),
    };
};
exports.winstonLogger = nest_winston_1.WinstonModule.createLogger({
    transports: [
        new winston_1.default.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'http' : 'debug',
            format: winston_1.default.format.combine(winston_1.default.format.timestamp(), nest_winston_1.utilities.format.nestLike(process.env.NODE_ENV, {
                colors: true,
                prettyPrint: true,
            })),
        }),
        new winston_daily_rotate_file_1.default(dailyOption('info')),
        new winston_daily_rotate_file_1.default(dailyOption('warn')),
        new winston_daily_rotate_file_1.default(dailyOption('error')),
    ],
});
//# sourceMappingURL=winston.js.map