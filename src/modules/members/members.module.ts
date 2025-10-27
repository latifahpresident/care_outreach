import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { Plan } from '../plans/plans.entity';
import { Member } from './members.entity';
import { CallTask } from '../tasks/call-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Member, CallTask])],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
