"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonLogger = void 0;
const nest_winston_1 = require("nest-winston");
const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const dailyOption = (level) => {
    return {
        level,
        datePattern: 'YYYY-MM-DD',
        dirname: `./logs/${level}`,
        filename: `%DATE%.${level}.log`,
        maxFiles: 30,
        zippedArchive: true,
        format: winston.format.combine(winston.format.timestamp(), nest_winston_1.utilities.format.nestLike(process.env.NODE_ENV, {
            colors: false,
            prettyPrint: true,
        })),
    };
};
exports.winstonLogger = nest_winston_1.WinstonModule.createLogger({
    transports: [
        new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'http' : 'debug',
            format: winston.format.combine(winston.format.timestamp(), nest_winston_1.utilities.format.nestLike(process.env.NODE_ENV, {
                colors: true,
                prettyPrint: true,
            })),
        }),
        new winstonDaily(dailyOption('info')),
        new winstonDaily(dailyOption('warn')),
        new winstonDaily(dailyOption('error')),
    ],
});
//# sourceMappingURL=winston.js.map