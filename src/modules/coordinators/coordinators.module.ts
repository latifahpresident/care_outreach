import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordinatorsService } from './coordinators.service';
import { CoordinatorsController } from './coordinators.controller';
import { Coordinator } from './coordinator.entity';
import { CoordinatorPlan } from './coordinator-plan.entity';
import { Plan } from '../plans/plans.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coordinator, CoordinatorPlan, Plan])],
  controllers: [CoordinatorsController],
  providers: [CoordinatorsService],
  exports: [CoordinatorsService],
})
export class CoordinatorsModule {}