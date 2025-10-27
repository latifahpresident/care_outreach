import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { CoordinatorPlan } from './coordinator-plan.entity';
import { CallTask } from '../tasks/call-task.entity';

@Entity('coordinators')
export class Coordinator {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 100 }) name: string;

  @Column({ length: 100, unique: true }) email: string;

  @CreateDateColumn() created_at: Date;

  @OneToMany(() => CoordinatorPlan, (cp) => cp.coordinator)
  planLinks: CoordinatorPlan[];
  
  @OneToMany(() => CallTask, (t) => t.assignedCoordinator)
  assignedTasks: CallTask[];
}
