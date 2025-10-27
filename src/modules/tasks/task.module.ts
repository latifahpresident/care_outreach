import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CallTask } from './call-task.entity';
import { CoordinatorPlan } from '../coordinators/coordinator-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CallTask, CoordinatorPlan])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
