import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Plan } from '../plans/plans.entity';
import { CallTask } from '../tasks/call-task.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'text', unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', unique: true, nullable: false })
  phone_number: string;

  @Column() plan_id: number;

  @ManyToOne(() => Plan, (p) => p.members, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @OneToMany(() => CallTask, (t) => t.member)
  tasks: CallTask[];

  @CreateDateColumn() created_ate: Date;
}
