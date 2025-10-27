import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Member } from '../members/members.entity';
import { CoordinatorPlan } from '../coordinators/coordinator-plan.entity';
import { CallTask } from '../tasks/call-task.entity';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => CoordinatorPlan, (cp) => cp.plan)
  coordinatorLinks: CoordinatorPlan[];
  
  @OneToMany(() => Member, (m) => m.plan) 
  members: Member[];
  
  @OneToMany(() => CallTask, (t) => t.plan)
  tasks: CallTask[];

  @CreateDateColumn() created_at: Date;
}
