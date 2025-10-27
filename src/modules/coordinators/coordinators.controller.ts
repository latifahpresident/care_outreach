import { Controller, Get, Post, Body } from '@nestjs/common';
import { CoordinatorsService } from './coordinators.service';
import { CreateCoordinatorDto } from './dto/coordinator.dto';

@Controller('coordinators')
export class CoordinatorsController {
  constructor(private readonly coordinatorsService: CoordinatorsService) {}

  @Post()
  create(@Body() createCoordinatorDto: CreateCoordinatorDto) {
    return this.coordinatorsService.create(createCoordinatorDto);
  }

  @Get()
  findAll() {
    return this.coordinatorsService.findAll();
  }
}