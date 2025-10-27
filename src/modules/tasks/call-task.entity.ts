import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Member } from './../members/members.entity';
import { Plan } from '../plans/plans.entity';
import { Coordinator } from '../coordinators/coordinator.entity';

export type TaskStatus = 'queued' | 'in_progress' | 'retry' | 'completed';

@Entity('call_tasks')
@Index(['plan_id', 'status', 'created_at'])
@Index(['assigned_cc_id'])
@Index(['member_id'])
@Index(['status'])
@Index(['completed_at'])
export class CallTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  member_id: number;

  @ManyToOne(() => Member, (m) => m.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column()
  plan_id: number;

  @ManyToOne(() => Plan, (p) => p.tasks, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column({ nullable: true })
  assigned_cc_id?: number;

  @ManyToOne(() => Coordinator, (c) => c.assignedTasks, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'assigned_cc_id' })
  assignedCoordinator?: Coordinator;

  @Column({ type: 'varchar', length: 20, default: 'queued' })
  status: TaskStatus;

  @Column({ type: 'timestamp', nullable: true })
  completed_at?: Date;

  @Column({ type: 'boolean', default: false })
  email_reminder_required: boolean;

  @Column({ type: 'timestamp', nullable: true })
  reminder_email_sent_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
