import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Coordinator } from './coordinator.entity';
import { Plan } from '../plans/plans.entity';

@Entity('coordinator_plans')
@Index(['coordinator_id', 'plan_id'], { unique: true })
export class CoordinatorPlan {
  @PrimaryGeneratedColumn() id: number;

  @Column() coordinator_id: number;
  @Column() plan_id: number;

  @ManyToOne(() => Coordinator, (c) => c.planLinks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'coordinator_id' })
  coordinator: Coordinator;

  @ManyToOne(() => Plan, (p) => p.coordinatorLinks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;
}
