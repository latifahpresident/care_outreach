import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './plans.entity';
import { Repository } from 'typeorm';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan) private readonly repo: Repository<Plan>,
  ) {}

  async create(dto: CreatePlanDto): Promise<Plan> {
    try {
      const plan = this.repo.create(dto);
      return await this.repo.save(plan);
    } catch (error: any) {
      console.log(`Error from create plan ${error}`);
      throw `Error from create plan${error}`;
    }
  }

  async findOne(id: number): Promise<Plan> {
    try {
      const plan = await this.repo.findOne({ where: { id } });
      if (!plan) throw new NotFoundException('plan not found');
      return plan;
    } catch (error: any) {
      throw `Error unable to find that plan: ${error}`;
    }
  }

  async findAll(): Promise<Plan[]> {
    try {
      return await this.repo.find({ order: { id: 'ASC' } });
    } catch (error: any) {
      throw `Error no plans found`;
    }
  }

  async updatePlan(id: number, dto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.findOne(id);
    Object.assign(plan, dto);
    try {
      return await this.repo.save(plan);
    } catch (err: any) {
      if (err?.code === '23505')
        throw new ConflictException('Plan name already exists');
      throw err;
    }
  }
}
