import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LoggerMiddleware } from './app/utils/logger'
import { DemoModule } from './demo/demo.module'
import { PrismaModule } from './prisma/prisma.module'

@Module({
    imports: [PrismaModule, DemoModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes(AppController)
    }
}
