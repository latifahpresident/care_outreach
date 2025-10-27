import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { And, In, Repository } from 'typeorm';
import { CallTask } from './call-task.entity';
import { UpdateTaskDto } from './dto/task.dto';
import { CoordinatorPlan } from '../coordinators/coordinator-plan.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(CallTask) private readonly repo: Repository<CallTask>,
    @InjectRepository(CoordinatorPlan)
    private readonly cpRepo: Repository<CoordinatorPlan>,
  ) {}

  async listByPlanAndStatus(planId: number, status: string) {
    const valid = ['queued', 'in_progress', 'retry', 'completed'];
    if (!valid.includes(status))
      throw new BadRequestException('Invalid status');
    return this.repo.find({
      where: { plan_id: planId, status: status as any },
      relations: { member: true, assignedCoordinator: true },
      order: { created_at: 'ASC' },
    });
  }

  async updateStatus(id: number, body: UpdateTaskDto) {
    const task = await this.repo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    const next = body.status;

    if (next === 'in_progress') {
      if (!body.assigned_cc_id)
        throw new BadRequestException(
          'assigned_cc_id required for in_progress',
        );
      const link = await this.cpRepo.findOne({
        where: { coordinator_id: body.assigned_cc_id, plan_id: task.plan_id },
      });
      if (!link)
        throw new BadRequestException('Coordinator not linked to this plan');

      const updated = await this.repo
        .createQueryBuilder()
        .update(CallTask)
        .set({ status: 'in_progress', assigned_cc_id: body.assigned_cc_id })
        .where('id = :id', { id })
        .andWhere('status IN (:...allowed)', { allowed: ['queued', 'retry'] })
        .returning('*')
        .execute();

      if (!updated.affected) {
        throw new BadRequestException('Task is not claimable (state changed)');
      }
      return updated.raw[0];
    }

    if (next === 'retry') {
      const updated = await this.repo
        .createQueryBuilder()
        .update(CallTask)
        .set({ status: 'retry' })
        .where('id = :id', { id })
        .andWhere('status = :cur', { cur: 'in_progress' })
        .returning('*')
        .execute();
      if (!updated.affected)
        throw new BadRequestException('Only in_progress -> retry allowed');
      return updated.raw[0];
    }

    if (next === 'completed') {
      const updated = await this.repo
        .createQueryBuilder()
        .update(CallTask)
        .set({ status: 'completed', completed_at: () => 'now()' })
        .where('id = :id', { id })
        .andWhere('status IN (:...allowed)', {
          allowed: ['in_progress', 'retry'],
        })
        .returning('*')
        .execute();
      if (!updated.affected)
        throw new BadRequestException('Cannot complete from current status');
      return updated.raw[0];
    }

    throw new BadRequestException('Unsupported transition');
  }

  async createQueued(
    member_id: number,
    plan_id: number,
    assigned_cc_id?: number,
  ) {
    const exists = await this.repo.findOne({
      where: [
        { member_id, status: 'queued' as any },
        { member_id, status: 'in_progress' as any },
        { member_id, status: 'retry' as any },
      ],
    });
    if (exists)
      throw new BadRequestException('Member already has an open task');
    const entity = this.repo.create({
      member_id,
      plan_id,
      status: 'queued',
      assigned_cc_id,
    });
    return this.repo.save(entity);
  }
}
