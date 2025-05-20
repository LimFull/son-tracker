"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const winston_1 = require("./utils/winston");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: winston_1.winstonLogger,
    });
    app.enableCors();
    try {
        await app.listen(process.env.PORT ?? 4001);
    }
    catch (e) {
        winston_1.winstonLogger.log('CRASH!!!', e);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map