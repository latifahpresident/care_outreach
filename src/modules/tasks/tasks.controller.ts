import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly svc: TasksService) {}

  @Get()
  list(@Query('planId') planId: string, @Query('status') status: string) {
    return this.svc.listByPlanAndStatus(Number(planId), status);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTaskDto) {
    return this.svc.updateStatus(id, body);
  }

  @Post()
  createOne(
    @Body()
    body: {
      member_id: number;
      plan_id: number;
      assigned_cc_id?: number;
    },
  ) {
    return this.svc.createQueued(
      body.member_id,
      body.plan_id,
      body.assigned_cc_id,
    );
  }
}
