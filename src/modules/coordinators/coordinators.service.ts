import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Coordinator } from './coordinator.entity';
import { CoordinatorPlan } from './coordinator-plan.entity';
import { CreateCoordinatorDto } from './dto/coordinator.dto';
import { Plan } from '../plans/plans.entity';

@Injectable()
export class CoordinatorsService {
  constructor(
    @InjectRepository(Coordinator)
    private readonly coordRepo: Repository<Coordinator>,
    @InjectRepository(CoordinatorPlan)
    private readonly cpRepo: Repository<CoordinatorPlan>,
    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,
  ) {}

  async create(dto: CreateCoordinatorDto) {
    if (dto.plan_ids?.length) {
      const plans = await this.planRepo.find({
        where: { id: In(dto.plan_ids) },
      });
      if (plans.length !== dto.plan_ids.length) {
        const foundIds = plans.map((p) => p.id);
        const missing = dto.plan_ids.filter((id) => !foundIds.includes(id));
        throw new NotFoundException(`Plans not found: ${missing.join(', ')}`);
      }
    }

    let coordinator: Coordinator;
    try {
      coordinator = await this.coordRepo.save(
        this.coordRepo.create({
          name: dto.name,
          email: dto.email,
        }),
      );
    } catch (err: any) {
      if (err?.code === '23505') {
        throw new ConflictException('Coordinator email already exists');
      }
      throw err;
    }

    if (dto.plan_ids?.length) {
      const linkEntities = dto.plan_ids.map((pid) =>
        this.cpRepo.create({
          coordinator_id: coordinator.id,
          plan_id: pid,
        }),
      );

      await this.cpRepo.save(linkEntities);
    }

    const withLinks = await this.coordRepo.findOne({
      where: { id: coordinator.id },
      relations: { planLinks: { plan: true } },
    });

    return withLinks!;
  }

  async findAll() {
    return this.coordRepo.find({
      relations: { planLinks: { plan: true } },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const coord = await this.coordRepo.findOne({
      where: { id },
      relations: { planLinks: { plan: true } },
    });
    if (!coord) throw new NotFoundException('Coordinator not found');
    return coord;
  }
}
