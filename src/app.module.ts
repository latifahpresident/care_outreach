import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Plan } from './modules/plans/plans.entity';
import { Member } from './modules/members/members.entity';
import { Coordinator } from './modules/coordinators/coordinator.entity';
import { CoordinatorPlan } from './modules/coordinators/coordinator-plan.entity';
import { CallTask } from './modules/tasks/call-task.entity';
import { PlansModule } from './modules/plans/plans.module';
import { CoordinatorsModule } from './modules/coordinators/coordinators.module';
import { MembersModule } from './modules/members/members.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env.local' 
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Plan, Member, Coordinator, CoordinatorPlan, CallTask],
      synchronize: true,
      logging: true,
    }),
    PlansModule,
    CoordinatorsModule,
    MembersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
