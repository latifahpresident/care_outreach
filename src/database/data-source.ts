import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { DataSource } from 'typeorm';
import { Plan } from '../modules/plans/plans.entity';
import { Coordinator } from '../modules/coordinators/coordinator.entity';
import { CoordinatorPlan } from '../modules/coordinators/coordinator-plan.entity';
import { Member } from '../modules/members/members.entity';
import { CallTask } from '../modules/tasks/call-task.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Plan, Coordinator, CoordinatorPlan, Member, CallTask],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
