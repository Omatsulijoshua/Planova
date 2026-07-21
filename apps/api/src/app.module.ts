import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PreferencesModule } from './preferences/preferences.module';
import { CalendarModule } from './calendar/calendar.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RoutinesModule } from './routines/routines.module';
import { TasksModule } from './tasks/tasks.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PreferencesModule,
    CalendarModule,
    NotificationsModule,
    RoutinesModule,
    TasksModule,
    SchedulingModule,
    SubscriptionsModule,
    CollaborationModule,
    AnalyticsModule,
    FeedbackModule,
    AdminModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}






