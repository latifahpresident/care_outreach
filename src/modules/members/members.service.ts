import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parse } from 'csv-parse/sync';
import { Plan } from '../plans/plans.entity';
import { Member } from './members.entity';
import { CallTask } from '../tasks/call-task.entity';

type CsvRow = {
  member_email: string;
  phone_number?: string;
  plan_name?: string;
  plan_id?: string | number;
};

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Plan) private readonly planRepo: Repository<Plan>,
    @InjectRepository(Member) private readonly memberRepo: Repository<Member>,
    @InjectRepository(CallTask) private readonly taskRepo: Repository<CallTask>,
  ) {}

  async importCsv(buffer: Buffer) {
    const rows = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CsvRow[];

    if (!rows.length) throw new BadRequestException('CSV has no rows');

    const results = {
      createdPlans: 0,
      createdMembers: 0,
      updatedMembers: 0,
      createdTasks: 0,
      skippedTasksAlreadyOpen: 0,
    };

    const planNameToId = new Map<string, number>();

    for (const r of rows) {
      const email = r.member_email?.toLowerCase();
      if (!email) throw new BadRequestException('member_email is required');

      let planId: number | undefined;
      if (r.plan_id !== undefined && r.plan_id !== null && r.plan_id !== '') {
        const pid = Number(r.plan_id);
        if (!Number.isFinite(pid))
          throw new BadRequestException(`Invalid plan_id for ${email}`);
        const exists = await this.planRepo.findOne({ where: { id: pid } });
        if (!exists)
          throw new BadRequestException(
            `plan_id ${pid} not found for ${email}`,
          );
        planId = pid;
      } else if (r.plan_name) {
        const name = r.plan_name.trim();
        if (!name)
          throw new BadRequestException(`Empty plan_name for ${email}`);

        const cached = planNameToId.get(name);
        if (cached) {
          planId = cached;
        } else {
          let plan = await this.planRepo.findOne({ where: { name } });
          if (!plan) {
            plan = this.planRepo.create({ name });
            plan = await this.planRepo.save(plan);
            results.createdPlans += 1;
          }
          planId = plan.id;
          planNameToId.set(name, planId);
        }
      } else {
        throw new BadRequestException(
          `Either plan_id or plan_name is required for ${email}`,
        );
      }

      let member = await this.memberRepo.findOne({ where: { email } });
      if (!member) {
        if (!r.phone_number) {
          throw new BadRequestException(
            `phone_number is required for ${email}`,
          );
        }
        member = this.memberRepo.create({
          email,
          phone_number: r.phone_number,
          plan_id: planId!,
        });
        await this.memberRepo.save(member);
        results.createdMembers += 1;
      } else {
        let changed = false;
        if (member.plan_id !== planId) {
          member.plan_id = planId!;
          changed = true;
        }
        if (r.phone_number && member.phone_number !== r.phone_number) {
          member.phone_number = r.phone_number;
          changed = true;
        }
        if (changed) {
          await this.memberRepo.save(member);
          results.updatedMembers += 1;
        }
      }

      const open = await this.taskRepo.findOne({
        where: [
          { member_id: member.id, status: 'queued' as any },
          { member_id: member.id, status: 'in_progress' as any },
          { member_id: member.id, status: 'retry' as any },
        ],
      });

      if (open) {
        results.skippedTasksAlreadyOpen += 1;
      } else {
        const task = this.taskRepo.create({
          member_id: member.id,
          plan_id: planId!,
          status: 'queued',
        });
        await this.taskRepo.save(task);
        results.createdTasks += 1;
      }
    }

    return { ok: true, ...results };
  }

  async findAll() {
    return this.memberRepo.find({ order: { id: 'ASC' } });
  }
}
